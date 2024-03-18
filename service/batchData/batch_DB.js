const axios = require('axios');
const processStockPrice = require('../stock/processStockPrice.js');
const StockCode = require('../../model/StockCode.js');


async function getDayData(){
    try {
        const stocks = await StockCode.find(); // StockCode 검색
        
        const codeArray = stocks.map(stock => stock.code); // 코드 배열 생성

        const today = new Date();
        const start_date = today.toISOString().slice(0, 10).replace(/-/g, '');  // 현재 날짜를 YYYYMMDD 형식으로 변환
        const end_date = start_date;


        let result = await processStockPrice('D', '005930', start_date, end_date);
        console.log(result);


    } catch(err) {
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
