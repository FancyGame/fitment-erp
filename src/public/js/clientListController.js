/**
 * Created by Ken on 2014-6-24.
 */

app.controller("clientListController", ['$rootScope','$scope','Ajax','$location','cfpLoadingBar','$q',function($rootScope,$scope,Ajax ,$location,cfpLoadingBar,$q) {
    $scope.clients = [];

    cfpLoadingBar.start();
    cfpLoadingBar.set(0);
    cfpLoadingBar.inc();

    Ajax.get('/client/my').then(function(data){
        $scope.clients = data;
        cfpLoadingBar.complete();
    });

    //move page-content a little bit down in case of tabs cover part of it
    OnViewLoad();
}] );

