/**
 * Created by Ken on 2014-4-18.
 */

app.controller("profileController", ['$rootScope','$scope','$mp_ajax','$location',function($rootScope,$scope,$mp_ajax ,$location) {
    $scope.text = "testText_Profile";

//    $mp_ajax.get('/biz/'+$rootScope.bizId,function(data){
//        console.log(data);
//    });

    //move page-content a little bit down in case of tabs cover part of it
    OnViewLoad();
}] );

