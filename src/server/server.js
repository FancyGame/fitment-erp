/**
 * Created by md on 14-6-2.
 */
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var app = express();
var router = express.Router();
var path = require('path');
var requestDispatcher = require('./requestDispatcher');

app.use(bodyParser());
app.use(cookieParser());//must before session
app.use(session({
    secret: 'keyboard cat',
    cookie: {maxAge:60*60*1000},
    proxy: true
}));
requestDispatcher.setRouter(router);

// static should be put in front of use
app.use(express.static(path.join(__dirname, '../public')));
app.use(router);

var port = 3000;
app.listen(port);
console.log('Fitment is runing on %d ...',port);