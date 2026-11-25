
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./internships.db", (err) => {
    if (err) {
        console.error("Database connection failed:", err.message);
    } else {
        console.log("SQLite Database Connected!");
    }
});

const sampleInternships = [
    {
        title: "Frontend Developer Intern",
        company: "Tech Solutions",
        domain: "Web Development",
        mode: "Remote",
        duration: "3 months",
        stipend: 15000,
        description: "Learn advanced frontend development"
    },
    {
        title: "Python Developer Intern",
        company: "Code Labs",
        domain: "Python",
        mode: "Hybrid",
        duration: "2 months",
        stipend: 8000,
        description: "Learn Python programming and backend development."
    },
    {
        title: "Machine Learning Intern",
        company: "AI Innovations",
        domain: "AI/ML",
        mode: "Remote",
        duration: "3 months",
        stipend: 10000,
        description: "Work on machine learning models and data analysis."
    }
];

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
    `, (err) => {
        if (err) console.error("Table creation failed:", err.message);
    });

    db.get("SELECT COUNT(*) AS total FROM internships", (err, row) => {
        if (err) {
            console.error("Database check failed:", err.message);
            return;
        }

        if (row.total === 0) {
            const stmt = db.prepare(`
                INSERT INTO internships
                (title, company, domain, mode, duration, stipend, description)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `);

            sampleInternships.forEach((job) => {
                stmt.run(
                    job.title,
                    job.company,
                    job.domain,
                    job.mode,
                    job.duration,
                    job.stipend,
                    job.description
                );
            });

            stmt.finalize(() => {
                console.log("Sample internships added successfully!");
            });
        } else {
            console.log("Existing internships found. Seeding skipped.");
        }
    });
});

module.exports = db;
