/**
 * Created by Ken on 2014-4-15.
 */

app.controller("indexController", ['$rootScope','$scope','Ajax','$browser','$q','cfpLoadingBar','$timeout',
function($rootScope,$scope,Ajax,$browser,$q,cfpLoadingBar,$timeout) {

    LoadingBarBegin(cfpLoadingBar);

    Ajax.get("/user/getCurUser").then(function(user){
        $rootScope.curUser = user;
        cfpLoadingBar.set(0.5);
        $q.all([
            Ajax.get("/company/"+$rootScope.curUser.cid),
            Ajax.get("/navigator/my?gid="+$rootScope.curUser.gid)
        ]).then(function(dataArr) {
            $rootScope.curCompany = dataArr[0];

            $rootScope.tabs = dataArr[1];
            $scope.curTab = $scope.tabs[0];  //default value is first tab
            $scope.curTab.active = true;
            $scope.curParentTab = {};

            LoadingBarEnd(cfpLoadingBar);
        });
    });

    $scope.msgs = [];
    function LoadMsg() {
        Ajax.get("/msg/my?is_read=true").then(function(rows){
//            $scope.msgs = rows;
            //rows是从新到旧, 所以倒序循环
            for(var i=rows.length-1;i>-1;i--) {
                var msg = rows[i];
                var j = 0;
                for(; j<$scope.msgs.length; j++) {
                    if(msg.id==$scope.msgs[j].id) {
                        break;
                    }
                }
                //not found, new message
                if(j==$scope.msgs.length) {
                    msg.date_time = DateUtil.format(msg.createon,'yyyy-MM-dd HH:mm:ss');
                    $scope.msgs.unshift(msg);
                }
            }
//            console.log(rows);
        });

        $timeout(LoadMsg,3000);
    }

    $timeout(LoadMsg,3000);

    $scope.onSetMessageAsRead = function(index) {
        Ajax.put('/msg/setAsRead/'+$scope.msgs[index].id).then(function(data) {
            console.log('setAsRead',data);
            $scope.msgs.splice(index,1);
            //close it if no msgs.
            if($scope.msgs.length<1) {
                angular.element('#k_msg_box').css('display','none');
            }
        },function(){
            ErrorBox('Update message Error');
        });
    };

    $scope.showMsgBox = function() {
        console.log('show box');;
    };
    $scope.hideMsgBox = function() {
        console.log('hide box');;
    };
//    $scope.k_msg_box.show = false;
//    $scope.msgClick = function() {
////        $scope.k_msg_box.show = $scope.k_msg_box.show ? false : true;
//        if($scope.k_msg_box.show) {
//            $scope.k_msg_box.show = false;
//            console.log('menu close');
//        }
//        else {
//            $scope.k_msg_box.show = true;
//            console.log('menu open');
//        }
//    };
//    $scope.$on('$destroy',function(event){
//        $timeout.cancel(timerMsgChecker);
//    });

        /*
    $scope.tabs = [
        {url:"#/mainboard",name:"个人主页",class:"icon-home",active:true,open:false},
        {url:"#/work_task",name:"任务管理",class:"icon-tasks",active:false,subTabStyle:{display:'none'},open:false
//            ,
//            subTabs:[
//                {url:"#/work_task",name:"任务列表",active:false},
//                {url:"#/mainboard",name:"def",active:false}
//            ]
        },
        {url:"#/project_list",name:"工程管理",class:"icon-building",active:false,subTabStyle:{display:'none'},open:false
//            ,
//            subTabs:[
//                {url:"#/project_list",name:"工程列表",active:false},
//                {url:"#/mainboard",name:"def",active:false}
//            ]
        },
        {url:"#/client_list",name:"客户管理",class:"icon-group",active:false,subTabStyle:{display:'none'},open:false
//            ,
//            subTabs:[
//                {url:"#/client_list",name:"客户列表",active:false},
//                {url:"#/client_add",name:"新建客户",active:false},
//                {url:"#/mainboard",name:"def",active:false}
//            ]
        },
        {url:"#",name:"资料管理",class:"icon-file-alt",active:false,open:false},
        {url:"#",name:"材料管理",class:"icon-inbox",active:false,open:false}
    ];
    */



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
