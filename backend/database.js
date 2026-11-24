
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./internships.db", (err) => {
    if (err) {
        console.error("Database connection failed:", err.message);
    } else {
        console.log("SQLite Database Connected!");
    }
});

// Create internships table
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS internships (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            company TEXT NOT NULL,
            domain TEXT NOT NULL,
            mode TEXT DEFAULT 'Remote',
            duration TEXT,
            stipend INTEGER DEFAULT 0,
            description TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
});

module.exports = db;
