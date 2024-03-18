const axios = require('axios');
const fs = require('fs');
const path = require('path');
require("dotenv").config();


// .env 파일 경로


async function getToken(){
    const response = await axios.post(`${process.env.VTS}/oauth2/tokenP`,{"grant_type": "client_credentials", "appkey":`${process.env.VTS_APPKEY}`, "appsecret":`${process.env.VTS_APPSECRET}`});
    const token = response.data.access_token;
    console.log(token);

    const envPath = path.join(__dirname, '../../.env');
    fs.readFile(envPath, 'utf8', function (err, data) {
      if (err) {
        return console.log(err);
      }
      // 정규 표현식을 사용하여 VTS_TOKEN 값을 찾아서 새 값으로 교체
      const result = data.replace(/(VTS_TOKEN=).*\n/, `$1${token}\n`);
  
      fs.writeFile(envPath, result, 'utf8', function (err) {
         if (err) return console.log(err);
         console.log('VTS_TOKEN 자동으로 변경됨');
      });
    });
}


module.exports = getToken;
