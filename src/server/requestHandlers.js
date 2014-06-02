var fs = require('fs');

function start(request,response) {
    console.log("Request handler 'start' was called.");
    response.writeHead(200, {"Content-Type": "text/html"});
    fs.readFile('./tmp.html',function (err,html){
        if(err) throw err;
        response.write(html);
        //console.log("size="+response.size());
        console.log(html.toString());
        console.log("file loaded");
        response.end()
    });
    //console.log("size="+response.size());
    //response.write("start page");
    //console.log("size="+response.size());
    //request.forward('./src/tmp.html');
    //response.end();
}

function upload(request,response) {
    console.log("Request handler 'upload' was called.");
}

exports.start = start;
exports.upload = upload;