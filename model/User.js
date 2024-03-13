const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    nickname: {
      type: String,
      required: true,
    },
    friend: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        check: Boolean, // 친구요청 수락 여부
      },
    ],
    stock: [
      {
        name: String, // 종목 이름
        rate: Number, // 수익률
        count: Number, // 매수량
        allPrice: Number, // 총매수액
        returnPrice: Number, // 수익금
      },
    ],
    likeStock: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
