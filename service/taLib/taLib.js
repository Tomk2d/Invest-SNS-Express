var talib = require("talib");


function processData(stockData){
    let marketData = {open:[], high:[], low:[], close:[],volume:[]}
    stockData.map(el=>{
          marketData.open.push(el.open)
          marketData.high.push(el.high)
          marketData.low.push(el.low)
          marketData.close.push(el.close)
          marketData.volume.push(el.volume)
    })
    return marketData;
}

function SMA(stockData, lineTime){
    const marketData = processData(stockData);

    var indicatorParams = {
        name: "SMA",
        startIdx: 0,
        endIdx: marketData.close.length - 1,
        inReal: marketData.close,
        optInTimePeriod: lineTime,
    };
  
    const result = talib.execute(indicatorParams);
    return result;
}

function WMA(stockData, lineTime){
    const marketData = processData(stockData);
    var indicatorParams = {
        name: "WMA",
        startIdx: 0,
        endIdx: marketData.close.length - 1,
        inReal: marketData.close,
        optInTimePeriod: lineTime,
    };
    const result = talib.execute(indicatorParams);
    return result;
}

function EMA(stockData, lineTime){
    const marketData = processData(stockData);
    var indicatorParams = {
        name: "EMA",
        startIdx: 0,
        endIdx: marketData.close.length - 1,
        inReal: marketData.close,
        optInTimePeriod: lineTime,
    };
    const result = talib.execute(indicatorParams);
    return result;
}

function BBANDS(stockData, lineTime, stdev){    //stdev : 표준편차 배수
    const marketData = processData(stockData);
    var indicatorParams = {
        name: "BBANDS",
        startIdx: 0,
        endIdx: marketData.close.length - 1,
        inReal: marketData.close,
        optInTimePeriod: lineTime,
        optInNbDevUp: stdev,
        optInNbDevDn: stdev,
        optInMAType: 0,
    };
    const result = talib.execute(indicatorParams);
    return result;
}

function SAR(stockData, opt, optMax){
    const marketData = processData(stockData);
    var indicatorParams = {
        name: "SAR",
        startIdx: 0,
        endIdx: marketData.close.length - 1,
        high: marketData.high,
        low: marketData.low,
        optInAcceleration: opt,
        optInMaximum: optMax      
    };
    const result = talib.execute(indicatorParams);
    return result;
}

function MACD(stockData, shortPeriod, longPeriod, signalPeriod){
    const marketData = processData(stockData);
    var indicatorParams = {
        name: "MACD",
        startIdx: 0,
        endIdx: marketData.close.length - 1,
        inReal : marketData.close,
        optInFastPeriod: shortPeriod, // 단기
        optInSlowPeriod: longPeriod, // 장기
        optInSignalPeriod: signalPeriod,  //시그널  
    };
    const result = talib.execute(indicatorParams);
    return result;
}

function STOCHF(stockData, K, D){
    const marketData = processData(stockData);
    var indicatorParams = {
        name: "STOCHF",
        startIdx: 0,
        endIdx: marketData.close.length - 1,
        high: marketData.high,
        low: marketData.low,
        close: marketData.close,
        optInFastK_Period: K, // 기간K
        optInFastD_Period: D, // 기간D
        optInFastD_MAType: 0, // Type of Moving Average for Fast-D
    };
    
    const result = talib.execute(indicatorParams);
    return result;
}

function STOCH(stockData, Date, K, D){
    const marketData = processData(stockData);
    var indicatorParams = {
        name: "STOCH",
        startIdx: 0,
        endIdx: marketData.close.length - 1,
        high: marketData.high,
        low: marketData.low,
        close: marketData.close,
        optInFastK_Period: Date, // 기간
        optInSlowK_Period: K, // 기간K
        optInSlowD_Period: D, // 기간D
        optInSlowK_MAType: 0, // Type of Moving Average for Slow-K
        optInSlowD_MAType: 0, // Type of Moving Average for Slow-D
    };
    
    const result = talib.execute(indicatorParams);
    return result;
}

