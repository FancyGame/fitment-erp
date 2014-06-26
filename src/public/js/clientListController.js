/**
 * Created by Ken on 2014-6-24.
 */

app.controller("clientListController", ['$rootScope','$scope','Ajax','$location',function($rootScope,$scope,Ajax ,$location) {
    $scope.clients = [];

    Ajax.get('/client/my/list').then(function(data){
        $scope.clients = data;
    });

    //move page-content a little bit down in case of tabs cover part of it
    OnViewLoad();
}] );

