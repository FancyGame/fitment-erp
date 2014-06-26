/**
 * Created by Ken on 2014-6-26.
 */

app.controller("clientAddUpdateController", ['$rootScope','$scope','Ajax','$location',function($rootScope,$scope,Ajax ,$location) {
    $scope.clients = [];
    $scope.client = {};

    Ajax.get('/client/my/list').then(function(data){
        $scope.clients = data;
    });
    Ajax.get('/client_status/list').then(function(data){
        $scope.client_statusList = data;
        $scope.client.status = data[0].id;
    });
    $scope.onSubmit = function() {
        var client = $scope.client;
        client.cid = $rootScope.curUser.cid;
        client.oid = $rootScope.curUser.id;
        Ajax.post('/client/add',$scope.client).then(function(data){
            console.log('add client ret ',data);
        });
    }
    //move page-content a little bit down in case of tabs cover part of it
    OnViewLoad();
}] );

