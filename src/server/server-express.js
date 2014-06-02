
var express = require('express')
var path = require('path')
var app = express();

app.set("view engine","ejs");

app.get('/login', function(req, res){
    //res.send('hello world from csser.com!');
    console.log('login get');
    res.send('get');
    //res.render('login.ejs');
});



app.get('/userlogin',function(req,res){
    console.log('Username = '+req.params[0]);
    console.log('Password = '+req.params.Password);
    console.log('login post');
    res.redirect('test.html');
});

app.use(express.static(path.join(__dirname, 'public')));


//
//app.get('/help', function(req, res){
//    res.send('this is help!');
//});

app.listen(3000);
console.log("node-express is running...");