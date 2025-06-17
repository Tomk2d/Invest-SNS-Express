const Redis = require('ioredis');
const redis = new Redis();
const CompleteOrder = require('../../model/CompleteOrder');
const { updateBuyHolding, updateSellHolding } = require('../holding/holding');

/**
 * Redis 기반 미체결 주문 체결 처리
 * @param {Object} data - {code, sellPrice, buyPrice}
 * @param {'buy'|'sell'} orderType - 체결 방향
 */
async function processOrderWithRedis(data, orderType) {
  try {
    const code = data.code;
    const zsetKey = `order:${code}:${orderType}`;
    const isBuy = orderType === 'buy';
    // 가격순 정렬: 매수는 높은 가격부터, 매도는 낮은 가격부터
    const rangeMethod = isBuy ? 'zrevrange' : 'zrange';
    // 가격 기준: 매수는 매도호가(sellPrice[0]), 매도는 매수호가(buyPrice[0])
    const price = isBuy ? data.sellPrice[0] : data.buyPrice[0];
    // ZSET에서 체결 가능한 주문 탐색
    const orders = await redis[rangeMethod](zsetKey, 0, -1, 'WITHSCORES');
    for (let i = 0; i < orders.length; i += 2) {
      const orderId = orders[i];
      const orderPrice = parseInt(orders[i + 1], 10);
      // 체결 조건 확인
      if ((isBuy && orderPrice >= price) || (!isBuy && orderPrice <= price)) {
        // 주문 상세 정보 조회
        const orderDetail = await redis.hgetall(`order:${orderId}`);
        if (!orderDetail || !orderDetail.userId) continue;
        // CompleteOrder에 추가 (MongoDB)
        let orderUser = await CompleteOrder.findOne({ user: orderDetail.userId });
        const stockObj = {
          buyOrSell: orderType,
          ownedShare: code,
          price: orderPrice,
          quantity: parseInt(orderDetail.quantity, 10),
          time: orderDetail.time || new Date(),
        };
        if (orderUser) {
          orderUser.stocks.push(stockObj);
          await orderUser.save();
        } else {
          const newOrder = new CompleteOrder({
            user: orderDetail.userId,
            stocks: [stockObj],
          });
          await newOrder.save();
        }
        // Redis에서 주문 삭제
        await redis.zrem(zsetKey, orderId);
        await redis.del(`order:${orderId}`);
        // 보유 주식 업데이트
        if (isBuy) {
          await updateBuyHolding(orderDetail.userId, code, orderPrice, parseInt(orderDetail.quantity, 10));
        } else {
          await updateSellHolding(orderDetail.userId, code, orderPrice, parseInt(orderDetail.quantity, 10));
        }
        // 여러 주문이 체결될 수 있으니 계속 진행
      }
    }
  } catch (error) {
    console.error('Error while processing Redis orders:', error);
  }
}

module.exports = { processOrderWithRedis }; 