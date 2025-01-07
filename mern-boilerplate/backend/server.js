import express from "express";
import cors from "cors";
import colors from "colors";
import dotenv from "dotenv";
import { rateLimit } from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import { errorHandler } from "./middlewares/errorHandler.js";
import userRoutes from "./routes/userRoutes.js";
import connectDB from "./config/database.js";

dotenv.config();

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Increase timeout and request size limits
app.timeout = 300000;
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// CORS configuration with all production and development origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    maxAge: 86400, // 24 hours
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

// Handle preflight requests
app.options("*", cors());

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.use("/static", express.static(path.join(__dirname, "..", "static")));

// Create required directories
const uploadsDir = path.join(__dirname, "..", "uploads");
const staticDir = path.join(__dirname, "..", "static");
const tempDir = path.join(__dirname, "..", "temp");

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip || "default-key",
  handler: (req, res) => {
    res.status(429).json({
      message: "Too many requests, please try again later.",
    });
  },
});

app.use(limiter);

// Routes
app.use("/api/v1/user", userRoutes);

// default routes
app.use("*", (req, res) => {
  return res.json({
    message: "URL not found!",
  });
});

// Error handling
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 8080;

async function startServer() {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`.bgGreen.white);
  });

  server.setTimeout(100 * 60 * 1000);
  server.keepAliveTimeout = 600000;
  server.headersTimeout = 600000;
}

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});

process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection:", error);
});

startServer();
