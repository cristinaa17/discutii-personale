const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./hr.db');

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
      photoUrl TEXT
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
});

module.exports = db;
