const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const passport = require("passport");
const indexRouter = require("./routes/index");
const loginRouter = require("./routes/login");
const logoutRouter = require("./routes/logout");
var connect = require("connect");

//const uploadRouter = require("./routes/upload");
const app = express();
require("./configs/github.strategy");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// parse urlencoded request bodies into req.body
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
// Set passport configs
app.use(
  require("express-session")({
    secret: "shhhh...",
    resave: true,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRouter);
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);
//app.use("/upload", uploadRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(404).render("uploadError", {
    title: "Vamos tentar de novo?"
  });

  res.status(503).render("uploadError", {
    title: "Serviço Indisponível"
  });

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
