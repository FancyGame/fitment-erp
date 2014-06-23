/**
 * Created by Ken on 2014-4-18.
 */

app.controller("workTaskController", ['$rootScope','$scope','Ajax','$location',function($rootScope,$scope,Ajax ,$location) {
    $scope.text = "工作任务";
    $scope.tasks = [];

    Ajax.get('/work_task/getMyWorkTaskList',function(data){
        $scope.tasks = data;
    });
    $scope.format = function(date,mask) {
        var ret = "";
        try {
            ret = DateUtil.format(date,mask);
        }catch(e){}
        return ret;
    };

    //move page-content a little bit down in case of tabs cover part of it
    OnViewLoad();
}] );

