import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/dbConfig.js";

dotenv.config({
  path: "./.env",
});

// creating an experss app
const app = express();

const PORT = process.env.PORT || 8800;
const corsEnv = process.env.CORS_ORIGIN;
const allowedOrigins = corsEnv
  ? corsEnv.split(",").map((o) => o.trim())
  : ["http://localhost:3000"];

// middleware config
const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// routes
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Hi, from index.js. Your server is running successfully.",
    port: PORT || 5000,
    timestamp: new Date().toISOString(),
  });
});

// start server if database is connected
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
