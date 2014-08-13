/**
 * Created by Ken on 2014-4-15.
 */

app.controller("indexController", ['$rootScope','$scope','Ajax','$browser','$q','cfpLoadingBar',
    function($rootScope,$scope,Ajax,$browser,$q,cfpLoadingBar) {

    LoadingBarBegin(cfpLoadingBar);

    Ajax.get("/user/getCurUser").then(function(user){
        $rootScope.curUser = user;
        cfpLoadingBar.set(0.5);
        Ajax.get("/company/"+$rootScope.curUser.cid).then(function(company){
            $rootScope.curCompany = company;
            LoadingBarEnd(cfpLoadingBar);
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
                {url:"#/client_add_update",name:"新建客户",active:false},
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
