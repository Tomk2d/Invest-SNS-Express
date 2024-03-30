const axios = require("axios");
require("dotenv").config();

async function MyOrder(myStocks) {
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  if (!myStocks || !myStocks.stocks || myStocks.stocks.length === 0) {
    return {
      myMoney: [
        {
          wholeMoney: numberWithCommas(100000000),
          cash: numberWithCommas(100000000),
          wholeStockPrice: 0,
          wholeUpDown: 0,
          wholeUpDownRate: 0,
        },
      ],
      mystocks: [],
    };
  }

  const resultArray = {
    myMoney: [],
    mystocks: [],
  };
  const stocks = myStocks.stocks;
  const cash = myStocks.balance;
  const headers = {
    authorization: `Bearer ${process.env.VTS_TOKEN}`,
    appkey: process.env.VTS_APPKEY,
    appsecret: process.env.VTS_APPSECRET,
    tr_id: "FHKST01010100",
  };
  let cnt = 0;
  let max_cnt = 4;
  let whole_money = cash; // 현금 + 보유 주식 가격
  let whole_stock_price = 0; // 보유주식 평가금액 합.
  let whole_up_down = 0; // 보유주식 수익금액 합.
  let whole_buy_price = 0; // 내가 투자한 금액 합.

  for (let stock of stocks) {
    cnt++;
    if (cnt > max_cnt) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      cnt = 0;
    }
    const buyPrice = stock.price;
    const nowData = await axios.get(
      `https://openapivts.koreainvestment.com:29443/uapi/domestic-stock/v1/quotations/inquire-price?fid_cond_mrkt_div_code=J&fid_input_iscd=${stock.code}`,
      { headers: headers }
    );
    const nowPrice = nowData.data.output.stck_prpr;
    const upDownRate = ((nowPrice - buyPrice) / buyPrice) * 100;
    const whole = nowPrice * stock.quantity; //  종목별 가격합.
    const upDown = nowPrice - buyPrice;
    whole_money += whole;
    whole_stock_price += whole;
    whole_up_down += upDown * stock.quantity;
    whole_buy_price += buyPrice * stock.quantity;

    resultArray.mystocks.push({
      code: stock.code,
      name: stock.name,
      amount: stock.quantity,
      price: numberWithCommas(parseInt(nowPrice)),
      whole: numberWithCommas(whole),
      upDownRate: numberWithCommas(upDownRate),
    });
  }
  resultArray.myMoney.push({
    wholeMoney: numberWithCommas(whole_money), // 총 평가자산
    cash: numberWithCommas(cash), // 보유 현금
    wholeStockPrice: numberWithCommas(whole_stock_price), // 보유주식 전체 평가금
    wholeUpDown: numberWithCommas(whole_up_down), // 보유주식 전체 수익금
    wholeUpDownRate: numberWithCommas(
      ((whole_stock_price - whole_buy_price) / whole_buy_price) * 100
    ),
  });

  return resultArray;
}

module.exports = MyOrder;
