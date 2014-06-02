
var express = require('express');
var path = require('path');
var app = express();
var db = require('./server/lib/db.js');

app.use(express.static(path.join(__dirname, 'public')));


app.get('/help', function(req, res){
    db.getCon(function(err,con){
        con.query('select * from test',null,function(error,rows,fields){
            con.release();
            console.log(rows);
        });
    });
    res.send('this is help!');
});

app.listen(3000);
console.log("node-express is running...");
