/**
 * Created by Ken on 2014-4-15.
 */

app.config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider) {
    $routeProvider
        .when('/', {
            redirectTo:'/profile'
        })
        .when('/profile', {
            templateUrl: './view/_profile.html',
            controller: 'profileController'
        })
        .otherwise({
            templateUrl: './view/_profile.html',
            controller: 'profileController'
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
    var routePath = window.location.hash;
    if(routePath.length>0) {
        $(".nav-list .active").removeClass('active');
        $(".nav-list>li>a").each(function(){
            if(routePath.indexOf($(this).attr("href"))==0) {
                $(this).parent().addClass('active');
            }
        });
    }

}

function preInit(){
    $('[data-rel=tooltip]').tooltip({container:'body'});
    $('[data-rel=popover]').popover({container:'body'});
    $('.date-picker').datepicker({autoclose:true}).next().on(ace.click_event, function(){
        $(this).prev().focus();
    });

}

app.controller("indexController", ['$rootScope','$scope','$mp_ajax','$cookieStore','$browser',function($rootScope,$scope,$mp_ajax,$cookieStore,$browser) {
    var authToken = $cookieStore.get($mp_ajax.AUTH_NAME);
//    if(angular.isUndefined(authToken) || authToken=="") {
//        window.location.href = "login.html";
//    }
    $scope.tabs = [
        {url:"_menu.html",script:"menu_controller.js",name:"Menu",class:"icon-list-alt",active:true},
        {url:"_profile.html",script:"profile_controller.js",name:"Profile",class:"icon-list-alt",active:false},
        {url:"_customer.html",script:"customer_controller.js",name:"Customers",class:"icon-list-alt",active:false},
        {url:"_promotion.html",script:"promotion_controller.js",name:"Promotions",class:"icon-list-alt",active:false}
    ];

//    var body = document.getElementsByTagName("body")[0];
//    for(var i=0;i<$scope.tabs.length;i++) {
//        var script=document.createElement("script");
//        script.src = "js\/" + $scope.tabs[i].script;
//        body.appendChild(script);
//    }

    $scope.curTab = $scope.tabs[0];  //default value is first tab
    $scope.curTabUrl = $scope.tabs[0].url + "?random=" + Math.random();

    $scope.onTabClick = function(tab) {
        $scope.curTab.active = false;
        tab.active = true;
        $scope.curTab = tab;
        $scope.curTabUrl = tab.url + "?random=" + Math.random();
    };

    $scope.onLogout = function() {
        $cookieStore.put($mp_ajax.AUTH_NAME,'');
        window.location.href = "login.html";
    };

    $rootScope.bizId = $cookieStore.get('bizId');

    //Handle tab changing event
    $(".nav-list>li>a").each(function() {
        $(this).click(function() {
            $(".nav-list .active").removeClass('active');
            $(this).parent().addClass('active');
        });
    });

    //set related tab to active when refresh page with routing information
    var routePath = window.location.hash;
    if(routePath.length>0) {
        $(".nav-list .active").removeClass('active');
        $(".nav-list>li>a").each(function(){
            if(routePath.indexOf($(this).attr("href"))==0) {
                $(this).parent().addClass('active');
            }
        });
    }

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
