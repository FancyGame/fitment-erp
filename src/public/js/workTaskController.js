/**
 * Created by Ken on 2014-4-18.
 */

app.controller("workTaskController", ['$rootScope','$scope','Ajax','$location','cfpLoadingBar','$q',function($rootScope,$scope,Ajax ,$location,cfpLoadingBar,$q) {
    $scope.text = "工作任务";
    $scope.tasks = [];

    cfpLoadingBar.start();
    cfpLoadingBar.inc();

    Ajax.get('/work_task/my').then(function(data){
        $scope.tasks = data;
        cfpLoadingBar.complete();
    });

    //move page-content a little bit down in case of tabs cover part of it
    OnViewLoad();
}] );

