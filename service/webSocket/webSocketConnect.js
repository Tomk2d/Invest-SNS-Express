const { Server } = require("socket.io");
const WebSocket = require("ws");
const EventEmitter = require("events");
class WebSocketEventEmitter extends EventEmitter {}
const stockEmitter = new WebSocketEventEmitter();
const { processOrder } = require("../../service/order/processOrder");
require("dotenv").config();

const io = new Server({
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const wsConnections = new Map(); // 코드별 WebSocket 연결 관리
const ws = new WebSocket("ws://ops.koreainvestment.com:31000");

stockEmitter.on("hoga", (data) => {
  processOrder(data);
});

ws.on("open", function open() {
  console.log("한국투자증권 소켓 연결 완료");
});

function webSocketConnect(code) {
  if (wsConnections.has(code)) {
    console.log(`WebSocket for code ${code} already exists.`);
    return;
  }
  console.log("webSocketConnect", code);

  stockEmitter.on(code, (data) => {
    // 체결, 미체결
    processOrder(data);
  });

  sendInitialMessages(code);

  ws.on("message", function incoming(data) {
    const messageString = data.toString();
    if (messageString[0] === "0" || messageString[0] === "1") {
      let messageArray = messageString.split("|");
      let trid = messageArray[1];
      let priceStr = messageArray[3];

      if (trid === "H0STCNT0") {
        let priceArray = priceStr.split("^");
        let response = {
          code: priceArray[0],
          time: priceArray[1],
          close: priceArray[2],
          open: priceArray[7],
          high: priceArray[8],
          low: priceArray[9],
        };
        io.to(priceArray[0]).emit("nowPrice", { message: response });
      } else if (trid === "H0STASP0") {
        let priceArray = priceStr.split("^");
        let response = {
          code: priceArray[0],
          time: priceArray[1],
          sellPrice: priceArray.slice(3, 13),
          buyPrice: priceArray.slice(13, 23),
          sellAmount: priceArray.slice(23, 33),
          buyAmount: priceArray.slice(33, 43),
        };
        io.to(priceArray[0]).emit("askPrice", { message: response });
        stockEmitter.emit(priceArray[0], response);
      } else {
        console.log("Unknown TRID:", trid);
      }
    } else {
      console.log("Header:", messageString);
    }
  });

  ws.on("close", function close() {
    console.log("웹소켓 연결 종료 for code", code);
    wsConnections.delete(code);
  });

  ws.on("error", function error(err) {
    console.error("웹소켓 연결 오류 for code", code, ":", err);
    wsConnections.delete(code);
  });

  wsConnections.set(code, ws);
}

function sendInitialMessages(code) {
  const messageNow = JSON.stringify({
    header: {
      approval_key: process.env.SOCKET_TOKEN,
      custtype: "P",
      tr_type: "1",
      "content-type": "utf-8",
    },
    body: {
      input: {
        tr_id: "H0STCNT0",
        tr_key: code,
      },
    },
  });
  ws.send(messageNow);

  const messageAsk = JSON.stringify({
    header: {
      approval_key: process.env.SOCKET_TOKEN,
      custtype: "P",
      tr_type: "1",
      "content-type": "utf-8",
    },
    body: {
      input: {
        tr_id: "H0STASP0",
        tr_key: code,
      },
    },
  });
  ws.send(messageAsk);
}

io.on("connection", (socket) => {
  console.log("클라이언트가 연결되었습니다.");

  socket.on("joinRoom", (code) => {
    console.log(`${socket.id} is joining room ${code}`);
    socket.join(code);
    webSocketConnect(code);

    console.log(" 열린 방의 수 : ", socket.rooms);
  });

  socket.on("leaveRoom", (code) => {
    console.log(`${socket.id} is leaving room ${code}`);
    socket.leave(code);
    // socket.disconnect(code);
    console.log(" 열린 방의 수 : ", socket.rooms);
  });
});

(module.exports = io), stockEmitter;
