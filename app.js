const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");

const indexRouter = require("./routes/index");
const app = express();

app.set("trust proxy", 1);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Session settings
app.use(
    session({
        secret: "jIPEyvTVBGPu7vfA",
        resave: true,
        rolling: true,
        saveUninitialized: false,
        cookie: {
            //secure: true,
            maxAge: 1000 * 60 * 60, //session expires in 60 minutes
        },
    })
);

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

app.use("/", indexRouter);

module.exports = app;