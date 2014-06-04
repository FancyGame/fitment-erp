var fs = require('fs');

function start(request,response) {
    console.log("Request handler 'start' was called.");
    response.write('start.html');
    response.end();
}

function upload(request,response) {
    console.log("Request handler 'upload' was called.");
    response.write('upload.html');
    response.end();
}

exports.start = start;
exports.upload = upload;