/**
 * Created by md on 14-8-10.
 */

app.config(function($httpProvider) {
    $httpProvider.defaults.headers.common['Cache-Control'] = 'no-cache';
});

app.config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider) {
    var routerArr = [
        {
            url:'/mainboard',
            templateUrl: './view/_mainboard.html',
            controller: 'mainboardController'
        },
        {
            url:'/profile',
            templateUrl: './view/_profile.html',
            controller: 'profileController'
        },
        {
            url:'/work_task',
            templateUrl: './view/_work_task.html',
            controller: 'workTaskController'
        },
        {
            url:'/client_list',
            templateUrl: './view/_client_list.html',
            controller: 'clientListController'
        },
        {
            url:'/client_list/page/:page',
            templateUrl: './view/_client_list.html',
            controller: 'clientListController'
        },
        {
            url:'/client_add',
            templateUrl: './view/_client_add_update.html',
            controller: 'clientAddUpdateController'
        },
        {
            url:'/client_update/:clientId',
            templateUrl: './view/_client_add_update.html',
            controller: 'clientAddUpdateController'
        },
        {
            url:'/project_list',
            templateUrl: './view/_project_list.html',
            controller: 'projectListController'
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
            controller: 'mainboardController'
        });
    //$locationProvider.html5Mode(true);
}]);
