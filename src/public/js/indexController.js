/**
 * Created by Ken on 2014-4-15.
 */

app.config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider) {
    $routeProvider
        .when('/', {
            redirectTo:'/mainboard'
        })
        .when('/mainboard', {
            templateUrl: './view/_mainboard.html',
            controller: 'mainboardController'
        })
        .when('/profile', {
            templateUrl: './view/_profile.html',
            controller: 'profileController'
        })
        .when('/work_task', {
            templateUrl: './view/_work_task.html',
            controller: 'workTaskController'
        })
        .when('/client_list', {
            templateUrl: './view/_client_list.html',
            controller: 'clientListController'
        })
        .when('/project_list', {
            templateUrl: './view/_project_list.html',
            controller: 'projectListController'
        })
        .otherwise({
            templateUrl: './view/_mainboard.html',
            controller: 'mainboardController'
        });
    //$locationProvider.html5Mode(true);
}]);


//move page-content a little bit down in case of tabs cover part of it
function SetPositionOfPageContent() {
    if('block' == $("#menu-toggler").css("display")) {
        $("#ngViewDiv").css("paddingTop","50px");
    }
    else {
        $("#ngViewDiv").css("paddingTop","0px");
    }
}

window.onresize = function() {
    SetPositionOfPageContent();
};

function OnViewLoad() {
    SetPositionOfPageContent();
    //处理菜单事件
//    ace.handle_side_menu(jQuery);
    //limitation of input
    $('.input-mask-price').keypress(function(event){
        var key = event.keyCode;
        if(key>=48 && key<=57) //0-9
            return true;
        if(key==46) { //[.] for float
            var val = $(this).val();
            if(val.length>0 && val.indexOf('.')==-1)
                return true;
        }
        return false;
    });
}


function wc(s){
    if(!s) return 0;
    var watchers = (s.$$watchers) ? s.$$watchers.length : 0;
    var child = s.$$childHead;
    while (child) {
        watchers += (child.$$watchers) ? child.$$watchers.length : 0;
//            console.log('next child',watchers);
        watchers += wc(child);
        child = child.$$nextSibling;
    }
//        console.log('watchers',watchers);
    return watchers;
}

app.controller("indexController", ['$rootScope','$scope','Ajax','$browser','$q',
    function($rootScope,$scope,Ajax,$browser,$q) {

    Ajax.get("/user/getCurUser").then(function(user){
        $rootScope.curUser = user;
        Ajax.get("/company/getCompany/"+$rootScope.curUser.cid).then(function(company){
            $rootScope.curCompany = company;
        });
    });

    $scope.tabs = [
        {url:"#/mainboard",name:"个人主页",class:"icon-home",active:true,open:false},
        {url:"javascript:;",name:"任务管理",class:"icon-tasks",active:false,subTabStyle:{display:'none'},open:false,
            subTabs:[
                {url:"#/work_task",name:"任务列表",active:false},
                {url:"#/mainboard",name:"def",active:false}
            ]
        },
        {url:"javascript:;",name:"工程管理",class:"icon-building",active:false,subTabStyle:{display:'none'},open:false,
            subTabs:[
                {url:"#/project_list",name:"工程列表",active:false},
                {url:"#/mainboard",name:"def",active:false}
            ]
        },
        {url:"javascript:;",name:"客户管理",class:"icon-group",active:false,subTabStyle:{display:'none'},open:false,
            subTabs:[
                {url:"#/client_list",name:"客户列表",active:false},
                {url:"#/mainboard",name:"def",active:false}
            ]
        },
        {url:"#",name:"资料管理",class:"icon-file-alt",active:false,open:false},
        {url:"#",name:"材料管理",class:"icon-inbox",active:false,open:false}
    ];

    $scope.curTab = $scope.tabs[0];  //default value is first tab
    $scope.curParentTab = {};

    $scope.onTabClick = function(tab,parentTab) {
        if($scope.curTab==tab)
            return;
        //点击无子菜单的菜单
        if (angular.isUndefined(tab.subTabs)) {
            if (parentTab) {
                if ($scope.curParentTab != parentTab) {
                    $scope.curParentTab.active = false;
                    $scope.curParentTab.open = false;
                }
                parentTab.active = true;
                parentTab.open = true;
                $scope.curParentTab = parentTab;
            }
            else {
                $scope.curParentTab.active = false;
                $scope.curParentTab.open = false;
                $scope.curParentTab = {};
            }

            $scope.curTab.active = false;
            tab.active = true;
            $scope.curTab = tab;
        }
        else {
            tab.subTabStyle.display = tab.subTabStyle.display == 'none' ? 'block' : 'none';
        }
    };
    $scope.onLogout = function() {
        //TODO: 2014-06-23 要发请求到服务器端, 删除session, 再返回到login.html
        window.location.href = "login.html";
    };


    $rootScope.DateFormat = function(date,mask) {
        var ret = "";
        try {
            ret = DateUtil.format(date,mask);
        }catch(e){}
        return ret;
    };

    setTimeout(function(){
        console.log('watchers count = ',wc($scope));
    },2000);

    SetPositionOfPageContent();
}] );
