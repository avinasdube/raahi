import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/dbConfig.js";
import apiRouter from "./routes/index.js";

dotenv.config({
  path: "./.env",
});

// App
const app = express();

const PORT = process.env.PORT || 8800;
const corsEnv = process.env.CORS_ORIGIN;
const allowedOrigins = corsEnv
  ? corsEnv.split(",").map((o) => o.trim())
  : [
      "http://localhost:3000",
      "http://localhost:5173", // Vite default
      "http://127.0.0.1:5173",
      "http://127.0.0.1:3000",
    ];

// CORS
const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (CLI, mobile)
    if (!origin) return callback(null, true);
    const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(
      origin
    );
    if (allowedOrigins.includes(origin) || isLocalhost) {
      return callback(null, true);
    }
    // Do not throw; just deny CORS for this origin
    return callback(null, false);
  },
  credentials: true,
  optionsSuccessStatus: 204,
};

// Handle CORS
app.use(cors(corsOptions));

// Ensure preflight succeeds
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const isLocalhost =
    origin && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
  if (origin && (allowedOrigins.includes(origin) || isLocalhost)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Vary", "Origin");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// Explicit OPTIONS handler compatible with Express 5 path-to-regexp
app.options(/.*/, (req, res) => {
  const origin = req.headers.origin;
  const isLocalhost =
    origin && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
  if (origin && (allowedOrigins.includes(origin) || isLocalhost)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Vary", "Origin");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.sendStatus(204);
});
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Routes
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Hi, from index.js. Your server is running successfully.",
    port: PORT || 5000,
    timestamp: new Date().toISOString(),
  });
});

app.use("/api", apiRouter);

// Start after DB connects
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server is running at Port: ${PORT}`);
      console.log(`🌍 CORS enabled for: ${allowedOrigins.join(", ")}`);
    });
  })
  .catch((error) => {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  });
