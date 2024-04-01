const ApplicationError = require("../../util/error/applicationError");
const CompleteOrder = require("../../model/CompleteOrder");
const ReservedOrder = require("../../model/ReservedOrder");
const moment = require("moment");

async function buyOrSellOrder(user, ownedShare, price, quantity, buyOrSell) {
  try {
    console.log("***");
    const currentTime = new Date();

    const reserveOrder = new ReservedOrder({
      // 미체결 등록.
      user: user,
      buyOrSell: buyOrSell,
      ownedShare: ownedShare, // 주식 코드
      price: price,
      quantity: quantity,
      time: currentTime,
    });

    const savedOrder = await reserveOrder.save();

    return { order: savedOrder };
  } catch (err) {
    throw new ApplicationError(400, "주문을 저장할 수 없습니다");
  }
}

const getMyHistory = async (user, code) => {
  try {
    const reservedOrders = await ReservedOrder.find({
      user,
      ownedShare: code,
    });

    let formattedReservedOrders = [];
    if (reservedOrders) {
      formattedReservedOrders = reservedOrders.map((order) => ({
        ...order._doc,
        time: moment(order.time).format("YYYY-MM-DD HH:mm:ss"),
      }));
      formattedReservedOrders.sort(
        (a, b) => new Date(a.time) - new Date(b.time)
      );
    }

    let formattedCompleteOrders = [];
    const completeUserOrders = await CompleteOrder.findOne({
      user,
    });

    if (completeUserOrders) {
      const completeOrders = completeUserOrders.stocks.filter(
        (order) => order.ownedShare === code
      );

      formattedCompleteOrders = completeOrders.map((order) => ({
        ...order._doc,
        time: moment(order.time).format("YYYY-MM-DD HH:mm:ss"),
      }));
      formattedCompleteOrders.sort(
        (a, b) => new Date(b.time) - new Date(a.time)
      );
    }

    return {
      reservedHistory: formattedReservedOrders,
      completedHistory: formattedCompleteOrders,
    };
  } catch (err) {
    throw new ApplicationError(400, "주문을 검색할 수 없습니다");
  }
};

module.exports = { buyOrSellOrder, getMyHistory };
