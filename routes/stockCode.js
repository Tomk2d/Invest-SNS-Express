const express = require("express");
const router = express.Router();
const fs = require("fs");
var StockCode = require("../model/StockCode");
const authHandler = require("../middleware/authHandler/authHandler.js");
const {
  search,
  userSearch,
  addLikeStock,
  getLikeStock,
  getLikeStockArr,
} = require("../service/stockCode/stockCode.js");

router.get("/", (req, res, next) => {
  StockCode.find()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      return next(err);
    });
});

router.post("/", (req, res, next) => {
  const jsonFilePath =
    "/Users/shin-uijin/Invest SNS/Invest-SNS-Express/data/kosdaq.json"; // JSON 파일 경로에 맞게 수정.

  // JSON 파일 읽기
  fs.readFile(jsonFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("JSON 파일을 읽는 중 오류가 발생했습니다:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    try {
      // JSON 파싱
      const jsonData = JSON.parse(data);

      // MongoDB에 데이터 삽입
      StockCode.insertMany(jsonData)
        .then((docs) => {
          console.log("데이터베이스에 성공적으로 데이터를 삽입했습니다:", docs);
          res.json(docs);
        })
        .catch((err) => {
          console.error(
            "데이터베이스에 데이터를 삽입하는 중 오류가 발생했습니다:",
            err
          );
          res.status(500).json({ message: "Internal Server Error" });
        });
    } catch (parseError) {
      console.error("JSON 파싱 중 오류가 발생했습니다:", parseError);
      res.status(400).json({ message: "Invalid JSON format" });
    }
  });
});

// 로그인 안한 사용자 검색
router.post("/search", async (req, res, next) => {
  try {
    const { searchQuery } = req.body;

    if (searchQuery === "") {
      return res.json([]);
    }

    const searchData = await search(searchQuery);

    res.json(searchData);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

// 로그인 한 사용자 검색
router.post("/userSearch", async (req, res, next) => {
  try {
    const { searchQuery, userId } = req.body;

    if (searchQuery === "") {
      return res.json([]);
    }

    const searchData = await userSearch(searchQuery, userId);

    res.json(searchData);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

// 관심 종목 추가
router.post("/likeStock", async (req, res, next) => {
  try {
    const { likeStock, userId } = req.body;

    const likedStock = await addLikeStock(likeStock, userId);

    res.json(likedStock);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

router.get("/likeStock/:userId", async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const likeStock = await getLikeStock(userId);

    res.json(likeStock);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

router.get("/likeStockArr/:userId", async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const likeStock = await getLikeStockArr(userId);

    res.json(likeStock);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

module.exports = router;
