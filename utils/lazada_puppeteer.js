const puppeteer = require("puppeteer");

//Use puppeteer because we maybe have a soft ban
//from lazada if try to get data from api url

const getDataFromLazada = async(keyword) => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox"],
    });
    const page = await browser.newPage();

    page.setDefaultNavigationTimeout(0);

    //open new tab and go to lazada website
    await page.goto("https://www.lazada.vn/", {
        waitUntil: "networkidle2",
    });

    await page.exposeFunction("getKeyword", (key = keyword) => {
        return key;
    });

    let data;
    //try to get data from api
    //use evaluate to prevent banning by lazada
    //code in evaluate is like code in console of browser
    try {
        data = await page.evaluate(async() => {
            const search = await getKeyword();
            const pageUrl = (page, key = search) =>
                `/catalog/?_keyori=ss&from=input&q=${key}&ajax=true&page=${page}`;

            //fetch data from api link
            const data = await Promise.all([
                fetch(pageUrl(1))
                .then((res) => res.json())
                .then((data) => data.mods.listItems),
                fetch(pageUrl(2))
                .then((res) => res.json())
                .then((data) => data.mods.listItems),
                fetch(pageUrl(3))
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