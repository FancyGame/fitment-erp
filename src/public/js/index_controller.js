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

function OnViewLoad() {
    SetPositionOfPageContent();
    //处理菜单事件
//    ace.handle_side_menu(jQuery);
    preInit();
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
    })
    //set related tab to active when refresh page with routing information
//    var routePath = window.location.hash;
//    if(routePath.length>0) {
//        $(".nav-list .active").removeClass('active');
//        $(".nav-list>li>a").each(function(){
//            if(routePath.indexOf($(this).attr("href"))==0) {
//                $(this).parent().addClass('active');
//            }
//        });
//    }

}

function preInit(){
//    $('[data-rel=tooltip]').tooltip({container:'body'});
//    $('[data-rel=popover]').popover({container:'body'});
//    $('.date-picker').datepicker({autoclose:true}).next().on(ace.click_event, function(){
//        $(this).prev().focus();
//    });
}

app.controller("indexController", ['$rootScope','$scope','$mp_ajax','$cookieStore','$browser',function($rootScope,$scope,$mp_ajax,$cookieStore,$browser) {
    var authToken = $cookieStore.get($mp_ajax.AUTH_NAME);
//    if(angular.isUndefined(authToken) || authToken=="") {
//        window.location.href = "login.html";
//    }

    $scope.tabs = [
        {url:"#/mainboard",name:"个人主页",class:"icon-home",active:true,open:false},
        {url:"javascript:;",name:"任务管理",class:"icon-list-alt",active:false,subTabStyle:{display:'none'},open:false,
            subTabs:[
                {url:"#/profile",name:"任务列表",active:false},
                {url:"#/mainboard",name:"def",active:false}
            ]
        },
        {url:"#/profile",name:"客户管理",class:"icon-list-alt",active:false,subTabStyle:{display:'none'},open:false,
            subTabs:[
                {url:"#/profile",name:"任务列表",active:false},
                {url:"#/mainboard",name:"def",active:false}
            ]
        },
        {url:"#",name:"资料管理",class:"icon-list-alt",active:false,open:false},
        {url:"#",name:"材料管理",class:"icon-list-alt",active:false,open:false}
    ];

//    var body = document.getElementsByTagName("body")[0];
//    for(var i=0;i<$scope.tabs.length;i++) {
//        var script=document.createElement("script");
//        script.src = "js\/" + $scope.tabs[i].script;
//        body.appendChild(script);
//    }

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
        $cookieStore.put($mp_ajax.AUTH_NAME,'');
        window.location.href = "login.html";
    };

    $rootScope.bizId = $cookieStore.get('bizId');

//    //Handle tab changing event
//    $(".nav-list>li>a").each(function() {
//        $(this).click(function() {
//            $(".nav-list .active").removeClass('active');
//            $(this).parent().addClass('active');
//        });
//    });
//
//    //set related tab to active when refresh page with routing information
//    var routePath = window.location.hash;
//    if(routePath.length>0) {
//        $(".nav-list .active").removeClass('active');
//        $(".nav-list>li>a").each(function(){
//            if(routePath.indexOf($(this).attr("href"))==0) {
//                $(this).parent().addClass('active');
//            }
//        });
//    }

    $scope.doClick = function () {
        var getBiz = $mp_ajax.get("/biz",function(data){
            console.log("ajax success");
            $scope.users = data;
        },function() {
            alert("ajax error");
        });
    };

    window.onresize = function() {
        SetPositionOfPageContent();
    }

    SetPositionOfPageContent();
}] );
