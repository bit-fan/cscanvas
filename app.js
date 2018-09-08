var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());

//set cookie
app.use(function (req, res, next) {
  // check if client sent cookie
  var cookie = req.cookies.userId;
  if (cookie === undefined) {
    // no: set a new cookie
    var randomNumber = Math.random().toString();
    cookie = randomNumber.substring(2, randomNumber.length);
    console.log('cookie created successfully');
  } else {
    // yes, cookie was already present 
    console.log('cookie exists', cookie);
  }
  res.cookie('userId', cookie, {
    maxAge: 24 * 3600 * 1000,
    httpOnly: true
  });
  next(); // <-- important!
});


app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/drawCommand', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;