import "dotenv/config";
import app from "./app";
import pool from "./common/config/db";
import { env } from "./common/config/env";

const PORT = env.port;

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
