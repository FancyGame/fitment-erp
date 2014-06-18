/**
 * Created by md on 14-6-4.
 */


var userBiz = require('./biz/userBiz');
var companyBiz = require('./biz/companyBiz');
var workTaskBiz = require('./biz/workTaskBiz');

exports.routePaths = {
    get:[
        {path:'/user/getUserList',function:userBiz.getUserList},
        {path:'/user/getCurUser',function:userBiz.getCurUserFE},
        {path:'/company/getCompany/:id',function:companyBiz.getCompanyFE},
        {path:'/work_task/getMyWorkTaskList',function:workTaskBiz.getMyWorkTaskListFE},
        {path:'/work_task/getMyWorkTaskCount',function:workTaskBiz.getMyWorkTaskCountFE},
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

