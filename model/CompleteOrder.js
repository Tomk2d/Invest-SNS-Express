const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
    buyOrSell: String, // 매수, 매도
    ownedShare: String, // 주식코드
    price: Number, // 구매 가격
    quantity: Number, // 수량
    time: Date, //  거래 시간
  });

const CompleteOrderSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    stocks: [stockSchema], // 위의 stockSchema 사용
});

const CompleteOrder = mongoose.model("completeOrder", CompleteOrderSchema);

module.exports = CompleteOrder;