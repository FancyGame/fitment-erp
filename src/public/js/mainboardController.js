/**
 * Created by Ken on 2014-4-18.
 */

app.controller("mainboardController", ['$rootScope','$scope','Ajax','$location','cfpLoadingBar','$q',function($rootScope,$scope,Ajax ,$location,cfpLoadingBar,$q) {
    $scope.text = "个人主页";

    LoadingBarBegin(cfpLoadingBar);

    Ajax.get('/work_task_count/my').then(function(data){
        $scope.taskCount = data.count;
        LoadingBarEnd(cfpLoadingBar);
    });

    //move page-content a little bit down in case of tabs cover part of it
    OnViewLoad();
}] );

