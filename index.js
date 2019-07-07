
const axios = require('axios');
const qs = require('qs');

const { INDUSTRY_CODE_LIST, MARKET_TYPE_LIST } = require('./constants');
const { sleep } = require('./util');

// 資料來源網址
const RESOURCE_URL = 'https://mops.twse.com.tw/mops/web/t100sb15';

// 每次打 request 的間距
const THROTTLE_TIME = 1000; // ms

const DEFAULT_FORM_DATA = {
  encodeURIComponent: 1,
  step: 1,
  firstin: 1,
};

/**
 * 取得指定年份，某個產業上市或上櫃公司的公開薪資網頁資料
 * @param {string} industryCode 產業類別代碼
 * @param {string} marketType 市場種類
 * @param {int} year 年份（民國）
 *
 * @returns {string} 網頁 html 字串
 */
const getOneIndustryData = async (industryCode, marketType, year) => {
  const response = await axios.post(RESOURCE_URL, qs.stringify({
    ...DEFAULT_FORM_DATA,
    code: industryCode,
    TYPEK: marketType,
    RYEAR: `${year}`,
  }));
  return response.data;
}

// main procedure
(async () => {
  for (let marketType of MARKET_TYPE_LIST) {
    for (let industryCode of INDUSTRY_CODE_LIST) {
      const html = await getOneIndustryData(industryCode, marketType, 107);
      await sleep(THROTTLE_TIME);
    }
  }
})();
