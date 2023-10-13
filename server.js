const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const cors = require('cors');
const { exec } = require('child_process'); 

const app = express();


var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var courseRouter= require("./routes/course")
var assigRouter = require("./routes/assig")
var submitRouter = require("./routes/submit")

const dburl = 'mongodb+srv://ProGrade123:ProGrade123@fyp.fni3swa.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(dburl)
console.log("connected")

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/course", courseRouter);
app.use("/assignment", assigRouter);
app.use("/submit", submitRouter);

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


const directoriesToRunCommand = [
                                  './controllers/TestCase Controllers/Java',
                                  './controllers/TestCase Controllers/Python',
                                  './controllers/TestCase Controllers/C',
                                  './controllers/TestCase Controllers/Cpp'
                                ]; 
directoriesToRunCommand.forEach((directory) => {
  exec('docker-compose up', { cwd: directory }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout for directory ${directory}: ${stdout}`);
  });
});

module.exports = app;
