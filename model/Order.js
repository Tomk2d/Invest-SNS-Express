const mongoose = require("mongoose");

// 체결된 주식 거래.
const stockSchema = new mongoose.Schema({
  ownedShare: String, // 주식코드
  price: Number, // 구매 가격
  quantity: Number, // 수량
  buyOrSell: String, // 매수, 매도
  time : Date,  //  거래 시간
}); 

// Order 스키마 정의
const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  stocks: [stockSchema] // 위의 stockSchema 사용
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
