const mongoose = require("mongoose");

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
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
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
