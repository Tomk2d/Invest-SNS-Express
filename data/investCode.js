const fs = require('fs');
const iconv = require('iconv-lite');

// 파일을 동기적으로 읽어서 버퍼로 저장
const data = fs.readFileSync('/Users/shin-uijin/SNS/app-server-1/data/kospi_code.mst');
// iconv-lite를 사용하여 CP949 인코딩을 UTF-8 문자열로 변환
const content = iconv.decode(data, 'CP949');

// 라인별로 분리
const lines = content.split('\n');

// 각 라인을 JSON 객체로 변환
const jsonResult = lines.map(line => {
  if (line) {
    return {
      code: line.substring(0, 9).trim(),
      market_code: line.substring(9, 21),
      name: line.substring(21, 71).trim().split(/  +/)[0], // 공백 제거
      market : 'kospi'
      // 필요에 따라 추가 필드를 여기에 구현
    };
  }
}).filter(Boolean); // 빈 결과를 필터링

// JSON 객체를 파일로 저장
fs.writeFile('/Users/shin-uijin/InvestSNS/Invest-SNS-Express/data/kospi.json', JSON.stringify(jsonResult, null, 2), 'utf8', (err) => {
  if (err) throw err;
  console.log('The file has been saved!');
});
