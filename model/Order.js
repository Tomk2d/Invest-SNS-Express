const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    ownedShare: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StockCode",
    },
    price: Number, // 매도 가격
    quantity: Number, // 매도 수량
    orderType: String, // 지정가(limit), 시장가(market)
    buyOrSell: String, // 매수, 매도
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
