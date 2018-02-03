var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('passport');
var authenticate = require('./authenticate');
var config = require('./config');

var index = require('./routes/index');
var users = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var mainProdRouter = require('./routes/mainProdRouter');
var leaderRouter = require('./routes/leaderRouter ');
var promoRouter = require('./routes/promoRouter');
var favoriteRouter = require('./routes/favoriteRouter');

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const uploadRouter = require('./routes/uploadRouter');
const Dishes = require('./models/dishes');
// const = require('./models/dishes');

const url = config.mongoUrl;

var app = express();

// Secure traffic only
app.all('*', (req, res, next) => {
    if (req.secure) {
        return next();
    } else {
        res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
    }
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());
app.use(passport.session());

// app.use(cookieParser('12345-67890-09876-54321'));



app.use('/', index);
app.use('/users', users);



app.use(express.static(path.join(__dirname, 'public')));

// Connection URL
// const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);

connect.then((db) => {
    console.log("Connected correctly to server");
}, (err) => { console.log(err); });

app.use('/dishes', dishRouter);
app.use('/mainProds', mainProdRouter);
app.use('/leaders', leaderRouter);
app.use('/promotions', promoRouter);
app.use('/favorites', favoriteRouter);
app.use('/imageUpload', uploadRouter);

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