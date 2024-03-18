var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
const stockRouter = require("./routes/stockPrice");
let cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const MONGO_HOST = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}`;
mongoose.connect(MONGO_HOST, {
  retryWrites: true,
  w: "majority",
});

var app = express();
//
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());

app.use("/", indexRouter);

const kospiCodeRouter = require("./routes/kospiCode");
app.use("/api/kospiCode", kospiCodeRouter);

const kosdaqCodeRouter = require("./routes/kosdaqCode");
app.use("/api/kosdaqCode", kosdaqCodeRouter);

var userRouter = require("./routes/user");
app.use("/api/user", userRouter);
app.use("/api/stock", stockRouter);

const feedRouter = require("./routes/feed");
app.use("/api/feed", feedRouter);

const commentRouter = require("./routes/comment");
app.use("/api/comment", commentRouter);

const stockPriceRouter = require("./routes/stockPrice");
app.use("/api/stockPrice", stockPriceRouter);

const subChartRouter = require("./routes/subChart");
app.use("/api/subChart", subChartRouter);

const friendRouter = require("./routes/friend");
app.use("/api/friend", friendRouter);

const stockCodeRouter = require("./routes/stockCode");
app.use("/api/stockCode", stockCodeRouter);

const shinhanInfokRouter = require("./routes/shinhanInfo");
app.use("/api/shinhanInfo", shinhanInfokRouter);

// 배치 작업 시행
const cron = require('node-cron');
const getMinuteData = require('./service/batchData/batch_DB')

// 매일 5시 10분에 배치 작업을 실행합니다.
cron.schedule('25 13 * * *', () => {
    let result = getMinuteData();
    console.log(result);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
