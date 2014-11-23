/**
 * Created by Ken on 2014-8-17.
 * Notice:
 *      上层Controller的相关变量的名字一定要对应上
 *      totalItemCount,所有item总数
 *      pageCount,每页显示多少item
 */

//define(function (require, exports, modules) {
//    exports.ctrl = function ($rootScope, $scope, Ajax, $location, cfpLoadingBar, $q, $routeParams) {
//
//        $scope.$watch('currentPage', function (to, from) {
//            //view -> ng-include -> controller
//            $scope.$parent.$parent.currentPage = to;
//        });
//        $scope.$watch('pageCount', function (to, from) {
//            //view -> ng-include -> controller
//            $scope.$parent.$parent.pageCount = to;
//        });
//        $scope.pageNoToGo = '';
//        $scope.onJumpToPage = function () {
//            var pageNo = $scope.pageNoToGo;
//            if (parseInt(pageNo) > 0) {
//                var maxPageNo = ($scope.$parent.$parent.totalItemCount + $scope.$parent.$parent.pageCount - 1) / $scope.$parent.$parent.pageCount;
//                if (maxPageNo >= pageNo)
//                    $scope.currentPage = pageNo;
//            }
//        };
//        OnViewLoad();
//    }
//});

app.controller('paginationController', ['$rootScope','$scope','Ajax','$location','cfpLoadingBar','$q','$routeParams',function($rootScope,$scope,Ajax ,$location,cfpLoadingBar,$q,$routeParams) {

    $scope.$watch('currentPage',function(to,from){
        //view -> ng-include -> controller
        $scope.$parent.$parent.currentPage = to;
    });
    $scope.$watch('pageCount',function(to,from){
        //view -> ng-include -> controller
        $scope.$parent.$parent.pageCount = to;
    });
    $scope.pageNoToGo = '';
    $scope.onJumpToPage = function() {
        var pageNo = $scope.pageNoToGo;
        if(parseInt(pageNo)>0) {
            var maxPageNo = ($scope.$parent.$parent.totalItemCount+$scope.$parent.$parent.pageCount-1)/$scope.$parent.$parent.pageCount;
            if(maxPageNo>=pageNo)
                $scope.currentPage = pageNo;
        }
    };
    OnViewLoad();
}] );
