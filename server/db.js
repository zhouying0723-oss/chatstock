const Database = require('better-sqlite3')
const path = require('path')

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'data', 'chatstock.db')

let db

function getDb() {
  if (!db) {
    const fs = require('fs')
    const dir = path.dirname(DB_PATH)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    db = new Database(DB_PATH)
    db.pragma('journal_mode = WAL')
    migrate()
  }
  return db
}

function migrate() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      id            INTEGER PRIMARY KEY CHECK (id = 1),
      ai_endpoint   TEXT NOT NULL DEFAULT '',
      ai_api_key    TEXT NOT NULL DEFAULT '',
      ai_model      TEXT NOT NULL DEFAULT '',
      updated_at    INTEGER NOT NULL DEFAULT (unixepoch())
    );

    CREATE TABLE IF NOT EXISTS questions (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      stock_code    TEXT NOT NULL,
      stock_name    TEXT NOT NULL,
      question      TEXT NOT NULL,
      source_type   TEXT NOT NULL DEFAULT '',
      source_title  TEXT NOT NULL DEFAULT '',
      source_url    TEXT NOT NULL DEFAULT '',
      useful        INTEGER,
      created_at    INTEGER NOT NULL DEFAULT (unixepoch())
    );

    CREATE INDEX IF NOT EXISTS idx_questions_stock ON questions(stock_code);
    CREATE INDEX IF NOT EXISTS idx_questions_created ON questions(created_at DESC);

    CREATE TABLE IF NOT EXISTS query_history (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      keyword       TEXT NOT NULL,
      stock_code    TEXT NOT NULL,
      stock_name    TEXT NOT NULL,
      created_at    INTEGER NOT NULL DEFAULT (unixepoch())
    );

    CREATE INDEX IF NOT EXISTS idx_history_created ON query_history(created_at DESC);
  `)
}

// Settings
function getSettings() {
  return getDb().prepare('SELECT * FROM settings WHERE id = 1').get() || null
}

function upsertSettings(aiEndpoint, aiApiKey, aiModel) {
  const existing = getSettings()
  if (existing) {
    getDb().prepare('UPDATE settings SET ai_endpoint = ?, ai_api_key = ?, ai_model = ?, updated_at = unixepoch() WHERE id = 1')
      .run(aiEndpoint, aiApiKey, aiModel)
  } else {
    getDb().prepare('INSERT INTO settings (id, ai_endpoint, ai_api_key, ai_model) VALUES (1, ?, ?, ?)')
      .run(aiEndpoint, aiApiKey, aiModel)
  }
}

// Questions
function insertQuestions(items) {
  const stmt = getDb().prepare(
    'INSERT INTO questions (stock_code, stock_name, question, source_type, source_title, source_url) VALUES (?, ?, ?, ?, ?, ?)'
  )
  return items.map(item => {
    const r = stmt.run(item.stockCode, item.stockName, item.question, item.sourceType, item.sourceTitle, item.sourceUrl)
    return { id: r.lastInsertRowid, ...item }
  })
}

function updateQuestionFeedback(id, useful) {
  getDb().prepare('UPDATE questions SET useful = ? WHERE id = ?').run(useful ? 1 : 0, id)
}

function getRecentQuestions(stockCode, limit = 10) {
  return getDb().prepare('SELECT * FROM questions WHERE stock_code = ? ORDER BY created_at DESC LIMIT ?').all(stockCode, limit)
}

// Query history
function insertQueryHistory(keyword, stockCode, stockName) {
  getDb().prepare('INSERT INTO query_history (keyword, stock_code, stock_name) VALUES (?, ?, ?)').run(keyword, stockCode, stockName)
}

function getRecentHistory(limit = 10) {
  return getDb().prepare('SELECT * FROM query_history ORDER BY created_at DESC LIMIT ?').all(limit)
}

module.exports = { getDb, getSettings, upsertSettings, insertQuestions, updateQuestionFeedback, getRecentQuestions, insertQueryHistory, getRecentHistory }
