const Database = require('better-sqlite3');
const db = new Database('/data/medreminders.db');

// Create table
db.prepare(`
    CREATE TABLE IF NOT EXISTS reminders (
        id INTEGER PRIMARY KEY,
        email TEXT,
        task TEXT,
        time TEXT,
        frequency TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
`).run();

module.exports = db;