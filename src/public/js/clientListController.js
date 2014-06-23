/**
 * Created by Ken on 2014-4-18.
 */

app.controller("clientListController", ['$rootScope','$scope','Ajax','$location',function($rootScope,$scope,Ajax ,$location) {
    $scope.text = "个人主页";

    Ajax.get('/work_task/getMyWorkTaskCount',function(data){
        $scope.taskCount = data.count;
    });

    //move page-content a little bit down in case of tabs cover part of it
    OnViewLoad();
}] );

