const axios = require('axios');

async function kospiKosdaq(){
    const url = 'https://m.stock.naver.com/front-api/realTime/home/majorIndex?stockType=domestic&stockEndType=index';
    const response = await axios.post(url, {"codes": ["KOSPI", "KOSDAQ"]});
    const kospiData = response.data.result.majorIndexMap.KOSPI
    const kosdaqData = response.data.result.majorIndexMap.KOSDAQ
    return ({
        kospi : {
            name : kospiData.itemCode,
            price : kospiData.closePrice,
            upDown : kospiData.compareToPreviousClosePrice,
            rate : kospiData.fluctuationsRatio
        },
        kosdaq : {
            name : kosdaqData.itemCode,
            price : kosdaqData.closePrice,
            upDown : kosdaqData.compareToPreviousClosePrice,
            rate : kosdaqData.fluctuationsRatio
        }
    })
}

module.exports = kospiKosdaq;