const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const passport = require("passport");

const indexRouter = require("./routes/index");
const loginRouter = require("./routes/login");
const logoutRouter = require("./routes/logout");
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

// Set Formidable Configs
const Formidable = require("express-formidable");

app.use(
  Formidable({
    uploadDir: "/", //mudar para a pasta do computador de vocês
    multiples: true // req.files to be arrays of files
  })
);

app.post("/", (req, res, next) => {
  const files = req.files; // contains files
  const fileName = files.upload.name;
  res.render("uploadSucess", {
    title: "O arquivo " + fileName + " está nas núvens :)"
  });
});

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
