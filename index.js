const express = require("express");
const API = require("./utils/api");

const app = express();

//set up view
app.use(express.static(__dirname + "/views"));
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.json());

//main web side
app.get("/", (req, res) => {
    res.render("index");
});

//api
app.use("/api", API);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("Listen on port", PORT);
});