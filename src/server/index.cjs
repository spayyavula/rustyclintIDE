const express = require('express');
const path = require('path');
const cors = require('cors');
const AdmZip = require('adm-zip');
const fs = require('fs/promises');
const fetch = require('node-fetch');
const WebSocket = require('ws');
const http = require('http');
const fileTreeRouter = require('../api/file-tree.cjs');
const uploadRouter = require('../api/upload.cjs');

const app = express();
const PORT = process.env.PORT || 3001;
const WS_PORT = process.env.WS_PORT || 3002;

app.use(cors());
app.use(express.json());
app.use(fileTreeRouter);
app.use(uploadRouter);

// Download and extract a GitHub repo (moved from download-repo.ts and downloadAndExtractRepo.ts)
async function downloadAndExtractRepo(owner, repo, branch = 'main', workspaceDir) {
  const zipUrl = `https://github.com/${owner}/${repo}/archive/refs/heads/${branch}.zip`;
  const response = await fetch(zipUrl);
  if (!response.ok) {
    throw new Error(`Failed to download repo: ${response.statusText}`);
  }
  const buffer = await response.buffer();
  const zip = new AdmZip(buffer);
  const zipEntries = zip.getEntries();
  for (const entry of zipEntries) {
    if (entry.isDirectory) continue;
    // Remove the top-level folder (e.g., repo-main/)
    const parts = entry.entryName.split('/').slice(1);
    if (parts.length === 0) continue;
    const filePath = path.join(workspaceDir, ...parts);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, entry.getData());
  }
}

app.post('/api/download-repo', async (req, res) => {
  const { owner, repo, branch, workspaceDir } = req.body;
  try {
    await downloadAndExtractRepo(owner, repo, branch, workspaceDir);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Example API endpoint
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the Node server!' });
});

// Serve static files from the Vite build (optional, for production)
app.use(express.static(path.join(__dirname, '../dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Node server running on http://localhost:${PORT}`);
});

// Create WebSocket server
const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      // Broadcast to all connected clients
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
        }
      });
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  });
  
  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
  
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

server.listen(WS_PORT, () => {
  console.log(`WebSocket server running on ws://localhost:${WS_PORT}`);
});
