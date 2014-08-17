/**
 * Created by Ken on 2014-6-26.
 */

app.controller("clientAddUpdateController", ['$rootScope','$scope','Ajax','$location','cfpLoadingBar','$q','$routeParams',function($rootScope,$scope,Ajax ,$location,cfpLoadingBar,$q,$routeParams) {
    $scope.clientId = $routeParams.clientId;

    if(!$scope.clientId) {
        //create client
        $scope.page_name = "新建";
        $scope.client = {};

        LoadingBarBegin(cfpLoadingBar);

        $q.all([
            Ajax.get('/client/my'),
            Ajax.get('/client_status')
        ]).then(function(dataArr) {
            $scope.client_statusList = dataArr[1];
            $scope.client.status = $scope.client_statusList[0].id;
            LoadingBarEnd(cfpLoadingBar);
        });

        $scope.onSubmit = function(isFormValid) {
            if(!isFormValid) {
                ErrorBox("表单数据不正确,请检查后重新提交");
                return false;
            }

            LoadingBarBegin(cfpLoadingBar);

            var client = $scope.client;
            client.cid = $rootScope.curUser.cid;
            client.oid = $rootScope.curUser.id;
            Ajax.post('/client',client).then(function(data){
                SuccessBox("创建成功");
                LoadingBarEnd(cfpLoadingBar);
            },function(error){
                ErrorBox("创建失败");
                LoadingBarEnd(cfpLoadingBar);
            });
        };
    }
    else {
        //update client
        $scope.page_name = "更新";
        LoadingBarBegin(cfpLoadingBar);

        $q.all([
            Ajax.get('/client/my/'+$scope.clientId),
            Ajax.get('/client_status')
        ]).then(function(dataArr) {
            $scope.client = dataArr[0];
            $scope.client_statusList = dataArr[1];
            $scope.client.status = $scope.client.status;
            LoadingBarEnd(cfpLoadingBar);
        });

        $scope.onSubmit = function(isFormValid) {
            if(!isFormValid) {
                ErrorBox("表单数据不正确,请检查后重新提交");
                return false;
            }

            LoadingBarBegin(cfpLoadingBar);
            var client = {};
            Object.copyAttrs($scope.client,client,['id','name','address','status','phone','comment']);
            Ajax.put('/client',client).then(function(data){
                LoadingBarEnd(cfpLoadingBar);
                window.history.back();
            },function(error){
                ErrorBox("Update is wrong");
                LoadingBarEnd(cfpLoadingBar);
            });
        };
    }
    //move page-content a little bit down in case of tabs cover part of it
    OnViewLoad();
}] );

