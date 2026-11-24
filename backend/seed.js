const db = require("./database");
const internships = require("./data/internships.json");

db.serialize(() => {
  const stmt = db.prepare(`
    INSERT INTO internships
    (title, company, domain, mode, duration, stipend, description)
    SELECT ?, ?, ?, ?, ?, ?, ?
    WHERE NOT EXISTS (
      SELECT 1 FROM internships WHERE title = ? AND company = ?
    )
  `);

  internships.forEach((item) => {
    stmt.run([
      item.title,
      item.company,
      item.domain,
      item.mode,
      item.duration,
      item.stipend,
      item.description,
      item.title,
      item.company
    ]);
  });

  stmt.finalize(() => {
    console.log("Sample internships imported successfully!");
    db.close();
  });
});
