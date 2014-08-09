/**
 * Created by Ken on 2014-4-18.
 */

app.controller("projectListController", ['$rootScope','$scope','Ajax','$location','cfpLoadingBar','$q',function($rootScope,$scope,Ajax ,$location,cfpLoadingBar,$q) {
    $scope.text = "工程列表";

    cfpLoadingBar.start();
    cfpLoadingBar.set(0);
    cfpLoadingBar.inc();

    $q.all([
        Ajax.get('/project/my/count'),
        Ajax.get('/project/my')
    ]).then(function(dataArr) {
        $scope.projectCount = dataArr[0].count;
        $scope.projects = dataArr[1];
        cfpLoadingBar.complete();
    });

    //move page-content a little bit down in case of tabs cover part of it
    OnViewLoad();
}] );

