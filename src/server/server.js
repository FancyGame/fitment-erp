/**
 * Created by md on 14-6-2.
 */
var express = require('express');
var app = express();
var router = express.Router();
var path = require('path');
var requestDispatcher = require('./requestDispatcher');

requestDispatcher.setRouter(router);
requestDispatcher.pushForbiddenPath('/ken');
requestDispatcher.pushForbiddenPath('/gao');

// static should be put in front of use
app.use(express.static(path.join(__dirname, '../public')));
app.use(router);

var port = 3000;
app.listen(port);
console.log('Fitment is runing on %d ...',port);