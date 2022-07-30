const express = require("express");

const SOSS = require("./scraper.js");

const route = express.Router();

route.get("/", (req, res) => {
    res.json({ test: "Test" });
});

route.get("/search", async(req, res) => {
    const { keyword } = req.query;

    if (!keyword) return res.status(400).json({ status: "Not have keyword" });

    const shopeeData = await SOSS.shopee(keyword);

    const lazadaData = await SOSS.lazada(keyword);

    res.json({ shopeeData, lazadaData });
});

module.exports = route;