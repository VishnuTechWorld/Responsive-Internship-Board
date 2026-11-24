
const express = require("express");
const router = express.Router();
const db = require("../database");

// GET: All internships with pagination
router.get("/", (req, res) => {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 5));
    const offset = (page - 1) * limit;

    db.get(
        "SELECT COUNT(*) AS total FROM internships",
        (err, count) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            db.all(
                "SELECT * FROM internships ORDER BY id DESC LIMIT ? OFFSET ?",
                [limit, offset],
                (err, rows) => {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }

                    res.json({
                        success: true,
                        page,
                        limit,
                        total: count.total,
                        data: rows
                    });
                }
            );
        }
    );
});

// GET: Internship by ID
router.get("/:id", (req, res) => {
    db.get(
        "SELECT * FROM internships WHERE id = ?",
        [req.params.id],
        (err, row) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (!row) {
                return res.status(404).json({
                    error: "Internship not found"
                });
            }

            res.json({ success: true, data: row });
        }
    );
});

// POST: Create internship
router.post("/", (req, res) => {
    const {
        title, company, domain, mode,
        duration, stipend, description
    } = req.body;

    if (
        typeof title !== "string" || !title.trim() ||
        typeof company !== "string" || !company.trim() ||
        typeof domain !== "string" || !domain.trim()
    ) {
        return res.status(400).json({
            error: "Title, company and domain are required"
        });
    }

    const amount = stipend === undefined ? 0 : Number(stipend);

    if (!Number.isInteger(amount) || amount < 0) {
        return res.status(400).json({
            error: "Stipend must be a non-negative integer"
        });
    }

    db.run(
        `INSERT INTO internships
        (title, company, domain, mode, duration, stipend, description)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            title.trim(), company.trim(), domain.trim(),
            mode || "Remote", duration || "",
            amount, description || ""
        ],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.status(201).json({
                success: true,
                message: "Internship created",
                id: this.lastID
            });
        }
    );
});

// PUT: Update internship
router.put("/:id", (req, res) => {
    const {
        title, company, domain, mode,
        duration, stipend, description
    } = req.body;

    if (
        typeof title !== "string" || !title.trim() ||
        typeof company !== "string" || !company.trim() ||
        typeof domain !== "string" || !domain.trim()
    ) {
        return res.status(400).json({
            error: "Title, company and domain are required"
        });
    }

    const amount = stipend === undefined ? 0 : Number(stipend);

    if (!Number.isInteger(amount) || amount < 0) {
        return res.status(400).json({
            error: "Invalid stipend"
        });
    }

    db.run(
        `UPDATE internships SET
        title=?, company=?, domain=?, mode=?,
        duration=?, stipend=?, description=?
        WHERE id=?`,
        [
            title.trim(), company.trim(), domain.trim(),
            mode || "Remote", duration || "",
            amount, description || "", req.params.id
        ],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    error: "Internship not found"
                });
            }

            res.json({
                success: true,
                message: "Internship updated"
            });
        }
    );
});

// DELETE: Remove internship
router.delete("/:id", (req, res) => {
    db.run(
        "DELETE FROM internships WHERE id = ?",
        [req.params.id],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    error: "Internship not found"
                });
            }

            res.json({
                success: true,
                message: "Internship deleted"
            });
        }
    );
});

module.exports = router;
