/* 
This has two func to get data 
of 100 product of Shopee and Lazada
*/

const axios = require("axios");

const Counter = require("./counter.js");
const { getDataFromLazada } = require("./lazada_puppeteer.js");

//shopee scraper
const shopee = async(keyword) => {
    const newKeyword = encodeURIComponent(keyword);

    const urlApi = "https://shopee.vn/api/v4/search/search_items";
    const query = `?keyword=${newKeyword}`;
    const defaultQuery = `&by=relevancy&limit=100&newest=0&order=desc&page_type=search&scenario=PAGE_GLOBAL_SEARCH&version=2`;
    const url = urlApi + query + defaultQuery;

    const res = await axios(url);

    const data = res.data.items;
    const counter = new Counter();

    const Nobrand = ["0", "no brand", "nobrand", "none"];

    counter.create(data, Nobrand);

    return counter.items;
};

//lazada scraper
const lazada = async(keyword) => {
    const data = await getDataFromLazada(keyword);
    const Nobrand = ["no brand", "oem", "nno barn", "no baran"];

    const counter = new Counter();
    counter.create(data, Nobrand);

    return counter.items;
};

module.exports = { shopee, lazada };