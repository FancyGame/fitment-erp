/**
 * Created by Ken on 14-5-22.
 */

var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
var url = require('url');
var bodyParser = require('body-parser');
var multiparty = require('multiparty');

app.use(bodyParser());
app.use(express.static(__dirname + '/public'));

app.get('*',function(req,res){
    res.send("Hello!");
});

app.post('/upload', function(req, res){
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
//        console.log(fields,files);

        var imgData = fields.image[0];
        var dataBuffer = new Buffer(imgData, 'base64');
        fs.writeFile("../../../out.jpg", dataBuffer, function(err) {
            if(err){
                res.send(err);
            }else{
                res.send('upload successful');
            }
        });
    });
});

app.listen(8888);
console.log('Listening on port 8888');