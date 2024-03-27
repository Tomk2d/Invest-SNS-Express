const ApplicationError = require("../../util/error/applicationError");
const User = require("../../model/User");

const search = async (searchQuery) => {
  try {
    const searchData = await User.find({
      $or: [
        { nickname: { $regex: searchQuery, $options: "i" } },
      ],
    }).lean();

    return searchData;
  } catch (err) {
    throw new ApplicationError(400, "검색을 할 수 없습니다.");
  }
};

module.exports = search;