var express = require("express");
var router = express.Router();
const authHandler = require("../middleware/authHandler/authHandler.js");
const {
  requestFriend,
  acceptFriend,
  getFriendList,
  removeFriend,
  removeFriendRequest,
  getFriendCount,
  getPendingFriendList,
  rejectFriendRequest,
  getFriendStateList,
} = require("../service/friend/friend.js");
const search = require("../service/user/userService.js");

// 친구 요청
router.post("/request", authHandler, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { friendId } = req.body;

    await requestFriend(userId, friendId);

    res.status(200).json({ message: "Friend request sent successfully." });
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

// 친구 요청 삭제
router.delete("/request/:friendId", authHandler, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const friendId = req.params.friendId;

    await removeFriendRequest(userId, friendId);

    res.status(200).json({ message: "Friend request remove successfully." });
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

// 친구 요청 수락
router.post("/accept", authHandler, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { friendId } = req.body;

    await acceptFriend(userId, friendId);

    res.status(200).json({ message: "Friend accept successfully." });
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

// 친구 요청 거절
router.delete("/reject/:friendId", authHandler, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const friendId = req.params.friendId;

    await rejectFriendRequest(userId, friendId);

    res.status(200).json({ message: "Friend request rejected successfully." });
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

// 친구 목록
router.get("/", authHandler, async (req, res, next) => {
  try {
    const userId = req.user.id;

    const friendList = await getFriendList(userId);

    res.status(200).json(friendList);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

// 친구 대기 목록
router.get("/pending", authHandler, async (req, res, next) => {
  try {
    const userId = req.user.id;

    const friendList = await getPendingFriendList(userId);

    res.status(200).json(friendList);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

// 친구 상태 목록
router.get("/state/:friendId", authHandler, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const friendId = req.params.friendId;
    const friendList = await getFriendStateList(userId, friendId);

    res.status(200).json(friendList);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

// 친구 삭제
router.delete("/:friendId", authHandler, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const friendId = req.params.friendId;

    await removeFriend(userId, friendId);

    res.status(200).json({ message: "Friend remove successfully." });
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

// 친구 수
router.get("/friend-count/:userId", authHandler, async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const friendCount = await getFriendCount(userId);

    res.status(200).json({ friendCount });
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

router.post("/search", async (req, res, next) => {
  try {
    const { nickname } = req.body;
    const data = await search(nickname);
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
