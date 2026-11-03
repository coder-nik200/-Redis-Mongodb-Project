const redis = require("../config/redis");

const BANNER_KEY = "website:banner";

// CREATE BANNER
exports.createBanner = async (req, res) => {
  await redis.set(BANNER_KEY, JSON.stringify(req.body));
  res.json({ message: "Banner created successfully" });
};

// GET BANNER
exports.getBanner = async (req, res) => {
  const message = await redis.get(BANNER_KEY);
  res.json({ message: message ? JSON.parse(message) : null });
};

// DELETE BANNER
exports.deleteBanner = async (req, res) => {
  await redis.del(BANNER_KEY);
  res.json({ success: true });
};

// CHECK BANNER EXISTS
exports.checkBanner = async (req, res) => {
  const exists = await redis.exists(BANNER_KEY);
  res.json({ exists: Boolean(exists) });
};
