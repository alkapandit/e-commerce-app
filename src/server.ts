import "dotenv/config";
import app from "./app";
import prisma from "./common/config/prisma";

const PORT = process.env.PORT;

// Server start
const startServer = async () => {
  try {
    // Optional: simple Prisma health check
    await prisma.$connect();
    console.log("✅ Database Connected (Prisma)");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server startup failed", error);
    process.exit(1);
  }
};

startServer();
