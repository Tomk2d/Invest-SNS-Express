const express = require("express");
const router = express.Router();
const KospiCode = require("../model/KospiCode.js");
const KosdaqCode = require("../model/KosdaqCode.js");
const User = require("../model/User.js");
const authHandler = require("../middleware/authHandler/authHandler.js");

router.post("/search", async (req, res, next) => {
  try {
    const { searchQuery } = req.body;
    const kospiSearchData = await KospiCode.find({
      $or: [
        { code: { $regex: searchQuery, $options: "i" } },
        { name: { $regex: searchQuery, $options: "i" } },
      ],
    }).lean();

    const kosdaqSearchData = await KosdaqCode.find({
      $or: [
        { code: { $regex: searchQuery, $options: "i" } },
        { name: { $regex: searchQuery, $options: "i" } },
      ],
    }).lean();

    const kospiDataWithType = kospiSearchData.map((data) => ({
      ...data,
      type: "kospi",
    }));
    const kosdaqDataWithType = kosdaqSearchData.map((data) => ({
      ...data,
      type: "kosdaq",
    }));

    const searchData = [...kospiDataWithType, ...kosdaqDataWithType];
    res.json(searchData);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

router.post("/userSearch", authHandler, async (req, res, next) => {
  try {
    const { searchQuery } = req.body;
    const userId = req.user.id;

    const kospiSearchData = await KospiCode.find({
      $or: [
        { code: { $regex: searchQuery, $options: "i" } },
        { name: { $regex: searchQuery, $options: "i" } },
      ],
    }).lean();

    const kosdaqSearchData = await KosdaqCode.find({
      $or: [
        { code: { $regex: searchQuery, $options: "i" } },
        { name: { $regex: searchQuery, $options: "i" } },
      ],
    }).lean();

    const user = await User.findById(userId);
    const likeStock = user.likeStock;

    const kospiWithOtherData = kospiSearchData.map((data) => {
      const isLike = likeStock.some((stock) => stock === data.code);
      return {
        ...data,
        type: "kospi",
        isLike: isLike,
      };
    });
    const kosdaqWithOtherData = kosdaqSearchData.map((data) => {
      const isLike = likeStock.some((stock) => stock == data.code);
      return {
        ...data,
        type: "kosdap",
        isLike: isLike,
      };
    });

    const searchData = [...kospiWithOtherData, ...kosdaqWithOtherData];
    res.json(searchData);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

router.post("/likeStock", authHandler, async (req, res, next) => {
  try {
    const { likeStock } = req.body;
    const userId = req.user.id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        likeStock: likeStock,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      likeStock: updatedUser.likeStock,
    });
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

module.exports = router;
