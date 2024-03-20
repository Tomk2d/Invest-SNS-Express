// events 모듈을 불러옵니다.
const {Server} = require('socket.io');
const WebSocket = require('ws');
require("dotenv").config();

const io = new Server({
    cors :{
        origin : "*",
        methods : ["GET", "POST"]
    }
});

let ws = null;


function webSocketConnect(code) {
    ws = new WebSocket('ws://ops.koreainvestment.com:31000');

    const promiseMessageNow = () => new Promise((resolve, reject) => {
        const messageNow = JSON.stringify({
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
        ws.send(messageNow);
        return true;
    })
    
    
    const promiseAskNow = () => new Promise((resolve, reject) => {
        const messageAsk = JSON.stringify({
            header: {
                approval_key: process.env.SOCKET_TOKEN,
                custtype: "P",
                tr_type: "1",
                "content-type": "utf-8"
            },
            body: {
                input: {
                tr_id: "H0STASP0",
                tr_key: code
                }
            }
        });
        ws.send(messageAsk);
        return true;
    })

    ws.on('open', async function open() {
        console.log('웹소켓 연결 성공');
        promiseMessageNow().then(promiseAskNow());
    });

    ws.on('message', function incoming(data) {
        const messageString = data.toString();  //  문자열로 바꿈
        if(messageString[0]=== '0' || messageString[0] === '1'){    //  실시간 데이터인 응답값.
            let messageArray = messageString.split('|');
            let hashValue = messageArray[0];    // 암호화 됐는지 안됐는지 여부.
            let trid = messageArray[1];     //  무슨 요청인지
            let priceStr = messageArray[3];    // 실시간 가격.
            
            if (trid === "H0STCNT0"){       //  실시간 체결가
                try {
                    let priceArray = priceStr.split('^');   //  가격 배열로 분리.
                    let response = {
                        code : priceArray[0],
                        time : priceArray[1],
                        close : priceArray[2],
                        open : priceArray[7],
                        high : priceArray[8],
                        low : priceArray[9],
                    }
                    // 여기에서 이벤트를 발생.
                    io.to(code).emit('nowPrice', { message: response });
                } catch (error) {
                    console.error('메시지 처리 중 오류 발생:', error);
                }
            }else if (trid === "H0STASP0"){       //  실시간 체결가
                try {
                    let priceArray = priceStr.split('^');   //  가격 배열로 분리.
                    
                    let response = {
                        code : priceArray[0],
                        time : priceArray[1],
                        sellPrice : [priceArray[3],priceArray[4],priceArray[5],priceArray[6],priceArray[7],priceArray[8],priceArray[9],priceArray[10],priceArray[11],priceArray[12]],   //싼거부터
                        buyPrice : [priceArray[13],priceArray[14],priceArray[15],priceArray[16],priceArray[17],priceArray[18],priceArray[19],priceArray[20],priceArray[21],priceArray[22],],    //비싼거부터
                        sellAmount : [priceArray[23],priceArray[24],priceArray[25],priceArray[26],priceArray[27],priceArray[28],priceArray[29],priceArray[30],priceArray[31],priceArray[32],],
                        buyAmount : [priceArray[33],priceArray[34],priceArray[35],priceArray[36],priceArray[37],priceArray[38],priceArray[39],priceArray[40],priceArray[41],priceArray[42],],
                    } 
                    //console.log(response);
                    // 여기에서 이벤트를 발생.
                    io.to(code).emit('askPrice', { message: response });
                } catch (error) {
                    console.error('메시지 처리 중 오류 발생:', error);
                }
            }
            else{
                console.log("조건값 체크 바람");
            }
        }else{
            console.log('헤더 : ', messageString);
        }
    });

    ws.on('close', function close() {
        console.log('웹소켓 연결 종료');
        ws = null;
    });

    ws.on('error', function error(err) {
        console.error('웹소켓 연결 오류:', err);
    });
    return ws;
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

io.on('connection', (socket) => {
    console.log('클라이언트가 연결되었습니다.');

    // 클라이언트로부터 'joinRoom' 이벤트 수신
    socket.on('joinRoom', (code) => {
        console.log(`${socket.id} is joining room ${code}`);
        socket.join(code); // 클라이언트를 특정 room에 조인시킴
        webSocketConnect(code);
        console.log("rooms : ",socket.rooms);
    });

    // 클라이언트로부터 'leaveRoom' 이벤트 수신
    socket.on('leaveRoom', (code) => {
        console.log(`${socket.id} is leaving room ${code}`);
        socket.leave(code); // 클라이언트를 특정 room에서 떠나게 함
        webSocketClose();
    });
});

module.exports = io;