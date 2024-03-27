const express = require("express");
const router = express.Router();
const authHandler = require("../middleware/authHandler/authHandler.js");
const { postOrder } = require("../service/order/order.js");

router.post("/limitOrder", authHandler, async (req, res, next) => {
  try {
    const { ownedShare, buyOrSell, price, quantity } = req.body;

    const response = await postOrder(
      ownedShare,
      buyOrSell,
      price,
      quantity,
      req.user.id,
      req.client
    );
    res.json(response);
  } catch (err) {
    return next(err);
  }
});

// marketOrder

module.exports = router;
