/**
 * Created by Ken on 2014-4-18.
 */

define(function (require, exports, modules) {
    exports.ctrl = function ($rootScope, $scope, Ajax, $location, cfpLoadingBar, $q) {
        $scope.text = "工程列表";

        LoadingBarBegin(cfpLoadingBar);

        $q.all([
            Ajax.get('/project_count/my'),
            Ajax.get('/project/my')
        ]).then(function (dataArr) {
            $scope.projectCount = dataArr[0].count;
            $scope.projects = dataArr[1];
            LoadingBarEnd(cfpLoadingBar);
        });

        //move page-content a little bit down in case of tabs cover part of it
        OnViewLoad();
    };
});

