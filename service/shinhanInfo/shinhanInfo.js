const axios = require("axios");
const dotenv = require("dotenv");
const ApplicationError = require("../../util/error/applicationError");

dotenv.config();

const config = {
  headers: { apiKey: process.env.API_KEY },
};

const getStrategy = async () => {
  try {
    const response = await axios.get(
      "https://gapi.shinhaninvest.com:8443/openapi/v1.0/strategy/invest",
      config
    );

    const strategy = response.data.dataBody.list;

    const marketIssue = strategy.find((item) => item.bbs_name === "마켓이슈");
    const economicAnalysis = strategy.find(
      (item) => item.bbs_name === "경제분석"
    );
    const shinhanDaily = strategy.find(
      (item) => item.bbs_name === "신한 Daily"
    );
    const corporateAnalysis = strategy.find(
      (item) => item.bbs_name === "기업분석"
    );

    return {
      marketIssue,
      economicAnalysis,
      shinhanDaily,
      corporateAnalysis,
    };
  } catch (err) {
    throw new ApplicationError(400, "투자전략을 검색할 수 없습니다.");
  }
};

const getHotStock = async (type) => {
  try {
    const response = await axios.get(
      `https://gapi.shinhaninvest.com:8443/openapi/v1.0/ranking/issue?query_type=${type}`,
      config
    );

    const hotStocks = response.data.dataBody;

    //한투 주식 현재가 시세 prdy_ctrt, stck_prpr

    return hotStocks;
  } catch (err) {
    throw new ApplicationError(400, "인기있는 종목을 검색할 수 없습니다.");
  }
};

const getPopularStock = async () => {
  try {
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

module.exports = { getHotStock, getPopularStock, getStrategy };
