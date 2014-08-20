/**
 * Created by md on 14-6-4.
 */


var userBiz = require('./biz/userBiz');
var companyBiz = require('./biz/companyBiz');
var workTaskBiz = require('./biz/workTaskBiz');
var clientBiz = require('./biz/clientBiz');
var projectBiz = require('./biz/projectBiz');
var navigatorBiz = require('./biz/navigatorBiz');
var stableTableBiz = require('./biz/stableTableBiz');

//var bizArray = [userBiz,companyBiz,workTaskBiz,clientBiz,projectBiz,stableTableBiz];
//for(var i in bizArray) {
//    var biz = bizArray[i];
//    for(var key in biz) {
//        if(typeof biz[key] == 'function') {
//            (function(key){
//                biz['_'+key] = function(req,res,next) {
//                    var context = {req:req,res:res,next:next};
//                    biz[key](context);
//                };
//            })(key);
//        }
//    }
//}


exports.routePaths = {
    get:[
        {path:'/navigator/my',          function:navigatorBiz['getMyListFE']},

        {path:'/user/getUserList',          function:userBiz['getUserList']},
        {path:'/user/getCurUser',           function:userBiz['getCurUserFE']},

        {path:'/company/:id',               function:companyBiz['getCompanyFE']},

        {path:'/work_task/my',              function:workTaskBiz['getMyListFE']},
        {path:'/work_task_count/my',        function:workTaskBiz['getMyCountFE']},

        {path:'/client/my/:id',             function:clientBiz['getById']},
        {path:'/client/my',                 function:clientBiz['getMyListFE']},
        {path:'/client_count/my',           function:clientBiz['getMyCountFE']},

        {path:'/project/my',                function:projectBiz['getMyListFE']},
        {path:'/project_count/my',          function:projectBiz['getMyCountFE']},

        {path:'/client_status',             function:stableTableBiz['getClientStatusList']},
        {path:'/session',                   function:userBiz['session']}
    ],
    post:[
        {path:'/client',                    function:clientBiz['add']},
        {path:'/user/login',                function:userBiz['login']}
    ],
    delete:[
        {path:'/client/:id',                function:clientBiz['delete']}
    ],
    put:[
        {path:'/client',                    function:clientBiz['update']}
    ]
};

exports.forbiddenPaths = [
    '/ken',
    '/gao'
];

