var express = require("express");
const axios = require("axios");
const router = express.Router();
const processStockPrice = require("../service/stock/processStockPrice.js");
const {
  getMinuteData,
  getDayData,
} = require("../service/batchData/batch_DB.js");
const kospiKosdaq = require("../service/kospi_kosdaq/kospi_kosdaq.js");

router.post("/", async (req, res, next) => {
  try {
    const response = await processStockPrice(
      req.body.time_format,
      req.body.code,
      req.body.start_date,
      req.body.end_date
    );
    res.json(response);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "서버 에러" });
  }
});

router.get("/kospiKosdaq", async (req, res, next) => {
  try {
    const response = await kospiKosdaq();
    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "서버에러" });
  }
});

router.post("/minute", async (req, res, next) => {
  try {
    const response = await getMinuteData(req.body.code);
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 에러 입니당~" });
  }
});

module.exports = router;
