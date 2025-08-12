const express = require('express');
const fs = require('fs-extra');
const path = require('path');

const router = express.Router();

const WORKSPACE_DIR = path.resolve(__dirname, '../../workspace'); // Adjust as needed

// Helper: Recursively build file tree
async function getFileTree(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return Promise.all(entries.map(async entry => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return {
        name: entry.name,
        type: 'folder',
        children: await getFileTree(fullPath)
      };
    } else {
      return {
        name: entry.name,
        type: 'file'
      };
    }
  }));
}

// GET /api/file-tree
router.get('/file-tree', async (req, res) => {
  try {
    const tree = await getFileTree(WORKSPACE_DIR);
    res.json(tree);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;