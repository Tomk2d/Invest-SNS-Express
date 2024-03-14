const processStockPrice = require('../stock/processStockPrice.js');
const StockCode = require('../../model/stockCode.js');


async function getDayData(){
    
    const result = await processStockPrice();
}