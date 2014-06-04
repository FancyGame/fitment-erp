//var http = require('http');
//
//http.createServer(function (req, res) {
//  //console.log(req.param("ken"));
//  res.writeHead(200, {'Content-Type': 'text/plain'});
//  res.end("[{name: 'Web Development',price: 300,active:true},{name: 'Design',price: 400,active:false,{name: 'Integration',price: 250,active:false},{name: 'Training',price: 220,active:false}]");
//}).listen(1337, "127.0.0.1");
//
//console.log('Server running at http://127.0.0.1:1337/');

var http = require("http");
var url = require("url")
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var db = require('./util/db.js');

var app = express();

function start(route,handle) {
    function onRequest(request, response) {
        console.log("Request received.");
        var pathname = url.parse(request.url).pathname;
        if(pathname && pathname.indexOf('/')==0) {
            pathname = pathname.substring(1);
        }
        console.log("Request for " + pathname + " received.");
        route(handle,pathname,request,response);
    }
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(app.router);
    http.createServer(onRequest).listen(1337);
    console.log("Server has started.");
}


exports.start = start;

module.exports = {
    start: start
};
