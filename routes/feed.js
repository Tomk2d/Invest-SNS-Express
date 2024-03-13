var express = require("express");
var router = express.Router();
const Feed = require("../model/Feed.js");
const authHandler = require("../middleware/authHandler/authHandler.js");

router.post("/", authHandler, async (req, res, next) => {
  try {
    const { isVote, vote, body, photoUrl } = req.body;
    const userId = req.user.id;

    const newFeed = new Feed({
      isVote,
      vote,
      body,
      photoUrl,
      user: userId,
    });

    const savedFeed = await newFeed.save();

    const populatedFeed = await Feed.findById(savedFeed._id).populate(
      "user",
      "nickname"
    );

    res.status(200).json(populatedFeed);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const start = parseInt(req.query.start) || 0;
    const limit = parseInt(req.query.limit) || 10;

    const Feeds = await Feed.find()
      .sort({ createAt: -1 })
      .skip(start)
      .limit(limit)
      .populate({
        path: "user",
        select: "nickname",
      });

    res.status(200).json(Feeds);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

module.exports = router;
