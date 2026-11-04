import express from "express";
import Redis from "ioredis";

const app = express();

app.use(express.json());

// Use the environment variables correctly
const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
});

const PORT = process.env.PORT || 5001;

app.post("/user/:id/json", async (req, res) => {
  await redis.set(`user:${req.params.id}:json`, JSON.stringify(req.body));
  res.json({ savedAs: "json" });
});

app.get("/user/:id/json", async (req, res) => {
  const data = await redis.get(`user:${req.params.id}:json`);
  res.json({ user: data ? JSON.parse(data) : null });
});

app.post("/user/:id/hash", async (req, res) => {
  await redis.hset(`user:${req.params.id}:hash`, req.body);
  res.json({ savedAs: "json" });
});

app.get("/user/:id/hash", async (req, res) => {
  const data = await redis.hgetall(`user:${req.params.id}:hash`);
  res.json({ data });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

/*
set -> store single variable
hset -> store object
hgetall -> like getting entire object
hget
hdel
hexists
*/