function RSI(stockData, Date){
    const marketData = processData(stockData);
    var indicatorParams = {
        name: "RSI",
        startIdx: 0,
        endIdx: marketData.close.length - 1,
        inReal: marketData.close, // 분석하려는 가격 데이터를 넣는데 보통 종가를 넣는대
        optInTimePeriod: Date,
    };
    
    const result = talib.execute(indicatorParams);
    return result;
}

function CCI(stockData, Date){
    const marketData = processData(stockData);
    var indicatorParams = {
        name: "CCI",
        startIdx: 0,
        endIdx: marketData.close.length - 1,
        high: marketData.high,
        low: marketData.low,
        close: marketData.close,
        optInTimePeriod: Date, 
      };
    const result = talib.execute(indicatorParams);
    return result;
}

function MOM(stockData, Date){
    const marketData = processData(stockData);
    var indicatorParams = {
        name: "MOM",
        startIdx: 0,
        endIdx: marketData.close.length - 1,
        inReal: marketData.close, // 분석하려는 가격 데이터를 넣는데 보통 종가를 넣는대
        optInTimePeriod: Date,
    };
    const result = talib.execute(indicatorParams);
    return result;
}

function ROC(stockData, Date){
    const marketData = processData(stockData);
    var indicatorParams = {
        name: "ROC",
        startIdx: 0,
        endIdx: marketData.close.length - 1,
        inReal: marketData.close, // 분석하려는 가격 데이터를 넣는데 보통 종가를 넣는대
        optInTimePeriod: Date,
    };
    const result = talib.execute(indicatorParams);
    return result;
}

function AD(stockData){
    const marketData = processData(stockData);
    var indicatorParams = {
        name: "AD",
        startIdx: 0,
        endIdx: marketData.close.length - 1,
        high : marketData.high,
        low : marketData.low,
        close : marketData.close,
        volume : marketData.volume,
    };
    const result = talib.execute(indicatorParams);
    return result;
}

function ATR(stockData, Date){
    const marketData = processData(stockData);
    var indicatorParams = {
        name: "ATR",
        startIdx: 0,
        endIdx: marketData.close.length - 1,
        high : marketData.high,
        low : marketData.low,
        close : marketData.close,
        optInTimePeriod : Date,
    };
    const result = talib.execute(indicatorParams);
    return result;
}

function MFI(stockData, Date){
    const marketData = processData(stockData);
    var indicatorParams = {
        name: "MFI",
        startIdx: 0,
        endIdx: marketData.close.length - 1,
        high : marketData.high,
        low : marketData.low,
        close : marketData.close,
        volume : marketData.volume,
        optInTimePeriod : Date,
    };
    const result = talib.execute(indicatorParams);
    return result;
}

function OBV(stockData){
    const marketData = processData(stockData);
    var indicatorParams = {
        name: "OBV",
        startIdx: 0,
        endIdx: marketData.close.length - 1,
        inReal : marketData.close,
        volume : marketData.volume,
    };
    const result = talib.execute(indicatorParams);
    return result;
}

function ADOSC(stockData, shortPeriod, longPeriod){
    const marketData = processData(stockData);
    var indicatorParams = {
        name: "ADOSC",
        startIdx: 0,
        endIdx: marketData.close.length - 1,
        high : marketData.high,
        low : marketData.low,
        close : marketData.close,
        volume : marketData.volume,
        optInFastPeriod: shortPeriod, // 단기
        optInSlowPeriod: longPeriod, // 장기
    };
    const result = talib.execute(indicatorParams);
    return result;
}

function TRIX(stockData, Date){
    const marketData = processData(stockData);
    var indicatorParams = {
        name: "TRIX",
        startIdx: 0,
        endIdx: marketData.close.length - 1,
        inReal : marketData.close,
        optInTimePeriod : Date,
    };
    const result = talib.execute(indicatorParams);
    return result;
}

