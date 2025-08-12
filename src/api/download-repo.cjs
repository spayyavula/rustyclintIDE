const express = require('express');
const AdmZip = require('adm-zip');
const path = require('path');
const fs = require('fs/promises');
const fetch = require('node-fetch');

const router = express.Router();

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

router.post('/api/download-repo', async (req, res) => {
  const { owner, repo, branch, workspaceDir } = req.body;
  try {
    await downloadAndExtractRepo(owner, repo, branch, workspaceDir);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;