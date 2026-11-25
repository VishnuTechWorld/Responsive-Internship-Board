
const cors = require("cors");
const express = require("express");
const app = express();

// Database connection
require("./database");

// Allowed frontend URLs
const allowedOrigins = [
    "https://probable-space-parakeet-j66g7576qxjhppwg-5500.app.github.dev",
    "https://responsive-internship-board-8qqb.vercel.app"
];

// CORS Configuration
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests without an Origin header
        // and requests from approved frontend URLs
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Handle preflight requests
app.options(/.*/, cors());

// Parse JSON requests
app.use(express.json());

// Home API
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Internship REST API is running!"
    });
});

// Internship API Routes
app.use("/api/internships", require("./routes/internships"));

// Server Configuration
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
