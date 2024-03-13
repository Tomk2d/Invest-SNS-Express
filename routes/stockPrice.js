var express = require("express");
const axios = require("axios");
const router = express.Router();
const processStockPrice = require('../service/stock/processStockPrice.js');

router.post("/", async (req, res, next) => {
  try {
    const response = await processStockPrice(req.body.time_format,req.body.code,req.body.start_date,req.body.end_date);

    res.json(response);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "서버 에러" });
  }
});

module.exports = router;
