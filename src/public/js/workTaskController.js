/**
 * Created by Ken on 2014-4-18.
 */

define(function (require, exports, modules) {
    exports.ctrl = function ($rootScope, $scope, Ajax, $location, cfpLoadingBar, $q) {
        $scope.text = "工作任务";
        $scope.tasks = [];

        LoadingBarBegin(cfpLoadingBar);

        Ajax.get('/work_task/my').then(function (data) {
            $scope.tasks = data;
            LoadingBarEnd(cfpLoadingBar);
        });

        //move page-content a little bit down in case of tabs cover part of it
        OnViewLoad();
    };
});