function WILLR(stockData, Date){
    const marketData = processData(stockData);
    var indicatorParams = {
        name: "WILLR",
        startIdx: 0,
        endIdx: marketData.close.length - 1,
        high : marketData.high,
        low : marketData.low,
        close : marketData.close,
        optInTimePeriod : Date,
    };
    const result = talib.execute(indicatorParams);
    return result;
}

function DX(stockData, Date){
    const marketData = processData(stockData);
    var indicatorParams = {
        name: "DX",
        startIdx: 0,
        endIdx: marketData.close.length - 1,
        high : marketData.high,
        low : marketData.low,
        close : marketData.close,
        optInTimePeriod : Date,
    };
    const result = talib.execute(indicatorParams);
    return result;
}

function ADX(stockData, Date){
    const marketData = processData(stockData);
    var indicatorParams = {
        name: "ADX",
        startIdx: 0,
        endIdx: marketData.close.length - 1,
        high : marketData.high,
        low : marketData.low,
        close : marketData.close,
        optInTimePeriod : Date,
    };
    const result = talib.execute(indicatorParams);
    return result;
}

function ADXR(stockData, Date){
    const marketData = processData(stockData);
    var indicatorParams = {
        name: "ADXR",
        startIdx: 0,
        endIdx: marketData.close.length - 1,
        high : marketData.high,
        low : marketData.low,
        close : marketData.close,
        optInTimePeriod : Date,
    };
    const result = talib.execute(indicatorParams);
    return result;
}

function AROON(stockData, Date){
    const marketData = processData(stockData);
    var indicatorParams = {
        name: "AROON",
        startIdx: 0,
        endIdx: marketData.close.length - 1,
        high : marketData.high,
        low : marketData.low,
        close : marketData.close,
        optInTimePeriod : Date,
    };
    const result = talib.execute(indicatorParams);
    return result;
}

function AROONOSC(stockData, Date){
    const marketData = processData(stockData);
    var indicatorParams = {
        name: "AROONOSC",
        startIdx: 0,
        endIdx: marketData.close.length - 1,
        high : marketData.high,
        low : marketData.low,
        optInTimePeriod : Date,
    };
    const result = talib.execute(indicatorParams);
    return result;
}

function STOCHRSI(stockData, Date, K, D){
    const marketData = processData(stockData);
    var indicatorParams = {
        name: "STOCHRSI",
        startIdx: 0,
        endIdx: marketData.close.length - 1,
        inReal: marketData.close, // 분석하려는 가격 데이터를 넣는데 보통 종가를 넣는대
        optInTimePeriod : Date,
        optInFastK_Period: K, // 기간K
        optInFastD_Period: D, // 기간D
        optInFastD_MAType: 0,
    };
    const result = talib.execute(indicatorParams);
    return result;
}

function ULTOSC(stockData, shortPeriod, middlePeriod, longPeriod){
    const marketData = processData(stockData);
    var indicatorParams = {
        name: "ULTOSC",
        startIdx: 0,
        endIdx: marketData.close.length - 1,
        high: marketData.high,
        low: marketData.low,
        close: marketData.close,
        optInTimePeriod1: longPeriod, // 장기
        optInTimePeriod2: middlePeriod, // 중기
        optInTimePeriod3: shortPeriod, // 단기
    };
    const result = talib.execute(indicatorParams);
    return result;
}

function PPO(stockData, shortPeriod,longPeriod){
    const marketData = processData(stockData);
    var indicatorParams = {
        name: "PPO",
        startIdx: 0,
        endIdx: marketData.close.length - 1,
        inReal: marketData.close,
        optInSlowPeriod: longPeriod, // 장기
        optInFastPeriod: shortPeriod, // 단기
        optInMAType: 0,
    };
    const result = talib.execute(indicatorParams);
    return result;
}

module.exports = {SMA,WMA,EMA,BBANDS, SAR, MACD, STOCHF, STOCH, CCI, MOM, RSI,ROC, AD, ATR, MFI, OBV, ADOSC, TRIX, WILLR, DX, ADX, ADXR, AROON, AROONOSC, STOCHRSI, ULTOSC, PPO};