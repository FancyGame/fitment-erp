/**
 * Created by md on 14-6-2.
 */

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var db = require('./util/db.js');

var app = express();

app.use(bodyParser());
app.use(express.static(path.join(__dirname, '../public')));


app.get('/help', function(req, res){
    console.log(req.params);
    db.getCon(function(err,con){
        con.query('select * from test',null,function(error,rows,fields){
            con.release();
            res.send(rows);
        });
    });
});

var port = 3000;
app.listen(port);
console.log("Fitment is running on %d ...",port);

