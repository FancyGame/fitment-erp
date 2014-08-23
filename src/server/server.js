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
var logger = require('./util/logger').logger;
var MongoStore = require('connect-mongo')(session);
var mongo = require('mongodb');

app.use(bodyParser());
app.use(cookieParser());//must before session
app.use(session({
    secret: 'keyboard cat',
    cookie: {maxAge:60*60*1000*24},//24 hours
    store: new MongoStore({
        db:new mongo.Db('fitment-erp',new mongo.Server('127.0.0.1', 27017), {native_parser:true})
    }),
    proxy: true
}));
requestDispatcher.setRouter(router);

// static should be put in front of use
app.use(express.static(path.join(__dirname, '../public')));
app.use(router);

var port = 3000;
app.listen(port);

logger.info('Fitment is runing on %d ...',port);