const mongoose = require("mongoose");

// 체결된 주식 거래.
const stockSchema = new mongoose.Schema({
  code: String, // 주식코드
  price: Number, // 평단가
  quantity: Number, // 수량
});

// Order 스키마 정의
const holdingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  stocks: [stockSchema],
  balance: { type: Number, default: 0 },
});

const Holding = mongoose.model("Holding", holdingSchema);

module.exports = Holding;
