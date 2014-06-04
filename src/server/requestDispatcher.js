/**
 * Created by md on 14-6-3.
 */

var config = require('./router_config');
var forbiddenPaths = config.forbiddenPaths;

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
//    console.log(Object.prototype.toString.call(userBiz.getUserList));
    for(var i in config.routePaths) {
        router.use(config.routePaths[i].path, config.routePaths[i].function);
    }

// handle 404
    router.use(function(req, res, next) {
        res.send('404 page not found, url='+req.url);
//        res.end();
    });
}
function isForbidden(req,res) {
    for(var i in forbiddenPaths) {
        if(req.path==forbiddenPaths[i]) {
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

exports.setRouter = setRouter;

