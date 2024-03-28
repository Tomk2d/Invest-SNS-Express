const ApplicationError = require("../../util/error/applicationError");
const UnfilledOrder = require("../../model/UnfilledOrder");
const OrderHistory = require("../../model/OrderHistory");

const postOrder = async (ownedShare, price, quantity, buyOrSell, user) => {
  try {
    const currentTime = new Date();

    const order1 = new OrderHistory({
      user: user,
      ownedShare: ownedShare,
      price: price,
      quantity: quantity,
      buyOrSell: buyOrSell,
      time: currentTime,
    });

    const savedOrder1 = await order1.save();

    const order2 = new UnfilledOrder({
      user: user,
      orderHistoryId: savedOrder1._id,
      ownedShare: ownedShare,
      price: price,
      quantity: quantity,
      buyOrSell: buyOrSell,
      time: currentTime,
    });
    const savedOrder2 = await order2.save();

    return { order: savedOrder1 };
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

module.exports = { postOrder, getMyHistory };
