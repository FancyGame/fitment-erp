/**
 * Created by md on 14-8-10.
 */

define(function(require){

    app.config(function($httpProvider) {
        $httpProvider.defaults.headers.common['Cache-Control'] = 'no-cache';
    });

    var sa = require('sea_angular');

    app.config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider) {
        var routerArr = [
            {
                url:'/mainboard',
                templateUrl: './view/_mainboard.html',
                controller: sa.autoload('mainboardController')
            },
            {
                url:'/profile',
                templateUrl: './view/_profile.html',
                controller: sa.autoload('profileController')
            },
            {
                url:'/work_task',
                templateUrl: './view/_work_task.html',
                controller: sa.autoload('workTaskController')
            },
            {
                url:'/client_list',
                templateUrl: './view/_client_list.html',
                controller: sa.autoload('clientListController')
            },
            {
                url:'/client_list/page/:page',
                templateUrl: './view/_client_list.html',
                controller: sa.autoload('clientListController')
            },
            {
                url:'/client_add',
                templateUrl: './view/_client_add_update.html',
                controller: sa.autoload('clientAddUpdateController')
            },
            {
                url:'/client_update/:clientId',
                templateUrl: './view/_client_add_update.html',
                controller: sa.autoload('clientAddUpdateController')
            },
            {
                url:'/project_list',
                templateUrl: './view/_project_list.html',
                controller: sa.autoload('projectListController')
            },

        ];
        for(var i in routerArr) {
            var router = routerArr[i];
            $routeProvider.when(router.url,router);
        }
        $routeProvider
            .when('/', {
                redirectTo:'/mainboard'
            })
            .otherwise({
                templateUrl: './view/_mainboard.html',
                controller: sa.autoload('mainboardController')
            });
        //$locationProvider.html5Mode(true);
    }]);
});
