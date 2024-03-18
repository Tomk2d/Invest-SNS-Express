var express = require("express");
var router = express.Router();
const {
  getStrategy,
  getPopularStock,
  getHotStock,
} = require("../service/shinhanInfo/shinhanInfo");

// 투자 전략 가져오기
router.get("/strategy", async (req, res, next) => {
  try {
    const strategy = await getStrategy();
    res.status(200).json(strategy);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

// 인기 주식 가져오기
router.get("/popularStock", async (req, res, next) => {
  try {
    const popularStocks = await getPopularStock();
    res.status(200).json(popularStocks);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

//핫이슈 종목 가져오기 (거래량: 1, 주가상승률: 2, 외국인순매수: 3, 기관순매수: 4)
router.get("/hotStock/:type", async (req, res, next) => {
  try {
    const { type } = req.params;
    const hotStocks = await getHotStock(type);
    res.status(200).json(hotStocks);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

module.exports = router;
