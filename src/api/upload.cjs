const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs/promises');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const WORKSPACE_DIR = path.resolve(__dirname, '../../workspace');

router.post('/upload', upload.array('files'), async (req, res) => {
  try {
    for (const file of req.files) {
      const dest = path.join(WORKSPACE_DIR, file.originalname);
      await fs.mkdir(path.dirname(dest), { recursive: true });
      await fs.writeFile(dest, file.buffer);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;