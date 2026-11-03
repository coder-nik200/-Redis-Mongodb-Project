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

function otpKey(phone) {
  return `otp:${phone}`;
}

app.get("/", (req, res) => {
  res.send("Server is running...");
});

app.post("/otp", async (req, res) => {
  const { phone } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await redis.set(otpKey(phone), otp, "EX", 30); // OTP valid for 30 seconds

  res.json({ message: "OTP sent", otp });
});

app.post("/otp/verify", async (req, res) => {
  const { phone, otp } = req.body;
  const savedOtp = await redis.get(otpKey(phone));

  if (!savedOtp) {
    return res.status(400).json({ message: "OTP expired or not found" });
  }

  if (savedOtp != otp) {
    return res.status(400).json({ message: "Invalid otp" });
  }

  await redis.del(otpKey(phone));
  res.json({ message: "OTP verified successfully" });
});

// TTL - Time To Live
app.get("/otp/:phone/ttl", async (req, res) => {
  const ttl = await redis.ttl(otpKey(req.params.phone));
  res.json({ ttl });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
