/**
 * Created by md on 14-6-3.
 */


var userBiz = require('./biz/userBiz');
var forbiddenPath = [];

function setRouter(router) {
// simple logger for this router's requests
// all requests to this router will first hit this middleware
    router.use(function(req, res, next) {
        console.log('router.use %s %s %s', req.method, req.url, req.path);
        if(hasAuthorization(req,res)) {
            if (!isForbidden(req, res))
                next();
        }
    });
    console.log(Object.prototype.toString.call(userBiz.getUserList));
    router.use('/getUserList', userBiz.getUserList);

// handle 404
    router.use(function(req, res, next) {
        res.send('404 page not found, url='+req.url);
    });
}
function isForbidden(req,res) {
    for(var i in forbiddenPath) {
        if(req.path==forbiddenPath[i]) {
            res.send("<h1>"+req.path+" is forbidden</h1>");
            return true;
        }
    }
    return false;
}
function hasAuthorization(req,res) {
    //test
    if(req.path=='/admin') {
        res.send('no authorization');
        return false;
    }
    return true;
}
function setForbiddenPath(pathArray) {
    forbiddenPath = pathArray;
}
function pushForbiddenPath(path) {
    forbiddenPath.push(path);
}

exports.setRouter = setRouter;
exports.setForbiddenPath = setForbiddenPath;
exports.pushForbiddenPath = pushForbiddenPath;
