const express = require("express");
const puppeteer = require("puppeteer");

const SOSS = require("./scraper.js");

const route = express.Router();

route.get("/", async(req, res) => {
    const browser = await puppeteer.launch({
        args: ["--no-sandbox"],
    });

    const page = await browser.newPage();
    const text = await (await page.goto("https://google.com")).text();

    res.send(text);
});

route.get("/search", async(req, res) => {
    const { keyword } = req.query;

    if (!keyword) return res.status(400).json({ status: "Not have keyword" });

    const shopeeData = await SOSS.shopee(keyword);

    const lazadaData = await SOSS.lazada(keyword);

    res.json({ shopeeData, lazadaData });
});

module.exports = route;