
const express = require("express");
const cors = require("cors");
const app = express();

// Connect SQLite Database
require("./database");

// Allowed frontend URLs
const allowedOrigins = [
    "https://responsive-internship-board-hlz3.vercel.app",
    "https://probable-space-parakeet-j66g7576qxjhppwg-5500.app.github.dev"
];

// CORS Configuration
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests without origin (Postman, curl, etc.)
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error("CORS policy: Origin not allowed"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }));

// Health Check API
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Internship REST API is running!",
        status: "Live",
        version: "1.0.0"
    });
});

// API Health Check
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Backend is healthy"
    });
});

// Internship CRUD Routes
app.use("/api/internships", require("./routes/internships"));

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API route not found"
    });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error("API Error:", err.message);

    if (err.message.startsWith("CORS policy")) {
        return res.status(403).json({
            success: false,
            message: "CORS error: This origin is not allowed"
        });
    }

    if (err instanceof SyntaxError && err.status === 400) {
        return res.status(400).json({
            success: false,
            message: "Invalid JSON request"
        });
    }

    res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });
});

// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
