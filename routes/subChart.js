const express = require('express');
const router = express.Router();
const {SMA,WMA,EMA,BBANDS, SAR, MACD, STOCHF, STOCH, CCI, MOM, RSI,ROC, AD, ATR, MFI, OBV, ADOSC, TRIX, WILLR, DX, ADX, ADXR, AROON, AROONOSC, STOCHRSI, ULTOSC, PPO} = require('../service/taLib/taLib.js');

router.post('/SMA',(req, res, next)=>{
    const response1 = SMA(req.body.chart, req.body.lineTime1);
    const response2 = SMA(req.body.chart, req.body.lineTime2);
    const response3 = SMA(req.body.chart, req.body.lineTime3);
    const response4 = SMA(req.body.chart, req.body.lineTime4);
    const response5 = SMA(req.body.chart, req.body.lineTime5);

    const responseData = {
        response1: response1,
        response2: response2,
        response3: response3,
        response4: response4,
        response5: response5
    };
    res.json(responseData);
});

router.post('/WMA',(req, res, next)=>{
    const response1 = WMA(req.body.chart, req.body.lineTime1);
    const response2 = WMA(req.body.chart, req.body.lineTime2);
    const response3 = WMA(req.body.chart, req.body.lineTime3);
    const response4 = WMA(req.body.chart, req.body.lineTime4);
    const response5 = WMA(req.body.chart, req.body.lineTime5);

    const responseData = {
        response1: response1,
        response2: response2,
        response3: response3,
        response4: response4,
        response5: response5
    };

    res.json(responseData);
});

router.post('/EMA',(req, res, next)=>{
    const response1 = EMA(req.body.chart, req.body.lineTime1);
    const response2 = EMA(req.body.chart, req.body.lineTime2);
    const response3 = EMA(req.body.chart, req.body.lineTime3);
    const response4 = EMA(req.body.chart, req.body.lineTime4);
    const response5 = EMA(req.body.chart, req.body.lineTime5);

    const responseData = {
        response1: response1,
        response2: response2,
        response3: response3,
        response4: response4,
        response5: response5
    };

    res.json(responseData);
});

router.post('/BBANDS',(req, res)=>{
    const response = BBANDS(req.body.chart, req.body.lineTime, req.body.stdev);
    res.json(response);
});

router.post('/SAR', (req, res)=>{
    const response =  SAR(req.body.chart, req.body.acc, req.body.accMax);
    res.json(response);
});

router.post('/MACD', (req, res)=>{
    const response =  MACD(req.body.chart, req.body.shortPeriod, req.body.longPeriod, req.body.signalPeriod);
    res.json(response);
});

router.post('/STOCHF', (req, res)=>{
    const response = STOCHF(req.body.chart, req.body.period_K, req.body.period_D);
    res.json(response);
});

router.post('/STOCH', (req, res)=>{
    const response = STOCH(req.body.chart, req.body.Date, req.body.period_K, req.body.period_D);
    res.json(response);
});

router.post('/RSI', (req, res)=>{
    const response = RSI(req.body.chart, req.body.Date);
    res.json(response);
});

router.post('/CCI', (req, res)=>{
    const response = CCI(req.body.chart, req.body.Date);
    res.json(response);
});

router.post('/MOM', (req, res)=>{
    const response = MOM(req.body.chart, req.body.Date);
    res.json(response);
});

router.post('/ROC', (req, res)=>{
    const response = ROC(req.body.chart, req.body.Date);
    res.json(response);
});

router.post('/AD', (req, res)=>{
    const response = AD(req.body.chart);
    res.json(response);
});

router.post('/ATR', (req, res)=>{
    const response = ATR(req.body.chart, req.body.Date);
    res.json(response);
});

router.post('/MFI', (req, res)=>{
    const response = MFI(req.body.chart, req.body.Date);
    res.json(response);
});

router.post('/OBV', (req, res)=>{
    const response = OBV(req.body.chart);
    res.json(response);
});

router.post('/ADOSC', (req, res)=>{
    const response = ADOSC(req.body.chart, req.body.shortPeriod, req.body.longPeriod);
    res.json(response);
});

router.post('/TRIX', (req, res)=>{
    const response = TRIX(req.body.chart, req.body.Date);
    res.json(response);
});

router.post('/WILLR', (req, res)=>{
    const response = WILLR(req.body.chart, req.body.Date);
    res.json(response);
});

router.post('/DX', (req, res)=>{
    const response = DX(req.body.chart, req.body.Date);
    res.json(response);
});

router.post('/ADX', (req, res)=>{
    const response = ADX(req.body.chart, req.body.Date);
    res.json(response);
});

router.post('/ADXR', (req, res)=>{
    const response = ADXR(req.body.chart, req.body.Date);
    res.json(response);
});

router.post('/AROON', (req, res)=>{
    const response = AROON(req.body.chart, req.body.Date);
    res.json(response);
});

router.post('/AROONOSC', (req, res)=>{
    const response = AROONOSC(req.body.chart, req.body.Date);
    res.json(response);
});

router.post('/STOCHRSI', (req, res)=>{
    const response = STOCHRSI(req.body.chart, req.body.Date, req.body.period_K, req.body.period_D);
    res.json(response);
});

router.post('/ULTOSC', (req, res)=>{
    const response = ULTOSC(req.body.chart, req.body.shortPeriod, req.body.middlePeriod, req.body.longPeriod);
    res.json(response);
});

router.post('/PPO', (req, res)=>{
    const response = PPO(req.body.chart, req.body.shortPeriod, req.body.longPeriod);
    res.json(response);
});

module.exports = router;