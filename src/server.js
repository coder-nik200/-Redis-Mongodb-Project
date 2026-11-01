require("dotenv").config();

const express = require("express");

const redis = require("./config/redis");
const connectMongoDB = require("./config/mongodb");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Redis and MongoDB server is running!");
});

// Redis connection test
app.get("/redis", async (req, res) => {
  try {
    const result = await redis.ping();

    res.json({
      success: true,
      database: "Redis",
      response: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// MongoDB connection test
app.get("/mongodb", (req, res) => {
  const isConnected = require("mongoose").connection.readyState === 1;

  res.json({
    success: isConnected,
    database: "MongoDB",
    status: isConnected ? "Connected" : "Disconnected",
  });
});

const startServer = async () => {
  try {
    await connectMongoDB();

    await redis.ping();

    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
