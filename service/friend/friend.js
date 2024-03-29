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

// 친구 요청 거절
const rejectFriendRequest = async (userId, friendId) => {
  try {
    const user = await User.findById(userId);
    const friendToReject = user.friend.find(
      (friend) => friend.user.toString() === friendId
    );

    if (friendToReject && friendToReject.state === "pending") {
      // 요청된 친구 요청을 삭제
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
    throw new ApplicationError(400, "친구 요청을 거절할 수 없습니다.");
  }
};

// 친구 목록
const getFriendList = async (userId) => {
  try {
    const user = await User.findById(userId);
    const friendList = user.friend.filter(
      (friend) => friend.state === "friend"
    );

    const friendIds = friendList.map((friend) => friend.user);
    const friendsWithNicknames = await User.find({ _id: { $in: friendIds } })
      .select("nickname") // 닉네임 필드만 선택
      .lean(); // 결과를 plain JavaScript 객체로 변환

    return friendsWithNicknames;
  } catch (err) {
    throw new ApplicationError(400, "친구 목록을 가져올 수 없습니다.");
  }
};

// 친구 대기 목록
const getPendingFriendList = async (userId) => {
  try {
    const user = await User.findById(userId);
    const friendList = user.friend.filter(
      (friend) => friend.state === "pending"
    );

    const friendIds = friendList.map((friend) => friend.user);
    const friendsWithNicknames = await User.find({ _id: { $in: friendIds } })
      .select("nickname") // 닉네임 필드만 선택
      .lean(); // 결과를 plain JavaScript 객체로 변환

    return friendsWithNicknames;
  } catch (err) {
    throw new ApplicationError(400, "친구 목록을 가져올 수 없습니다.");
  }
};

// 친구 상태 목록
const getFriendStateList = async (userId, friendId) => {
  try {
    const user = await User.findById(userId);

    const friend = user.friend.find(
      (friend) => friend.user.toString() === friendId
    );
    if (!friend) {
      return null; // friendId와 일치하는 친구가 없을 경우 null 반환
    }

    const friendUser = await User.findById(friend.user);
    return {
      friendId: friend.user,
      nickname: friendUser.nickname,
      state: friend.state,
    };
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

async function getFriendCount(userId) {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("사용자를 찾을 수 없습니다.");
    }

    const friendCount = user.friend.filter(
      (friend) => friend.state === "friend"
    ).length;
    return friendCount;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  requestFriend,
  acceptFriend,
  getFriendList,
  removeFriend,
  removeFriendRequest,
  getFriendCount,
  getPendingFriendList,
  rejectFriendRequest,
  getFriendStateList,
};
