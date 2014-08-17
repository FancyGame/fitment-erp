/**
 * Created by Ken on 2014-8-17.
 */

app.controller('paginationController', ['$rootScope','$scope','Ajax','$location','cfpLoadingBar','$q','$routeParams',function($rootScope,$scope,Ajax ,$location,cfpLoadingBar,$q,$routeParams) {

    $scope.$watch('currentPage',function(to,from){
        //view -> ng-include -> controller
        $scope.$parent.$parent.currentPage = to;
    });
    $scope.$watch('pageCount',function(to,from){
        //view -> ng-include -> controller
        $scope.$parent.$parent.pageCount = to;
    });
    //move page-content a little bit down in case of tabs cover part of it
    OnViewLoad();
}] );

