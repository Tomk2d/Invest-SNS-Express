var express = require("express");
var router = express.Router();
const Share = require("../model/Share.js");
const authHandler = require("../middleware/authHandler/authHandler.js");
const {} = require("../service/share/share.js");

// 댓글 작성
router.post("/:feedId", authHandler, async (req, res, next) => {
  try {
    const feedId = req.params.feedId;
    const { content } = req.body;
    const userId = req.user.id;

    const newComment = await addComment(feedId, content, userId);
    res.status(200).json(newComment);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

// 해당 글 댓글 조회
router.get("/:feedId", async (req, res, next) => {
  try {
    const feedId = req.params.feedId;

    const comments = await getComment(feedId);

    res.status(200).json(comments);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

// 댓글 수정
router.put("/:commentId", async (req, res, next) => {
  try {
    const commentId = req.params.commentId;
    const { content } = req.body;

    const modifiedComment = await modifyComment(commentId, content);

    res.status(200).json(modifiedComment);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

// 댓글 삭제
router.delete("/:commentId", async (req, res, next) => {
  try {
    const commentId = req.params.commentId;

    await removeComment(commentId);

    res.status(200).json({ message: "Comment remove successfully." });
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

module.exports = router;
