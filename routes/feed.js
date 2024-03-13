var express = require("express");
var router = express.Router();
const Feed = require("../model/Feed.js");
const User = require("../model/User.js");
const authHandler = require("../middleware/authHandler/authHandler.js");
const formatDate = require("../util/dateFormat/dateFormat.js");

// 피드 작성
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

// 피드 목록 가져오기
router.get("/", authHandler, async (req, res, next) => {
  try {
    const start = parseInt(req.query.start) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const userId = req.user.id;

    const user = await User.findById(userId);
    const friendIds = user.friend
      .filter((friend) => friend.state === "friend")
      .map((friend) => friend.user);

    friendIds.push(userId);

    // 사용자와 친구들의 글을 가져옴
    const feeds = await Feed.find({ user: { $in: friendIds } })
      .sort({ createdAt: -1 })
      .skip(start)
      .limit(limit)
      .populate({
        path: "user",
        select: "nickname",
      });

    const formattedFeeds = feeds.map((feed) => ({
      ...feed._doc,
      createdAt: formatDate(feed.createdAt),
    }));

    res.status(200).json(formattedFeeds);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

// 해당 피드 가져오기
router.get("/:feedId", async (req, res, next) => {
  try {
    const feedId = req.params.feedId;

    const feed = await Feed.findById(feedId).populate({
      path: "user",
      select: "nickname",
    });

    const formattedFeeds = {
      ...feed._doc,
      createdAt: formatDate(feed.createdAt),
    };

    res.status(200).json(formattedFeeds);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

// 사용자 피드 가져오기
router.get("/user/:userId", async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const feeds = await Feed.find({ user: userId }).populate({
      path: "user",
      select: "nickname",
    });

    const formattedFeeds = feeds.map((feed) => ({
      ...feed._doc,
      createdAt: formatDate(feed.createdAt),
    }));

    res.status(200).json(formattedFeeds);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

module.exports = router;
