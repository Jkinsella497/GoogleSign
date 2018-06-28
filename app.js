var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var createError = require('http-errors');
var express = require('express');
var googleapis = require('googleapis');
var http = require('http');
var logger = require('morgan');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var routes = require('./routes');
var session = require('express-session');


var app = express();

app.use(session({ secret: 'shhsecret' }));
app.use(passport.initialize());
app.use(passport.session());


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var configDB = require('./config/database.js');
mongoose.connect(configDB.url);

require('./config/passport')(passport);
// Routes
app.use(routes);


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
  res.render('error');
});

http.createServer( app ).listen( 3000, function (){
  console.log( 'Magic is happening on port ' + 3000);
});

module.exports = app;
