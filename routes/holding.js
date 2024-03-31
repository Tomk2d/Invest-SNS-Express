var express = require("express");
var router = express.Router();
const {
  getBalance,
  getHoldingQuantity,
} = require("../service/holding/userHolding.js");

router.get("/balance/:userId", async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const balance = await getBalance(userId);

    res.status(200).json(balance);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

router.get("/quantity/:userId/:code", async (req, res, next) => {
  try {
    const { userId, code } = req.params;

    const holdingQuantity = await getHoldingQuantity(userId, code);

    res.status(200).json(holdingQuantity);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

module.exports = router;
