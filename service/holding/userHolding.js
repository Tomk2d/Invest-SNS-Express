const Holding = require("../../model/Holding");
const ApplicationError = require("../../util/error/applicationError");

// 잔고 가져오기
const getBalance = async (userId) => {
  try {
    const holding = await Holding.findOne({ user: userId });
    return holding.balance;
  } catch (err) {
    throw new ApplicationError(400, "잔고를 가져올 수 없습니다.");
  }
};

// 보유하고 있는 주식 주수 가져오기
const getHoldingQuantity = async (userId, code) => {
  try {
    const holding = await Holding.findOne({ user: userId });
    const stock = holding.stocks.find((stock) => stock.code === code);
    return stock.quantity;
  } catch (err) {
    throw new ApplicationError(400, "보유 주식 주수 가져올 수 없습니다.");
  }
};

module.exports = { getBalance, getHoldingQuantity };
