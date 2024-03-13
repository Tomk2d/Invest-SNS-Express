const express = require('express');
const router = express.Router();
const {SMA,WMA,EMA,BBANDS, SAR, MACD, STOCHF, STOCH, CCI, MOM, RSI,ROC, AD, ATR, MFI, OBV, ADOSC, TRIX, WILLR, DX, ADX, ADXR, AROON, AROONOSC, STOCHRSI, ULTOSC, PPO} = require('../service/taLib/taLib.js');

router.post('/SMA',(req, res, next)=>{
    const response = SMA(req.body.chart, req.body.lineTime);
    res.json(response);
});

router.post('/WMA',(req, res, next)=>{
    const response = WMA(req.body.chart, req.body.lineTime);
    res.json(response);
});

router.post('/EMA',(req, res, next)=>{
    const response = EMA(req.body.chart, req.body.lineTime);
    res.json(response);
});

router.post('/BBANDS',(req, res)=>{
    const response = BBANDS(req.body.chart, req.body.lineTime, req.body.stdev);
    res.json(response);
});

module.exports = router;