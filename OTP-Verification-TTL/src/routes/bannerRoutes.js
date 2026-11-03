const express = require("express");
const router = express.Router();

const {
  createBanner,
  getBanner,
  deleteBanner,
  checkBanner,
} = require("../controllers/bannerController");

router.post("/banner", createBanner);

router.get("/banner", getBanner);

router.delete("/banner", deleteBanner);

router.get("/banner/exists", checkBanner);

module.exports = router;
