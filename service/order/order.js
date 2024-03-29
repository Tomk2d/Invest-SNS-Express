const ApplicationError = require("../../util/error/applicationError");
const UnfilledOrder = require("../../model/UnfilledOrder");
const OrderHistory = require("../../model/OrderHistory");
const ReservedOrder = require('../../model/ReservedOrder');

async function buyOrSellOrder(user, ownedShare, price, quantity, buyOrSell){
  try {
    const currentTime = new Date();

    const reserveOrder = new ReservedOrder({   // 미체결 등록.
      user: user,
      buyOrSell: buyOrSell,
      ownedShare: ownedShare,  // 주식 코드
      price: price,
      quantity: quantity,
      time: currentTime,
    });

    const savedOrder = await reserveOrder.save();

    return { order: savedOrder };
  } catch (err) {
    throw new ApplicationError(400, "주문을 저장할 수 없습니다");
  }
};

const getMyHistory = async (user, code) => {
  try {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    const formatTime = (time) => {
      const formattedTime = new Date(time).toLocaleTimeString("ko-KR", {
        hour12: false,
        timeZone: "Asia/Seoul", // 한국 시간대로 설정
      });
      return formattedTime;
    };

    const unfilledOrders = await UnfilledOrder.find({
      user,
      ownedShare: code,
      time: { $gte: formattedDate },
    });
    const formattedUnfilledOrders = unfilledOrders.map((order) => ({
      ...order._doc,
      time: formatTime(order.time),
    }));

    const orderHistory = await OrderHistory.find({
      user,
      ownedShare: code,
      time: { $gte: formattedDate },
    });
    const formattedOrderHistory = orderHistory.map((order) => ({
      ...order._doc,
      time: formatTime(order.time),
    }));

    return {
      unfilledOrders: formattedUnfilledOrders,
      orderHistory: formattedOrderHistory,
    };
  } catch (err) {
    throw new ApplicationError(400, "주문을 저장할 수 없습니다");
  }
};

module.exports = { buyOrSellOrder, getMyHistory };
