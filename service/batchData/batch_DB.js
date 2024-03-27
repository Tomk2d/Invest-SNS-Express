const axios = require('axios');
const processStockPrice = require('../stock/processStockPrice.js');
const StockCode = require('../../model/StockCode.js');
const fs = require('fs');


// 어제꺼 일 데이터 업데이트
async function getDayData() {
    try {
        const stocks = await StockCode.find(); // StockCode 검색
        const codeArray = stocks.map(stock => stock.code); // 코드 배열 생성

        const today = new Date();
        const utc = new Date(today.getTime() - (24 * 60 * 60 * 1000));
        let kst = new Date(utc.setHours(utc.getHours() + 9));

        const start_date = '19000101'
        const end_date = kst.toISOString().slice(0, 10).replace(/-/g, ''); // 현재 날짜를 YYYYMMDD 형식으로 변환

        // 1초에 최대 5개의 요청을 처리하는 로직
        const maxRequests = 5;
        let requestCounter = 0;
        let requestGroupCounter = 0;
        let fileCount= 14;

        let resultArray = []
        let result = null

        for (let i=1300;i<codeArray.length;i++) {
            // 1초에 5개 이상의 요청이 발생하지 않도록 제어
            if (requestCounter >= maxRequests) {
                await new Promise(resolve => setTimeout(resolve, 2000)); // 1.5초 대기
                requestCounter = 0; // 카운터 초기화
            }
        
            result = await processStockPrice('M', codeArray[i], start_date, end_date);
            let timestamp = new Date(Date.parse(result[0].date.slice(0, 4) + "-" + result[0].date.slice(4, 6) + "-" + result[0].date.slice(6, 8)));
            resultArray.push(result[0]);

            console.log(result);

            // 100개 하고 1분 쉬기
            if (requestGroupCounter >= 99) { // 0부터 시작하므로 399가 400번째 요청
                fs.writeFile(`/Users/shin-uijin/InvestSNS/Invest-SNS-Express/service/batchData/MonthData/MonthPrice${start_date}-${fileCount}.json`, JSON.stringify(resultArray, null, 2), 'utf8', (err) => {
                    if (err) throw err;
                    console.log('The file has been saved!');
                });
                await new Promise(resolve2 => setTimeout(resolve2, 30000)); // 1분 쉬기

                requestGroupCounter = 0;
                fileCount++;
                resultArray = [];
            } else {
                requestGroupCounter++;
            }
            requestCounter++; 
        }
        return resultArray;

    } catch (err) {
        console.error(err);
    }
}

async function getMinuteData(code){
    const headers = {       // 인증키 관련.
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.VTS_TOKEN}`,
        appkey: process.env.VTS_APPKEY,
        appsecret: process.env.VTS_APPSECRET,
        tr_id: "FHKST03010200",
        custtype : 'P',
    };
    let now_time = new Date();
    let now_hour = now_time.getHours().toString();
    let now_minute = now_time.getMinutes().toString();
    const response = await axios.get(   // 한투 api 에서 봉 조회.
      `${process.env.VTS}/uapi/domestic-stock/v1/quotations/inquire-time-itemchartprice?fid_cond_mrkt_div_code=J&fid_etc_cls_code=&fid_input_hour_1=${now_hour+ now_minute}00&fid_input_iscd=${code}&fid_pw_data_incu_yn=Y`
      ,{ headers});
    
    const priceArray = response.data.output2;
    const result = priceArray.map((price) =>{
        return {
            open : Number(price.stck_oprc),
            close : Number(price.stck_prpr),
            high : Number(price.stck_hgpr),
            low : Number(price.stck_lwpr),
            volume : Number(price.cntg_vol),
            date : price.stck_bsop_date,
            time : price.stck_cntg_hour
        }
    });
    return result;
}


module.exports = {getMinuteData, getDayData};
