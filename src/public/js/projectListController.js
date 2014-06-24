/**
 * Created by Ken on 2014-4-18.
 */

app.controller("projectListController", ['$rootScope','$scope','Ajax','$location',function($rootScope,$scope,Ajax ,$location) {
    $scope.text = "工程列表";

    Ajax.get('/project/my/count').then(function(data){
        $scope.projectCount = data.count;
    });
    Ajax.get('/project/my/list').then(function(data){
        $scope.projects = data;
    });

    //move page-content a little bit down in case of tabs cover part of it
    OnViewLoad();
}] );

