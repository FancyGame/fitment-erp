/**
 * Created by Ken on 2014-4-18.
 */
define(function(require,exports,modules){
    exports.ctrl = function($rootScope,$scope,Ajax ,$location,cfpLoadingBar,$q) {
        $scope.text = "个人主页";
        console.log($scope.text);

        LoadingBarBegin(cfpLoadingBar);

        Ajax.get('/work_task_count/my').then(function(data){
            $scope.taskCount = data.count;
            LoadingBarEnd(cfpLoadingBar);
        });

        //move page-content a little bit down in case of tabs cover part of it
        OnViewLoad();
    };
});

