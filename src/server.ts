import pool from "./common/config/db";
import express from "express";

const app = express();
const PORT = 3000;

// Server start
const startServer = async () => {
  try {
    await pool.query("SELECT 1");
    console.log("✅ Database Connected");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Database connection failed", error);
    process.exit(1);
  }
};

startServer();
