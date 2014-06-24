/**
 * Created by Ken on 2014-4-18.
 */

app.controller("workTaskController", ['$rootScope','$scope','Ajax','$location',function($rootScope,$scope,Ajax ,$location) {
    $scope.text = "工作任务";
    $scope.tasks = [];

    Ajax.get('/work_task/my/list').then(function(data){
        $scope.tasks = data;
    });

    //move page-content a little bit down in case of tabs cover part of it
    OnViewLoad();
}] );

