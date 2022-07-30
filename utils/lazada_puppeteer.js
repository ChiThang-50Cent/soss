const puppeteer = require("puppeteer");

//Use puppeteer because we maybe have a soft ban
//from lazada if try to get data from api url
const getDataFromLazada = async(keyword) => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    page.setDefaultNavigationTimeout(0);

    //open new tab and go to lazada website
    await page.goto("https://www.lazada.vn/");

    const searchBtn =
        "#topActionHeader > div > div.lzd-logo-bar > div > div.lzd-nav-search > form > div > div.search-box__search--2fC5 > button";

    let data;

    await page.waitForSelector("#q");

    //type keyword and click search
    await page.type("#q", keyword);
    await page.click(searchBtn);

    await page.waitForNavigation();

    //try to get data from api
    //use evaluate to prevent banning by lazada
    //code in evaluate is like code in console of browser
    try {
        data = await page.evaluate(async() => {
            let pageUrl = [];

            const listPage = document.querySelectorAll("#root div.b7FXJ a");
            if (!listPage.length) return pageUrl;

            //Get 3 page api
            pageUrl.push(listPage[0].href + "&page=1" + `&ajax=true`);
            pageUrl.push(listPage[1].href + `&ajax=true`);
            pageUrl.push(listPage[2].href + `&ajax=true`);

            //fetch data from api link
            const data = await Promise.all([
                fetch(pageUrl[0])
                .then((res) => res.json())
                .then((data) => data.mods.listItems),
                fetch(pageUrl[1])
                .then((res) => res.json())
                .then((data) => data.mods.listItems),
                fetch(pageUrl[2])
                .then((res) => res.json())
                .then((data) => data.mods.listItems),
            ]);

            return data;
        });
    } catch (err) {
        console.log(err.message);
    }

    await browser.close();

    try {
        data = [...data[0], ...data[1], ...data[2].splice(0, 20)];
    } catch (err) {
        console.log(data[0]);
        return [];
    }

    return data;
};

module.exports = { getDataFromLazada };