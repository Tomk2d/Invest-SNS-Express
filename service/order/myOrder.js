const axios = require('axios');
require("dotenv").config();


async function MyOrder(myStock){
    resultArray = []
    if (myStock === null || myStock === undefined){
        return 
    }
    const stocks = myStock.stocks;
    const headers = {
    'authorization' : `Bearer ${process.env.VTS_TOKEN}`,
    'appkey': process.env.VTS_APPKEY,
    'appsecret': process.env.VTS_APPSECRET,
    'tr_id': 'FHKST01010100',
    }
    
    for (let stock of stocks){
        const nowData = await axios.get(`https://openapivts.koreainvestment.com:29443/uapi/domestic-stock/v1/quotations/inquire-price?fid_cond_mrkt_div_code=J&fid_input_iscd=${stock.ownedShare}`, { headers: headers });
        const nowPrice = nowData.data.output.stck_prpr;
        const upDown = ((nowPrice - stock.price)/ stock.price)*100;
        resultArray.push({
            code : stock.ownedShare,
            amount: stock.quantity,
            price : nowPrice,
            whole : (nowPrice*stock.quantity),
            upDown : upDown
        })
    }
    return resultArray;
}

module.exports = MyOrder;