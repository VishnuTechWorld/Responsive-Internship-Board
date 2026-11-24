
const express = require("express");
const app = express();

require("./database");

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Internship REST API is running!"
    });
});

app.use("/api/internships", require("./routes/internships"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
