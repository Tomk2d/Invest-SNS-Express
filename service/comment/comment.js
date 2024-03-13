const formatDate = require("../../util/dateFormat/dateFormat.js");
const ApplicationError = require("../../util/error/applicationError");
const Comment = require("../../model/Comment");

const addComment = async (feedId, content, userId) => {
  try {
    const newComment = await Comment.create({
      user: userId,
      feed: feedId,
      content: content,
    });

    return newComment;
  } catch (err) {
    throw new ApplicationError(400, "댓글을 작성할 수 없습니다.");
  }
};

const getComment = async (feedId) => {
  try {
    const comments = await Comment.find({ feed: feedId })
      .populate({
        path: "user",
        select: "nickname",
      })
      .exec();

    const formattedComments = comments.map((comment) => ({
      ...comment._doc,
      createdAt: formatDate(comment.createdAt),
    }));

    return formattedComments;
  } catch (err) {
    throw new ApplicationError(400, "댓글을 불러올 수 없습니다.");
  }
};

const modifyComment = async (commentId, content) => {
  try {
    const modifiedComment = await Comment.findByIdAndUpdate(
      commentId,
      { content: content },
      { new: true }
    );

    return modifiedComment;
  } catch (err) {
    throw new ApplicationError(400, "댓글을 수정할 수 없습니다.");
  }
};

const removeComment = async (commentId) => {
  try {
    const deleteComment = await Comment.findByIdAndDelete(commentId);

    return deleteComment;
  } catch (err) {
    throw new ApplicationError(400, "댓글을 삭제할 수 없습니다.");
  }
};

module.exports = { addComment, getComment, removeComment, modifyComment };
