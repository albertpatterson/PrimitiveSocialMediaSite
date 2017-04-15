var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var users = require('./routes/users');
var otherUser = require('./routes/otherUser');
var goHome = require('./routes/goHome.js');
var doSearch = require('./routes/doSearch.js');
var updateFollowingList = require('./routes/updateFollowingList.js');
var postContent = require('./routes/postContent.js');
var signInOrUp = require('./routes/signInOrUp.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: "pidb",
  resave: false,
  saveUninitialized: true
}))

app.get('/', function(req, res, next){
    res.redirect('/signInOrUp');
});
app.use('/users', users);
app.use('/otherUser', otherUser);
app.use('/home', goHome);
app.use('/doSearch', doSearch);
app.use('/updateFollowingList', updateFollowingList);
app.use('/postContent', postContent);
app.use('/signInOrUp', signInOrUp);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

module.exports = app;
