const { promisify } = require("util");
const { redisClient, getAsync, setAsync } = require("../../redis_instance");
const Order = require("../../model/Order");

async function processOrder(data) {
  try {
    const keys = await promisify(redisClient.keys).bind(redisClient)(
      `${data.code}:*`
    );
    await Promise.all(
      keys.map(async (key) => {
        const parts = key.split(":");
        const buyOrsell = parts[1];
        const price = parts[2];

        if (buyOrsell === "buy") {
          // 매수일 경우
          if (data.sellPrice[0] <= price) {
            const buyPrice =
              data.sellPrice[0] === price ? price : data.sellPrice[0];

            const orderData = await getAsync(key);
            const order = JSON.parse(orderData);

            const existingOrder = await Order.findOne({ user: order.user });
            if (existingOrder) {
              existingOrder.stocks.push({
                ownedShare: data.code,
                price: buyPrice,
                quantity: order.quantity,
                buyOrSell: buyOrsell,
                time: order.time,
              });
              await existingOrder.save();
            } else {
              // 주문이 없는 경우, 새로운 주문을 생성하여 저장
              const newOrder = new Order({
                user: order.user,
                stocks: [
                  {
                    ownedShare: data.code,
                    price: buyPrice,
                    quantity: order.quantity,
                    buyOrSell: buyOrsell,
                    time: order.time,
                  },
                ],
              });
              await newOrder.save();
            }
            await redisClient.del(key);
          }
        } else if (buyOrsell === "sell") {
          // 매도일 경우
          if (data.buyPrice[0] >= price) {
            const sellPrice =
              data.buyPrice[0] === price ? price : data.buyPrice[0];

            const orderData = await getAsync(key);
            const order = JSON.parse(orderData);

            const existingOrder = await Order.findOne({ user: order.user });
            if (existingOrder) {
              existingOrder.stocks.push({
                ownedShare: code,
                price: sellPrice,
                quantity: order.quantity,
                buyOrSell: buyOrsell,
                time: order.time,
              });
              await existingOrder.save();
            } else {
              // 주문이 없는 경우, 새로운 주문을 생성하여 저장
              const newOrder = new Order({
                user: order.user,
                stocks: [
                  {
                    ownedShare: code,
                    price: sellPrice,
                    quantity: order.quantity,
                    buyOrSell: buyOrsell,
                    time: order.time,
                  },
                ],
              });
              await newOrder.save();
            }
          }
          await redisClient.del(key);
        }
      })
    );
  } catch (error) {
    console.error("Error while processing stock codes:", error);
  }
}

module.exports = { processOrder };