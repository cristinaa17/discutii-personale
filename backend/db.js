const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'hr.db');

// Log which database file we are using so it's obvious on startup
console.log(`[DB] Using database file: ${dbPath}`);

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`PRAGMA foreign_keys = ON`);

  db.run(`
    CREATE TABLE IF NOT EXISTS member (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      perNr INTEGER,
      nume TEXT,
      dataAngajarii TEXT,
      email TEXT,
      dataNasterii TEXT,
      gen TEXT,
      oras TEXT,
      departament TEXT,
      businessUnit TEXT,
      norma INTEGER,
      fte INTEGER,
      formaColaborare TEXT,
      tipContract TEXT,
      functie TEXT,
      dreptConcediu INTEGER,
      hrManager TEXT,
      project TEXT,
      projectStartDate TEXT,
      projectEndDate TEXT,
      client TEXT,
      projectManager TEXT,
      german TEXT,
      english TEXT,
      gLevel TEXT,
      skills TEXT,
      photoUrl TEXT,
      isDeleted INTEGER DEFAULT 0
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS discussion (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      memberId INTEGER,
      text TEXT,
      date TEXT,
      FOREIGN KEY(memberId) REFERENCES member(id) ON DELETE CASCADE
    )
  `);

  db.run(
  `ALTER TABLE member ADD COLUMN isDeleted INTEGER DEFAULT 0`,
  (err) => {
    if (err && !String(err.message).includes('duplicate column name')) {
      console.error('[DB] Failed to add isDeleted column:', err.message);
    }
  }
);

db.run(
  `ALTER TABLE discussion ADD COLUMN hasFollowUp INTEGER DEFAULT 0`,
  (err) => {
    if (err && !String(err.message).includes('duplicate column name')) {
      console.error('[DB] Failed to add hasFollowUp column:', err.message);
    }
  }
);
});

module.exports = db;
