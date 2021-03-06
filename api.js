var createError = require('http-errors');
const express = require('express')
var indexRouter = require('./routes/index');
var backupRouter = require('./routes/fbbackup.js');
const app = express();
const cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const responseTime = require('response-time')
const port_redis = process.env.PORT || 6379;
const storage = require('node-persist');
var bodyParser = require("body-parser"); 

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs"); 
app.set("views", __dirname + "/views"); 
app.use(bodyParser.urlencoded({ extended: false })); 

// use response-time as a middleware
app.use(responseTime());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


var counter = 0;

const incrementCounter = (req, res, next) => {
  counter ++;
  storage.setItem("counter", counter).then(() => {
        req.api_count = counter;
        next();
    });
}
app.use('/', incrementCounter, indexRouter);
app.use('/', backupRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

const port = 8019
app.listen(port, () => {
// Inits permanent storage and reads the saved counter
storage.init().then(() => storage.getItem("counter")).then((value) => {
    // Checks if value read is valid, otherwise set it to 0
    if (value > 0) {
        counter = value;
    } else {
        counter = 0;
    }
  });
  console.log(`App listening on port ${port}!`);
});