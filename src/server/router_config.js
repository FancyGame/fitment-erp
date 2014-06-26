/**
 * Created by md on 14-6-4.
 */


var userBiz = require('./biz/userBiz');
var companyBiz = require('./biz/companyBiz');
var workTaskBiz = require('./biz/workTaskBiz');
var clientBiz = require('./biz/clientBiz');
var projectBiz = require('./biz/projectBiz');
var stableTableBiz = require('./biz/stableTableBiz');

exports.routePaths = {
    get:[
        {path:'/user/getUserList',function:userBiz.getUserList},
        {path:'/user/getCurUser',function:userBiz.getCurUserFE},
        {path:'/company/getCompany/:id',function:companyBiz.getCompanyFE},
        {path:'/work_task/my/list',function:workTaskBiz.getMyListFE},
        {path:'/work_task/my/count',function:workTaskBiz.getMyCountFE},
        {path:'/client/my/list',function:clientBiz.getMyListFE},
        {path:'/client/my/count',function:clientBiz.getMyCountFE},
        {path:'/project/my/list',function:projectBiz.getMyListFE},
        {path:'/project/my/count',function:projectBiz.getMyCountFE},
        {path:'/client_status/list',function:stableTableBiz.getClientStatusList},
        {path:'/session',function:userBiz.session}
    ],
    post:[
        {path:'/client/add',function:clientBiz.add},
        {path:'/user/login',function:userBiz.login}
    ],
    delete:[],
    put:[]
};

exports.forbiddenPaths = [
    '/ken',
    '/gao'
];

