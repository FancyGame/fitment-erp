/**
 * Created by Ken on 2014-6-24.
 */

app.controller("clientListController", ['$rootScope','$scope','Ajax','$location','cfpLoadingBar','$q','$routeParams',function($rootScope,$scope,Ajax ,$location,cfpLoadingBar,$q,$routeParams) {
    $scope.clients = [];

    LoadingBarBegin(cfpLoadingBar);

    $scope.pageCount = 5;
    $scope.keyword = '';
    $scope.currentPage = $routeParams.page ? $routeParams.page : 1;
    Ajax.get('/client_count/my').then(function(data){
        $scope.totalItemCount = data ? data.count : 0;
        LoadingBarEnd(cfpLoadingBar);
    });

    function LoadClient() {
        var urlCount = '/client_count/my';
        var url = '/client/my?pageNo='+$scope.currentPage+'&pageCount='+$scope.pageCount;
        if($scope.keyword.length>0) {
            urlCount += '?keyword='+$scope.keyword;
            url += '&keyword='+$scope.keyword;
        }

        Ajax.get(urlCount).then(function(data){
            $scope.totalItemCount = data ? data.count : 0;
            LoadingBarEnd(cfpLoadingBar);
        });

        Ajax.get(url).then(function(data){
            $scope.clients = data;
            LoadingBarEnd(cfpLoadingBar);
        });
    }

    $scope.$watch('currentPage',function(to,from){
        LoadingBarBegin(cfpLoadingBar);
        LoadClient();
    });

    $scope.onSearch = function() {
        LoadClient();
    };

    $scope.menuOptions = [
        [
            {class:'icon-edit green',css:{}},
            '编辑',
            function ($itemScope) {
                console.log($itemScope.client.name);
            }
        ],
        [
            {class:'icon-trash red',css:{}},
            '删除',
            function ($itemScope) {
                console.log('sell');
            }
        ]
    ];

    //move page-content a little bit down in case of tabs cover part of it
    OnViewLoad();
}] );

