const { promisify } = require("util");
const ReservedOrder = require("../../model/ReservedOrder");
const CompleteOrder = require("../../model/CompleteOrder");
const { updateBuyHolding, updateSellHolding } = require("../holding/holding");

async function processOrder(data) {
  try {
    // data : {code: "", sellPrice: [], buyPrice: []}
    // 소켓 데이터에서 코드 불러오기.
    const code = data.code;
    // 미체결 주문 코드로 불러오기.
    const reservedOrders = await ReservedOrder.find({ ownedShare: code });

    // 미체결 주문이 있을때 실행.
    if (reservedOrders != null || reservedOrders != undefined) {
      for (const order of reservedOrders) {
        // 미체결 주문 돌면서 검사.
        const { buyOrSell, price } = order;

        if (buyOrSell === "buy") {
          if (data.sellPrice[0] <= price) {
            // 호가로 거래되는 가격이 내가 사려고 하는거보다 낮을때. 즉 내가 비싸게 거래햐려고 할때.
            // 가격이 같으면 내가 설정한 가격으로 거래. 더 싸면 싼가격으로 사짐.
            const buyPrice =
              data.sellPrice[0] === price ? price : data.sellPrice[0];
            // 체결 완료에 유저아이디 찾기.
            let orderUser = await CompleteOrder.findOne({ user: order.user });

            // 유저 아이디로 체결 스키마에 추가.
            if (orderUser) {
              orderUser.stocks.push({
                buyOrSell: buyOrSell,
                ownedShare: code,
                price: buyPrice,
                quantity: order.quantity,
                time: order.time,
              });
              await orderUser.save();
            } else {
              // 한번도 거래 안해본 애들.
              const newOrder = new CompleteOrder({
                user: order.user,
                stocks: [
                  {
                    buyOrSell: buyOrSell,
                    ownedShare: code,
                    price: buyPrice,
                    quantity: order.quantity,
                    time: order.time,
                  },
                ],
              });
              await newOrder.save();
            }

            const deleted = await ReservedOrder.findByIdAndDelete(order._id);
            await updateBuyHolding(deleted.user, deleted.ownedShare, deleted.buyPrice, deleted.quantity);
          }
        } else if (buyOrSell === "sell") {
          //  팔때.
          if (data.buyPrice[0] >= price) {
            // 가격 맞을때.

            // 내가 팔려고 하는 가격보다 호가가 비싸면 호가로 설정. 같으면 내 가격 설정.
            const sellPrice =
              data.buyPrice[0] === price ? price : data.buyPrice[0];
            // 체결을 해본적 있는 유저 있는지.
            const orderUser = await CompleteOrder.findOne({ user: order.user });

            if (orderUser) {
              // 거래해봄.
              orderUser.stocks.push({
                buyOrSell: buyOrSell,
                ownedShare: code,
                price: sellPrice,
                quantity: order.quantity,
                time: order.time,
              });
              await orderUser.save();
              await ReservedOrder.findByIdAndDelete(order._id);
              await updateSellHolding(
                order.user,
                code,
                sellPrice,
                order.quantity
              );
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("Error while processing stock codes:", error);
  }
}

module.exports = { processOrder };
