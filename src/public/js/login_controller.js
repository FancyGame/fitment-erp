/**
 * Created by Ken on 2014-4-15.
 */

app.controller("loginController", ['$rootScope','$scope','$mp_ajax','$cookieStore',function($rootScope,$scope ,$mp_ajax, $cookieStore) {

    $scope.user = "bowen.wang@missionpublic.com";
    $scope.password = "mp";

    $scope.onLogin = function () {
        var postData = {};
        postData.user = $scope.user;
        postData.password = $scope.password;
        
        var bizLogin = $mp_ajax.post("/bizUser/do/login",postData,function(json){
            $cookieStore.put($mp_ajax.AUTH_NAME,json['accessToken']);
            if(!json['bizId']){
                alert('No business info');
            }else{
                $cookieStore.put('bizId',json['bizId']);
                window.location.href = "index.html#/"+json['bizId'];
            }

        },function(json) {
            if(typeof(json) != 'undefined' && typeof(json.message) != 'undefined')
                alert("Login failed, msg=" + json.message);
            else
                alert("Login failed, please try again later.");
        });
    };
    $scope.showBox = function(name) {
        angular.element(".widget-box").css("display","none");
        angular.element("#"+name).css("display","block");
    };
}] );
