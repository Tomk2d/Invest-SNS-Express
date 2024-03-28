const axios = require("axios");
const fs = require("fs");
const dotenv = require("dotenv");
const ApplicationError = require("../../util/error/applicationError");
const StockCode = require("../../model/StockCode.js");
dotenv.config();

const config = {
  headers: { apiKey: process.env.API_KEY },
};

const getNowAndAskPrice = async () => {
  try {
    const stocks = await StockCode.find(); // StockCode 검색
    const codeArray = stocks.map((stock) => stock.code); // 코드 배열 생성

    const headers = {
      // 인증키 관련.
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.VTS_TOKEN}`,
      appkey: process.env.VTS_APPKEY,
      appsecret: process.env.VTS_APPSECRET,
    };

    const resultArray = [];
    let requestCounter = 0;

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    const formattedDate = `${year}${month}${day}`;

    for (const code of codeArray) {
      // 1초에 최대 5개의 요청을 처리
      if (requestCounter >= 2) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        requestCounter = 0; // 요청 카운터 초기화
      }

      const nowPriceResponse = await axios.get(
        `${process.env.VTS}/uapi/domestic-stock/v1/quotations/inquire-price?fid_cond_mrkt_div_code=J&fid_input_iscd=${code}`,
        { headers: { ...headers, tr_id: "FHKST01010100" } },
        config
      );

      const askPriceResponse = await axios.get(
        `${process.env.VTS}/uapi/domestic-stock/v1/quotations/inquire-asking-price-exp-ccn?fid_cond_mrkt_div_code=J&fid_input_iscd=${code}`,
        { headers: { ...headers, tr_id: "FHKST01010200" } },
        config
      );

      const nowPrice = nowPriceResponse.data.output.stck_prpr;

      const sellPrice = [];
      const buyPrice = [];

      for (let i = 1; i <= 10; i++) {
        sellPrice.push(askPriceResponse.data.output1[`askp${i}`]);
        buyPrice.push(askPriceResponse.data.output1[`bidp${i}`]);
      }

      resultArray.push({
        code,
        nowPrice,
        sellPrice,
        buyPrice,
        date: formattedDate,
      });
      requestCounter++; // 요청 카운트 증가
    }

    // 파일로 저장
    const fileName = "stock_prices.json";
    fs.writeFileSync(fileName, JSON.stringify(resultArray, null, 2));
    console.log(`Result saved to ${fileName}`);

    return resultArray;
  } catch (err) {
    throw new ApplicationError(400, "현재가 및 호가를 검색할 수 없습니다.");
  }
};

module.exports = { getNowAndAskPrice };
