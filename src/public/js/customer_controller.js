/**
 * Created by Ken on 2014-4-18.
 */

app.controller("customerController", ['$rootScope','$scope','$routeParams','$mp_ajax','$location','$mp_json','$cookieStore',function($rootScope,$scope,$routeParams,$mp_ajax,$location,$mp_json,$cookieStore) {

    console.log("customer_controller.js");

    $mp_ajax.get('/biz/'+$rootScope.bizId+'/cust',function(data){
        $scope.customers = data;
    });

    //move page-content a little bit down in case of tabs cover part of it
    OnViewLoad();
}] );

