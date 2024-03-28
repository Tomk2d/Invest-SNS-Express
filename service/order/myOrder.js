const axios = require('axios');
require("dotenv").config();


async function MyOrder(myStock){
    resultArray = []
    for (let i=0; i<myStock.length(); i++){
        const stockData = myStock.data[i].stocks;
        const nowData = await axios.get(`${process.env.VST}/uapi/domestic-stock/v1/quotations/inquire-price?fid_cond_mrkt_div_code=J&fid_input_iscd=${stockData.ownedShare}`);
        const nowPrice = nowData.data.output.stck_prpr;
        const upDown = ((nowPrice - stockData.price)/ stockData.price)*100;
        resultArray.push({
            code : stockData.ownedShare,
            amount: stockData.quantity,
            price : nowPrice,
            whole : (nowPrice*stockData.quantity),
            upDown : upDown
        })
    }
    return resultArray;
}

module.exports = MyOrder;