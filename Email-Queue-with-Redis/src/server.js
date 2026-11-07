import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());

const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
});

const QUEUE_KEY = "queue:emails";

app.get("/", (req, res) => {
  res.send("Email Queue Server is running...");
});

app.post("/emails", async (req, res) => {
  const job = {
    to: req.body.to,
    subject: req.body.subject || "No subject",
    body: req.body.body || "No content",
    createdAt: new Date().toISOString(),
  };

  await redis.lpush(QUEUE_KEY, JSON.stringify(job));
  res.json({ queued: true, job });
});

app.get("/emails/process-one", async (req, res) => {
  const rowJob = await redis.rpop(QUEUE_KEY);
  if (!rowJob) {
    return res.json({ processed: false, message: "No jobs in the queue" });
  }

  const job = JSON.parse(rowJob);
  // Simulate processing the job
  res.json({ message: "Eamail sent", job });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Drawbacks of Redis
// 1. Job loss
// 2. Retry system
// 3. Parallel workers
