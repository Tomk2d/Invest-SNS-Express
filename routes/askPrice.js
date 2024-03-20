const express = require("express");
const router = express.Router();
const {askPriceConnect, askPriceClose, webSocketEmitter} = require('../service/webSocket/askPrice')

router.post("/", async (req, res) => {
    try {
        await askPriceClose(); // 기존 연결 종료
        askPriceConnect(req.body.code);
        webSocketEmitter.on('newData2', (data) => {
            console.log(data);
        });
    } catch (error) {
        console.error("웹소켓 처리 중 오류 발생:", error);
        res.status(500).send("웹소켓 처리 중 오류 발생");
    }
});

module.exports = router;
