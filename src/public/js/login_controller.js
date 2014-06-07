/**
 * Created by Ken on 2014-4-15.
 */

app.controller("loginController", ['$rootScope','$scope','$mp_ajax','$cookieStore',function($rootScope,$scope ,$mp_ajax, $cookieStore) {

    $scope.user = {};
    $scope.user.username = "gk";
    $scope.user.password = "123456";

    $scope.onLogin = function () {
        var bizLogin = $mp_ajax.post("/user/login",$scope.user,function(json){
            console.log(json);
//            $cookieStore.put($mp_ajax.AUTH_NAME,json['accessToken']);
//            if(!json['bizId']){
//                alert('No business info');
//            }else{
//                $cookieStore.put('bizId',json['bizId']);
//                window.location.href = "index.html#/"+json['bizId'];
//            }

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
