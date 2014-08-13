/**
 * Created by Ken on 2014-6-26.
 */

app.controller("clientAddUpdateController", ['$rootScope','$scope','Ajax','$location','cfpLoadingBar','$q','$routeParams',function($rootScope,$scope,Ajax ,$location,cfpLoadingBar,$q,$routeParams) {
    $scope.clientId = $routeParams.clientId;

    if(!$scope.clientId) {
        //create client
        $scope.clients = [];
        $scope.client = {};

        LoadingBarBegin(cfpLoadingBar);

        $q.all([
            Ajax.get('/client/my'),
            Ajax.get('/client_status')
        ]).then(function(dataArr) {
            $scope.clients = dataArr[0];
            $scope.client_statusList = dataArr[1];
            $scope.client.status = $scope.client_statusList[0].id;
            LoadingBarEnd(cfpLoadingBar);
        });

        $scope.onSubmit = function(isFormValid) {
            if(!isFormValid) {
                alert("表单数据不正确,请检查后重新提交");
                return false;
            }

            LoadingBarBegin(cfpLoadingBar);

            var client = $scope.client;
            client.cid = $rootScope.curUser.cid;
            client.oid = $rootScope.curUser.id;
            Ajax.post('/client',$scope.client).then(function(data){
                alert("创建成功");
                LoadingBarEnd(cfpLoadingBar);
            },function(error){
                alert("创建失败");
                LoadingBarEnd(cfpLoadingBar);
            });
        };
    }
    else {
        //update client
        Ajax.get('/client/my/'+$scope.clientId).then(function(data){
            ;
        });
    }
    //move page-content a little bit down in case of tabs cover part of it
    OnViewLoad();
}] );

