require("dotenv").config();

const express = require("express");
const cors = require("cors");

const bannerRoutes = require("./routes/bannerRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", bannerRoutes);

app.get("/", (req, res) => {
  res.send("Redis Banner API is Running");
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
