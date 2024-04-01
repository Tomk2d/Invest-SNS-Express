var express = require("express");
var router = express.Router();
const Feed = require("../model/Feed.js");
const User = require("../model/User.js");
const authHandler = require("../middleware/authHandler/authHandler.js");
const moment = require("moment");
const imageUploader = require("../util/imageUploader");

// 글 피드 작성
router.post(
  "/",
  authHandler,
  imageUploader.single("file"),
  async (req, res, next) => {
    try {
      console.log(JSON.stringify(req.body));
      const body = req.body.body;
      const userId = req.user.id;
      const photoUrl = req.file ? req.file.location : null;
      console.log(req.file);
      console.log(req.body.body);
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
  }
);

// 글 삭제
router.delete("/:feedId", authHandler, async (req, res, next) => {
  try {
    const feedId = req.params.feedId;
    const userId = req.user.id;

    // 글 작성자와 현재 사용자가 동일한지 확인
    const feed = await Feed.findById(feedId);
    if (!feed) {
      return res.status(404).json({ message: "글을 찾을 수 없습니다." });
    }
    console.log(feed.user.toString());
    console.log(userId);
    if (feed.user.toString() !== userId) {
      return res.status(403).json({ message: "글을 삭제할 권한이 없습니다." });
    }

    // 글 삭제
    await Feed.findByIdAndDelete(feedId);

    res.status(200).json({ message: "글이 성공적으로 삭제되었습니다." });
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
    console.log(req.body);
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
router.post("/order/:userId", authHandler, async (req, res, next) => {
  try {
    const { code, name, buyOrSell, quantity } = req.body;
    const { userId } = req.params;

    const newOrder = {
      code,
      name,
      buyOrSell,
      quantity,
    };

    const newFeed = new Feed({
      isOrder: true,
      order: newOrder,
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
    const page = parseInt(req.query.page) || 1; // 요청된 페이지 번호
    const limit = parseInt(req.query.limit) || 10; // 페이지 당 피드 수
    const userId = req.user.id;

    const user = await User.findById(userId);
    const friendIds = user.friend
      .filter((friend) => friend.state === "friend")
      .map((friend) => friend.user);

    friendIds.push(userId);

    // 요청된 페이지의 시작 인덱스 계산
    const startIndex = (page - 1) * limit;

    // 사용자와 친구들의 글을 가져옴
    const feeds = await Feed.find({ user: { $in: friendIds } })
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit)
      .populate({
        path: "user",
        select: "nickname",
      })
      .populate({
        path: "comments",
        select: "_id", // 댓글의 개수만 필요하므로 _id만 선택합니다.
      });

    const formattedFeeds = feeds.map((feed) => {
      const formattedFeed = {
        ...feed._doc,
        createdAt: moment(feed.createdAt).format("YYYY-MM-DD HH:mm"),
        isLike: feed.like.includes(userId), // 내가 좋아요를 눌렀는지
        like: feed.like.length, // 좋아요 개수
        myVote: feed.myVote.includes(userId), // 내가 투표했는지
      };

      formattedFeed.commentsCount = feed.comments.length;
      return formattedFeed;
    });
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

// 나의 피드 가져오기
router.get("/user/:userId", authHandler, async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const currentUserId = req.user.id;

    if (userId === "-1") {
      return res.status(200).json("");
    }
    const page = parseInt(req.query.page) || 1; // 요청된 페이지 번호
    const limit = parseInt(req.query.limit) || 10; // 페이지 당 피드 수

    // 요청된 페이지의 시작 인덱스 계산
    const startIndex = (page - 1) * limit;

    const feeds = await Feed.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit)
      .populate({
        path: "user",
        select: "nickname",
      })
      .populate({
        path: "comments",
        select: "_id", // 댓글의 개수만 필요하므로 _id만 선택합니다.
      });

    const formattedFeeds = feeds.map((feed) => {
      const formattedFeed = {
        ...feed._doc,
        createdAt: moment(feed.createdAt).format("YYYY-MM-DD HH:mm"),
        isLike: feed.like.includes(currentUserId), // 내가 좋아요를 눌렀는지
        like: feed.like.length, // 좋아요 개수
        myVote: feed.myVote.includes(userId), // 내가 투표했는지
      };

      formattedFeed.commentsCount = feed.comments.length;
      return formattedFeed;
    });
    res.status(200).json(formattedFeeds);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

// 사용자 피드 가져오기
router.get("/anotherUser/:userId", authHandler, async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const currentUserId = req.user.id;

    if (userId === "-1") {
      return res.status(200).json("");
    }
    const page = parseInt(req.query.page) || 1; // 요청된 페이지 번호
    const limit = parseInt(req.query.limit) || 10; // 페이지 당 피드 수

    // 요청된 페이지의 시작 인덱스 계산
    const startIndex = (page - 1) * limit;

    const feeds = await Feed.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit)
      .populate({
        path: "user",
        select: "nickname",
      })
      .populate({
        path: "comments",
        select: "_id", // 댓글의 개수만 필요하므로 _id만 선택합니다.
      });

    const formattedFeeds = feeds.map((feed) => {
      const formattedFeed = {
        ...feed._doc,
        createdAt: moment(feed.createdAt).format("YYYY-MM-DD HH:mm"),
        isLike: feed.like.includes(currentUserId), // 내가 좋아요를 눌렀는지
        like: feed.like.length, // 좋아요 개수
        myVote: feed.myVote.includes(userId), // 내가 투표했는지
      };

      formattedFeed.commentsCount = feed.comments.length;
      return formattedFeed;
    });
    res.status(200).json(formattedFeeds);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

// 내 게시글 수
router.get("/user/:userId/post-count", authHandler, async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const postCount = await Feed.countDocuments({ user: userId });

    res.status(200).json({ postCount });
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
