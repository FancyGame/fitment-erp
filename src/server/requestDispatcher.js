/**
 * Created by md on 14-6-3.
 */

var config = require('./router_config');
var forbiddenPaths = config.forbiddenPaths;

function setRouter(router) {
    // before all
    router.use(function(req, res, next) {
        console.log('router.use %s %s %s', req.method, req.url, req.path);
        if(hasAuthorization(req,res)) {
            if (!isForbidden(req, res))
                next();
        }
    });

    //bind router
    for(var key in config.routePaths) {
        for(var i in config.routePaths[key]) {
            var item = config.routePaths[key][i];
            router[key](item.path, item.function);
        }
    }

    // after all : handle 404
    router.use(function(req, res, next) {
        res.status(404);
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
    if(!req.session.userId && req.path!='/user/login') {
//        res.writeHead(302,{
//            Location:'/login.html'
//        });
//        res.end();
        res.status(500);
        res.end('NoAuthorization');
        return false;
    }
    //test
//    if(req.path=='/admin') {
//        res.send('no authorization');
//        return false;
//    }
    return true;
}

exports.setRouter = setRouter;

