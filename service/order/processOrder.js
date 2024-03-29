const { promisify } = require("util");
const Holding = require("../../model/Holding");
const UnfilledOrder = require("../../model/UnfilledOrder");

async function processOrder(data) {
  // try {
  //   // data : {code: "", sellPrice: [], buyPrice: []}
  //   const unfilledOrders = await UnfilledOrder.find({ ownedShare: data.code });
  //   for (const order of unfilledOrders) {
  //     const { buyOrSell, price } = order;
  //     if (buyOrSell === "buy") {
  //       if (data.sellPrice[0] <= price) {
  //         const buyPrice =
  //           data.sellPrice[0] === price ? price : data.sellPrice[0];
  //         const existingOrder = await Order.findOne({ user: order.user });
  //         if (existingOrder) {
  //           existingOrder.stocks.push({
  //             ownedShare: data.code,
  //             price: buyPrice,
  //             quantity: order.quantity,
  //             buyOrSell: buyOrSell,
  //             time: order.time,
  //           });
  //           await existingOrder.save();
  //         } else {
  //           const newOrder = new Order({
  //             user: order.user,
  //             stocks: [
  //               {
  //                 ownedShare: data.code,
  //                 price: buyPrice,
  //                 quantity: order.quantity,
  //                 buyOrSell: buyOrSell,
  //                 time: order.time,
  //               },
  //             ],
  //           });
  //           await newOrder.save();
  //         }
  //         console.log(order._id);
  //         await UnfilledOrder.findByIdAndDelete(order._id);
  //       }
  //     } else if (buyOrSell === "sell") {
  //       if (data.buyPrice[0] >= price) {
  //         const sellPrice =
  //           data.buyPrice[0] === price ? price : data.buyPrice[0];
  //         //매도 가격
  //         const existingOrder = await Order.findOne({
  //           user: order.user,
  //           "stocks.ownedShare": data.code,
  //         });
  //         if (existingOrder) {
  //           let remainQuantity = order.quantity;
  //           for (let i = 0; i < existingOrder.stocks.length; i++) {
  //             if (remainQuantity > 0) {
  //               if (existingOrder.stocks[i].quantity >= remainQuantity) {
  //                 existingOrder.stocks[i].quantity -= remainQuantity;
  //                 remainQuantity = 0;
  //                 if (existingOrder.stocks[i].quantity === 0) {
  //                   existingOrder.stocks.splice(i, 1);
  //                 }
  //               } else {
  //                 remainQuantity -= existingOrder.stocks[i].quantity;
  //                 existingOrder.stocks.splice(i, 1);
  //               }
  //             } else {
  //               break;
  //             }
  //           }
  //           await existingOrder.save();
  //         }
  //         await UnfilledOrder.findByIdAndDelete(order._id);
  //       }
  //     }
  //   }
  // } catch (error) {
  //   console.error("Error while processing stock codes:", error);
  // }
}

module.exports = { processOrder };
