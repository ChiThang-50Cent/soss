const express = require("express");
const puppeteer = require("puppeteer");

const SOSS = require("./scraper.js");

const route = express.Router();

route.get("/", async(req, res) => {
    const browser = await puppeteer.launch({
        args: ["--no-sandbox"],
    });

    const page = await browser.newPage();
    await page.goto("https://www.lazada.vn/", {
        waitUntil: "networkidle2",
    });

    const data = await page.evaluate(async() => {
        const res = await fetch(
            "/catalog/?_keyori=ss&from=input&q=quat&ajax=true&page=1"
        );
        const data = res.json();

        return data;
    });

    res.json({ data: data.mods.listItems });
});

route.get("/search", async(req, res) => {
    const { keyword } = req.query;

    if (!keyword) return res.status(400).json({ status: "Not have keyword" });

    const shopeeData = await SOSS.shopee(keyword);

    const lazadaData = await SOSS.lazada(keyword);

    res.json({ shopeeData, lazadaData });
});

module.exports = route;