var express = require("express");
var router = express.Router();
const Order = require("../model/Order.js");
const authHandler = require("../middleware/authHandler/authHandler.js");
const {buyOrSellOrder} = require('../service/order/order.js');

router.get('/myOrder', authHandler, async(req, res, next)=>{
    try{
        const userId = req.user.id;
        const myStock = await Order.findOne({user:userId});
        const response = await MyOrder(myStock);
        res.json(response);
    }catch(err){
        console.error(err);
        return next(err);
    }
})


router.post('/', authHandler, async (req, res, next) => {
    try {
        const userId = req.user.id; // 인증된 사용자의 ID를 가져옵니다. (인증 구현 방식에 따라 변경될 수 있습니다.)
        const { ownedShare, price, quantity, Date } = req.body; // 요청 본문에서 주식 정보를 추출합니다.


    // 기존 Order 찾기
    let order = await Order.findOne({ user: userId });

        if (order) {
            // 기존에 거래한적 있는 유저이면, stocks 배열에 주식 정보 추가
            order.stocks.push({ ownedShare, price, quantity, Date });
            await order.save();
            res.status(200).json({ message: "주식 정보가 추가되었습니다.", order });
        } else {
            // 기존에 거래한적 없는 유저이면, 새로운 Order 생성
            const newOrder = new Order({
                user: userId,
                stocks: [{ ownedShare, price, quantity, Date }]
            });
            await newOrder.save();
            res.status(201).json({ message: "새로운 주문이 생성되었습니다.", newOrder });
        }
    } catch (err) {
        console.error(err);
        return next(err);
    }
});

router.post("/buyOrSell", authHandler, async (req, res, next) => {
  // 매수 기능
  try {
    const { ownedShare, price, quantity, buyOrSell } = req.body;
    // 미체결 등록
    const reserveData = await buyOrSellOrder(req.user.id, ownedShare, price, quantity, buyOrSell);
    res.json(reserveData);
  } catch (err) {
    return next(err);
  }
});

router.get("/myHistory/:code", authHandler, async (req, res, next) => {
  try {
    const { code } = req.params;
    const myHistory = await getMyHistory(req.user.id, code);
    res.json(myHistory);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
