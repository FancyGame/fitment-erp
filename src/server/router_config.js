/**
 * Created by md on 14-6-4.
 */


var userBiz = require('./biz/userBiz');
var companyBiz = require('./biz/companyBiz');

exports.routePaths = {
    get:[
        {path:'/user/getUserList',function:userBiz.getUserList},
        {path:'/user/getCurUser',function:userBiz.getCurUserFE},
        {path:'/company/getCompany/:id',function:companyBiz.getCompanyFE},
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

