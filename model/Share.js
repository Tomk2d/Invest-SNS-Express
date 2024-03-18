const mongoose = require("mongoose");

const shareSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    ownedShare: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stock",
    },
    price: Number,
    quantity: Number,
    orderType: String,
  },
  { timestamps: true }
);

const Share = mongoose.model("Share", shareSchema);

module.exports = Share;
