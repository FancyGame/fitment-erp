/**
 * Created by md on 14-6-4.
 */


var userBiz = require('./biz/userBiz');

var routePaths = [
    {path:'/getUserList',function:userBiz.getUserList}
];
var forbiddenPaths = [
    '/ken',
    '/gao'
];

exports.routePaths = routePaths;
exports.forbiddenPaths = forbiddenPaths;
