const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const getPopularStock = async () => {
  try {
    const config = {
      headers: { apiKey: process.env.API_KEY },
    };

    const response = await axios.get(
      "https://gapi.shinhaninvest.com:8443/openapi/v1.0/ranking/rising",
      config
    );

    const popularStocks = response.data.dataBody.list;
    // 1~3위까지
    const slicedPopularStocks = popularStocks.slice(0, 3);

    //한투 주식 현재가 시세 prdy_ctrt, stck_prpr

    return slicedPopularStocks;
  } catch (err) {
    throw new ApplicationError(400, "인기있는 종목을 검색할 수 없습니다.");
  }
};

module.exports = { getPopularStock };
