const express = require("express");
const router = express.Router();
const { webSocketConnect, webSocketClose, webSocketEmitter } = require('../service/webSocket/webSocketConnect');

router.post("/", async (req, res) => {
    try {
        await webSocketClose(); // 기존 연결 종료
        webSocketConnect(req.body.code);
        webSocketEmitter.on('newData', (data) => {
            console.log(data);
        });
    } catch (error) {
        console.error("웹소켓 처리 중 오류 발생:", error);
        res.status(500).send("웹소켓 처리 중 오류 발생");
    }
});

module.exports = router;
