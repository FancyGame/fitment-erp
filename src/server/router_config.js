/**
 * Created by md on 14-6-4.
 */


var userBiz = require('./biz/userBiz');

exports.routePaths = {
    get:[
        {path:'/getUserList',function:userBiz.getUserList},
        {path:'/session',function:userBiz.session}
    ],
    post:[
        {path:'/user/login',function:userBiz.login}
    ],
    delete:[],
    put:[]
};

exports.forbiddenPaths = [
    '/ken',
    '/gao'
];

