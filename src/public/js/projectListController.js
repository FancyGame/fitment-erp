/**
 * Created by Ken on 2014-4-18.
 */

app.controller("projectListController", ['$rootScope','$scope','$mp_ajax','$location',function($rootScope,$scope,$mp_ajax ,$location) {
    $scope.text = "个人主页";

    $mp_ajax.get('/work_task/getMyWorkTaskCount',function(data){
        $scope.taskCount = data.count;
    });

    //move page-content a little bit down in case of tabs cover part of it
    OnViewLoad();
}] );

