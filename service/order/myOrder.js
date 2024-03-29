const axios = require('axios');
require("dotenv").config();


async function MyOrder(myStocks){
    resultArray = []
    if (myStocks=== null || myStocks === undefined){
        return 
    }
    const stocks = myStocks.stocks;
    const headers = {
    'authorization' : `Bearer ${process.env.VTS_TOKEN}`,
    'appkey': process.env.VTS_APPKEY,
    'appsecret': process.env.VTS_APPSECRET,
    'tr_id': 'FHKST01010100',
    }
    let cnt = 0;
    let max_cnt = 4;
    for (let stock of stocks){
        cnt++;
        if (cnt > max_cnt){
            await new Promise(resolve => setTimeout(resolve, 1000));
            cnt =0;
        }
        const nowData = await axios.get(`https://openapivts.koreainvestment.com:29443/uapi/domestic-stock/v1/quotations/inquire-price?fid_cond_mrkt_div_code=J&fid_input_iscd=${stock.code}`, { headers: headers });
        const nowPrice = nowData.data.output.stck_prpr;
        console.log(nowData.data);
        const upDown = ((nowPrice - stock.price)/ stock.price)*100;
        const whole = (nowPrice*stock.quantity)
        resultArray.push({
            code : stock.code,
            amount: stock.quantity,
            price : nowPrice,
            whole : whole,
            upDown : upDown
        })
    }
    return resultArray;
}

module.exports = MyOrder;