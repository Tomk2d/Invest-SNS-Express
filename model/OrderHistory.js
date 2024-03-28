const mongoose = require("mongoose");

// 누적 주문 내역
const orderHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  ownedShare: String, // 주식코드
  price: Number, // 구매 가격
  quantity: Number, // 수량
  buyOrSell: String, // 매수, 매도
  time: Date, //  거래 시간
});

const OrderHistory = mongoose.model("orderHistory", orderHistorySchema);

module.exports = OrderHistory;
