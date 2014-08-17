/**
 * Created by Ken on 2014-4-15.
 */

app.controller("loginController", ['$rootScope','$scope','Ajax',function($rootScope,$scope ,Ajax) {

    $scope.user = {};
    $scope.user.username = "ljb";
    $scope.user.password = "123456";
    $scope.onLogin = function () {
        Ajax.post("/user/login",$scope.user).then(function(json){
            console.log(json);
            if(json=='true') {
                window.location.href='/';
            }
        },function(json) {
            if(typeof(json) != 'undefined' && typeof(json.message) != 'undefined')
                ErrorBox("Login failed, msg=" + json.message);
            else
                ErrorBox("Login failed, please try again later.");
        });
    };
    $scope.showBox = function(name) {
        angular.element(".widget-box").css("display","none");
        angular.element("#"+name).css("display","block");
    };
}] );
