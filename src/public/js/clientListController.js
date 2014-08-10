/**
 * Created by Ken on 2014-6-24.
 */

app.controller("clientListController", ['$rootScope','$scope','Ajax','$location','cfpLoadingBar','$q','$routeParams',function($rootScope,$scope,Ajax ,$location,cfpLoadingBar,$q,$routeParams) {
    $scope.clients = [];

    LoadingBarBegin(cfpLoadingBar);

    $scope.pageCount = 2;
    $scope.currentPage = $routeParams.page ? $routeParams.page : 1;
    Ajax.get('/client/my/count').then(function(data){
        $scope.totalItemCount = data ? data.count : 0;
        LoadingBarEnd(cfpLoadingBar);
    });

    $scope.$watch('currentPage',function(to,from){
        LoadingBarBegin(cfpLoadingBar);
        Ajax.get('/client/my?pageNo='+$scope.currentPage+'&pageCount='+$scope.pageCount).then(function(data){
            $scope.clients = data;
            LoadingBarEnd(cfpLoadingBar);
        });
    });

    //move page-content a little bit down in case of tabs cover part of it
    OnViewLoad();
}] );

