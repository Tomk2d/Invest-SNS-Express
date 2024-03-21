const ApplicationError = require("../../util/error/applicationError");
const StockCode = require("../../model/StockCode");
const User = require("../../model/User");

const search = async (searchQuery) => {
  try {
    const searchData = await StockCode.find({
      $or: [
        { code: { $regex: searchQuery, $options: "i" } },
        { name: { $regex: searchQuery, $options: "i" } },
      ],
    }).lean();

    return searchData;
  } catch (err) {
    throw new ApplicationError(400, "검색을 할 수 없습니다.");
  }
};

const userSearch = async (searchQuery, userId) => {
  try {
    const searchData = await StockCode.find({
      $or: [
        { code: { $regex: searchQuery, $options: "i" } },
        { name: { $regex: searchQuery, $options: "i" } },
      ],
    }).lean();

    const user = await User.findById(userId);
    const likeStock = user.likeStock;

    const searchDataWithIsLike = searchData.map((data) => {
      const isLike = likeStock.some((stock) => stock === data.code);
      return {
        ...data,
        isLike: isLike,
      };
    });

    return searchDataWithIsLike;
  } catch (err) {
    throw new ApplicationError(400, "검색을 할 수 없습니다.");
  }
};

const addLikeStock = async (likeStock, userId) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        likeStock: likeStock,
      },
      { new: true }
    );

    return updatedUser;
  } catch (err) {
    throw new ApplicationError(400, "관심 종목을 추가할 수 없습니다.");
  }
};

const getLikeStock = async (userId) => {
  try {
    const user = User.findById(userId);
    return user.likeStock;
  } catch (err) {
    throw new ApplicationError(400, "관심 종목을 가져올 수 없습니다.");
  }
};

module.exports = { search, userSearch, addLikeStock, getLikeStock };
