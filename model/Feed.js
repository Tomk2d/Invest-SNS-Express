const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  code: String, // 주식코드
  name: String, // 주식이름
  buyOrSell: String, // 매수, 매도
  quantity: Number, // 수량
});

const feedSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isVote: { type: Boolean, default: false },
    vote: {
      yes: { type: Number, default: 0 },
      no: { type: Number, default: 0 },
    },
    myVote: [mongoose.Schema.Types.ObjectId],
    isOrder: { type: Boolean, default: false },
    order: orderSchema,
    isProfit: { type: Boolean, default: false },
    profit: Number,
    body: String,
    like: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    photoUrl: { type: String, default: null },
  },
  { timestamps: true }
);

feedSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "feed",
});

const Feed = mongoose.model("Feed", feedSchema);

module.exports = Feed;
