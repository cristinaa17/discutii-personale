const Database = require('better-sqlite3');
const { dbPath } = require('./runtime-paths');

console.log(`[DB] Using database file: ${dbPath}`);

const rawDb = new Database(dbPath);
rawDb.pragma('foreign_keys = ON');

function runMigrations() {
  rawDb.exec(`
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
    );

    CREATE TABLE IF NOT EXISTS discussion (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      memberId INTEGER,
      text TEXT,
      date TEXT,
      hasFollowUp INTEGER DEFAULT 0,
      FOREIGN KEY(memberId) REFERENCES member(id) ON DELETE CASCADE
    );
  `);

  try {
    rawDb.exec(`ALTER TABLE member ADD COLUMN isDeleted INTEGER DEFAULT 0`);
  } catch (err) {
    if (!String(err.message).includes('duplicate column name')) {
      console.error('[DB] Failed to add isDeleted column:', err.message);
    }
  }

  try {
    rawDb.exec(`ALTER TABLE discussion ADD COLUMN hasFollowUp INTEGER DEFAULT 0`);
  } catch (err) {
    if (!String(err.message).includes('duplicate column name')) {
      console.error('[DB] Failed to add hasFollowUp column:', err.message);
    }
  }
}

function normalizeArgs(sql, params, cb) {
  if (typeof params === 'function') {
    return { params: [], cb: params };
  }

  return {
    params: Array.isArray(params) ? params : [params],
    cb,
  };
}

const db = {
  serialize(fn) {
    fn();
  },
  run(sql, params, cb) {
    const normalized = normalizeArgs(sql, params, cb);

    try {
      const info = rawDb.prepare(sql).run(...normalized.params);
      normalized.cb?.call({ lastID: Number(info.lastInsertRowid), changes: info.changes }, null);
    } catch (err) {
      normalized.cb?.(err);
    }
  },
  get(sql, params, cb) {
    const normalized = normalizeArgs(sql, params, cb);

    try {
      const row = rawDb.prepare(sql).get(...normalized.params);
      normalized.cb?.(null, row);
    } catch (err) {
      normalized.cb?.(err);
    }
  },
  all(sql, params, cb) {
    const normalized = normalizeArgs(sql, params, cb);

    try {
      const rows = rawDb.prepare(sql).all(...normalized.params);
      normalized.cb?.(null, rows);
    } catch (err) {
      normalized.cb?.(err);
    }
  },
};

runMigrations();

module.exports = db;
