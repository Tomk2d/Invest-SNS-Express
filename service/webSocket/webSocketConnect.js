// events 모듈을 불러옵니다.
const EventEmitter = require('events');
class WebSocketEventEmitter extends EventEmitter {}
const webSocketEmitter = new WebSocketEventEmitter();

const WebSocket = require('ws');
require("dotenv").config();

let ws = null;

function webSocketConnect(code) {
    ws = new WebSocket('ws://ops.koreainvestment.com:31000');

    ws.on('open', function open() {
        console.log('웹소켓 연결 성공');
        const message = JSON.stringify({
            header: {
                approval_key: process.env.SOCKET_TOKEN,
                custtype: "P",
                tr_type: "1",
                "content-type": "utf-8"
            },
            body: {
                input: {
                tr_id: "H0STCNT0",
                tr_key: code
                }
            }
        });
        ws.send(message);
    });

    ws.on('message', function incoming(data) {
        const messageString = data.toString();
        try {
            const messageObject = JSON.parse(messageString);
            // 여기에서 이벤트를 발생.
            webSocketEmitter.emit('newData', messageObject);
        } catch (error) {
            console.error('메시지 처리 중 오류 발생:', error);
        }
    });

    ws.on('close', function close() {
        console.log('웹소켓 연결 종료');
        ws = null;
    });

    ws.on('error', function error(err) {
        console.error('웹소켓 연결 오류:', err);
    });
}

function webSocketClose() {
    return new Promise((resolve, reject) => {
        if (ws) {
            ws.on('close', function close() {
                console.log('웹소켓 연결 종료');
                ws = null;
                resolve();
            });
            ws.close();
        } else {
            resolve();
        }
    });
}

module.exports = { webSocketConnect, webSocketClose, webSocketEmitter };
