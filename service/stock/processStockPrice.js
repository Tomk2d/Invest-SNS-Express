const axios = require('axios');

async function processStockPrice(time_format, code, start_date, end_date){
    const headers = {       // 인증키 관련.
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.VTS_TOKEN}`,
        appkey: process.env.VTS_APPKEY,
        appsecret: process.env.VTS_APPSECRET,
        tr_id: "FHKST03010100",
    };
    const response = await axios.get(   // 한투 api 에서 봉 조회.
      `${process.env.VTS}/uapi/domestic-stock/v1/quotations/inquire-daily-itemchartprice?fid_cond_mrkt_div_code=J&fid_input_iscd=${code}&fid_input_date_1=${start_date}&fid_input_date_2=${end_date}&fid_period_div_code=${time_format}&fid_org_adj_prc=0`
      ,{ headers});

    const priceArray = response.data.output2;
    const result = priceArray.map((price) =>{
        return {
            open : Number(price.stck_oprc),
            close : Number(price.stck_clpr),
            high : Number(price.stck_hgpr),
            low : Number(price.stck_lwpr),
            volume : Number(price.acml_vol),
            date : price.stck_bsop_date,
        }
    });

    return result;
}

module.exports = processStockPrice;