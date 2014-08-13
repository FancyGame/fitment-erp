/**
 * Created by Ken on 2014-4-18.
 */

app.controller("mainboardController", ['$rootScope','$scope','Ajax','$location','cfpLoadingBar','$q',function($rootScope,$scope,Ajax ,$location,cfpLoadingBar,$q) {
    $scope.text = "个人主页";

    cfpLoadingBar.start();
    cfpLoadingBar.set(0);
    cfpLoadingBar.inc();

    Ajax.get('/work_task_count/my').then(function(data){
        $scope.taskCount = data.count;
        cfpLoadingBar.complete();
    });

    //move page-content a little bit down in case of tabs cover part of it
    OnViewLoad();
}] );

