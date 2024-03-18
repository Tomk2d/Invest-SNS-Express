const mongoose = require("mongoose");

const feedSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isVote: Boolean,
    vote: {
      yes: { type: Number, default: 0 },
      no: { type: Number, default: 0 },
    },
    body: String,
    like: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    photoUrl: { type: String, default: null },
  },
  { timestamps: true }
);

const Feed = mongoose.model("Feed", feedSchema);

module.exports = Feed;
