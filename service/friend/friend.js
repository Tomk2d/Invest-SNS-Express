const User = require("../../model/User");
const ApplicationError = require("../../util/error/applicationError");

// 친구 요청
const requestFriend = async (userId, friendId) => {
  try {
    const user = await User.findById(userId);
    const isFriendRequestExists = user.friend.some(
      (friend) => friend.user.toString() === friendId
    );

    if (!isFriendRequestExists) {
      await User.findByIdAndUpdate(
        userId,
        { $push: { friend: { user: friendId, state: "requested" } } },
        { new: true }
      );

      await User.findByIdAndUpdate(
        friendId,
        { $push: { friend: { user: userId, state: "pending" } } },
        { new: true }
      );
    }
  } catch (err) {
    throw new ApplicationError(400, "친구 요청을 보낼 수 없습니다.");
  }
};

// 친구 요청 삭제
const removeFriendRequest = async (userId, friendId) => {
  try {
    const user = await User.findById(userId);
    const friendToRemove = user.friend.find(
      (friend) => friend.user.toString() === friendId
    );

    if (friendToRemove && friendToRemove.state === "requested") {
      await User.findByIdAndUpdate(
        userId,
        { $pull: { friend: { user: friendId } } },
        { new: true }
      );

      await User.findByIdAndUpdate(
        friendId,
        { $pull: { friend: { user: userId } } },
        { new: true }
      );
    }
  } catch (err) {
    throw new ApplicationError(400, "친구 요청을 삭제할 수 없습니다.");
  }
};

// 친구 요청 수락
const acceptFriend = async (userId, friendId) => {
  try {
    await User.findOneAndUpdate(
      { _id: userId, "friend.user": friendId },
      { $set: { "friend.$.state": "friend" } },
      { new: true }
    );

    await User.findOneAndUpdate(
      { _id: friendId, "friend.user": userId },
      { $set: { "friend.$.state": "friend" } },
      { new: true }
    );
  } catch (err) {
    throw new ApplicationError(400, "친구를 수락할 수 없습니다.");
  }
};

// 친구 목록
const getFriendList = async (userId) => {
  try {
    const user = await User.findOne({ _id: userId, "friend.state": "friend" })
      .populate({
        path: "friend.user",
        select: "nickname",
      })
      .exec();

    const friendList = user.friend.map((friend) => friend.user);

    return friendList;
  } catch (err) {
    throw new ApplicationError(400, "친구 목록을 가져올 수 없습니다.");
  }
};

// 친구 삭제
const removeFriend = async (userId, friendId) => {
  try {
    await User.findByIdAndUpdate(
      userId,
      { $pull: { friend: { user: friendId } } },
      { new: true }
    );

    await User.findByIdAndUpdate(
      friendId,
      { $pull: { friend: { user: userId } } },
      { new: true }
    );
  } catch (err) {
    console.error(err);
    throw new ApplicationError(500, "친구를 삭제하지 못했습니다.");
  }
};

module.exports = {
  requestFriend,
  acceptFriend,
  getFriendList,
  removeFriend,
  removeFriendRequest,
};
