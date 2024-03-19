const mongoose = require("mongoose");

const shareSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    ownedShare: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StockCode",
    },
    currentPrice: Number, //현재가
    averagePurchasePrice: Number, //평단가
    holdingQuantity: Number, //보유수량
    evaluationProfit: Number, //평가수익금
    evaluationProfitRate: Number, //평가수익률
  },
  { timestamps: true }
);

const Share = mongoose.model("Share", shareSchema);

module.exports = Share;
