const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const syncModels = require("./common/syncModels");
const indexRouter = require("./routes/index");
const userRouter = require("./routes/user");
const clientRouter = require("./routes/client");
const app = express();

app.set("trust proxy", 1);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Allow crossed domain requests
app.all("*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    if (req.method === "OPTIONS") {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Sync Models
syncModels();

// Define Routers
app.use("/", indexRouter);
app.use("/api/user", userRouter);
app.use("/api/client", clientRouter);

module.exports = app;
