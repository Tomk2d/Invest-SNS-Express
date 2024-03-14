var express = require("express");
var router = express.Router();
const { getPopularStock } = require("../service/shinhanInfo/popularStock");

// 인기 주식 가져오기
router.get("/", async (req, res, next) => {
  try {
    const popularStocks = await getPopularStock();
    res.status(200).json(popularStocks);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

module.exports = router;
