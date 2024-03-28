const mongoose = require("mongoose");

// 미체결된 주식 거래.
const unfilledOrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  orderHistoryId: String,
  ownedShare: String, // 주식코드
  price: Number, // 구매 가격
  quantity: Number, // 수량
  buyOrSell: String, // 매수, 매도
  time: Date, //  거래 시간
});

const UnfilledOrder = mongoose.model("UnfilledOrder", unfilledOrderSchema);

module.exports = UnfilledOrder;
