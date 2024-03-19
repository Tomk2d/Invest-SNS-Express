var express = require("express");
var router = express.Router();
const Feed = require("../model/Feed.js");
const User = require("../model/User.js");
const authHandler = require("../middleware/authHandler/authHandler.js");
const formatDate = require("../util/dateFormat/dateFormat.js");
const moment = require("moment");

// 글 피드 작성
router.post("/", authHandler, async (req, res, next) => {
  try {
    const { body, photoUrl } = req.body;
    const userId = req.user.id;

    const newFeed = new Feed({
      body,
      photoUrl,
      user: userId,
    });

    const savedFeed = await newFeed.save();

    res.status(200).json(savedFeed);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

// 투표 피드 작성
router.post("/vote", authHandler, async (req, res, next) => {
  try {
    const { body } = req.body;
    const userId = req.user.id;

    const newFeed = new Feed({
      isVote: true,
      body,
      user: userId,
    });

    const savedFeed = await newFeed.save();

    res.status(200).json(savedFeed);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

// 투표 반영
router.post("/voted", authHandler, async (req, res, next) => {
  try {
    const { feedId, voteResult } = req.body;
    const userId = req.user.id;

    const feed = await Feed.findById(feedId);
    feed.myVote.push(userId);

    if (voteResult === "yes") {
      feed.vote.yes++;
    } else if (voteResult == "no") {
      feed.vote.no++;
    }

    const savedFeed = await feed.save();

    res.status(200).json(savedFeed);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

// 매도/매수 피드 작성
router.post("/order", authHandler, async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const userId = req.user.id;

    const newFeed = new Feed({
      isOrder: true,
      order: orderId,
      user: userId,
    });

    const savedFeed = await newFeed.save();

    res.status(200).json(savedFeed);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

// 수익률 피드 작성
router.post("/profit", authHandler, async (req, res, next) => {
  try {
    const { profit } = req.body;
    const userId = req.user.id;

    const newFeed = new Feed({
      isProfit: true,
      profit,
      user: userId,
    });

    const savedFeed = await newFeed.save();

    res.status(200).json(savedFeed);
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
      createdAt: moment(feed.createdAt).format("YYYY-MM-DD HH:mm"),
      isLike: feed.like.includes(userId), // 내가 좋아요를 눌렀는지
      like: feed.like.length, // 좋아요 개수
      myVote: feed.myVote.includes(userId), // 내가 투표했는지
    }));

    res.status(200).json(formattedFeeds);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

// 해당 피드 가져오기
router.get("/:feedId", authHandler, async (req, res, next) => {
  try {
    const feedId = req.params.feedId;
    const userId = req.user.id;

    const feed = await Feed.findById(feedId).populate({
      path: "user",
      select: "nickname",
    });

    const formattedFeeds = {
      ...feed._doc,
      createdAt: moment(feed.createdAt).format("YYYY-MM-DD HH:mm"),
      isLike: feed.like.includes(userId),
      like: feed.like.length,
      myVote: feed.myVote.includes(userId), // 내가 투표했는지
    };

    res.status(200).json(formattedFeeds);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

// 사용자 피드 가져오기
router.get("/user/:userId", authHandler, async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const currentUserId = req.user.id;

    const feeds = await Feed.find({ user: userId }).populate({
      path: "user",
      select: "nickname",
    });

    const formattedFeeds = feeds.map((feed) => ({
      ...feed._doc,
      createdAt: moment(feed.createdAt).format("YYYY-MM-DD HH:mm"),
      isLike: feed.like.includes(currentUserId),
      like: feed.like.length,
      myVote: feed.myVote.includes(userId), // 내가 투표했는지
    }));

    res.status(200).json(formattedFeeds);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

//좋아요
router.post("/:feedId/like", authHandler, async (req, res, next) => {
  try {
    const feedId = req.params.feedId;
    const userId = req.user.id;

    const likedFeed = await Feed.findByIdAndUpdate(
      feedId,
      { $addToSet: { like: userId } },
      { new: true }
    );

    res.status(200).json(likedFeed);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

//좋아요 삭제
router.post("/:feedId/unlike", authHandler, async (req, res, next) => {
  try {
    const feedId = req.params.feedId;
    const userId = req.user.id;

    const feed = await Feed.findById(feedId);
    feed.like = feed.like.filter((id) => id.toString() !== userId);
    const updatedFeed = await feed.save();

    res.status(200).json(updatedFeed);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

module.exports = router;
