/**
 * Created by Ken on 2014-6-26.
 */

app.controller("clientAddUpdateController", ['$rootScope','$scope','Ajax','$location','cfpLoadingBar','$q',function($rootScope,$scope,Ajax ,$location,cfpLoadingBar,$q) {
    $scope.clients = [];
    $scope.client = {};

    cfpLoadingBar.start();
    cfpLoadingBar.set(0);
    cfpLoadingBar.inc();

    $q.all([
        Ajax.get('/client/my'),
        Ajax.get('/client_status')
    ]).then(function(dataArr) {
        $scope.clients = dataArr[0];
        $scope.client_statusList = dataArr[1];
        $scope.client.status = $scope.client_statusList[0].id;
        cfpLoadingBar.complete();
    });

    $scope.onSubmit = function(isFormValid) {
        if(!isFormValid) {
            alert("表单数据不正确,请检查后重新提交");
            return false;
        }

        cfpLoadingBar.start();
        cfpLoadingBar.set(0);
        cfpLoadingBar.inc();

        var client = $scope.client;
        client.cid = $rootScope.curUser.cid;
        client.oid = $rootScope.curUser.id;
        Ajax.post('/client',$scope.client).then(function(data){
            alert("创建成功");
            cfpLoadingBar.complete();
        },function(error){
            alert("创建失败");
            cfpLoadingBar.complete();
        });
    };
    //move page-content a little bit down in case of tabs cover part of it
    OnViewLoad();
}] );

