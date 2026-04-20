const fs = require('fs');
const path = require('path');

const dataDir = process.env.DATA_DIR || __dirname;
const dbPath = process.env.DB_PATH || path.join(dataDir, 'hr.db');
const uploadsDir = process.env.UPLOADS_DIR || path.join(dataDir, 'uploads');

fs.mkdirSync(path.dirname(dbPath), { recursive: true });
fs.mkdirSync(uploadsDir, { recursive: true });

module.exports = {
  dataDir,
  dbPath,
  uploadsDir,
};
