/**
 * Created by md on 14-8-10.
 */

app.config(function($httpProvider) {
    $httpProvider.defaults.headers.common['Cache-Control'] = 'no-cache';
});

app.config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider) {
    $routeProvider
        .when('/', {
            redirectTo:'/mainboard'
        })
        .when('/mainboard', {
            templateUrl: './view/_mainboard.html',
            controller: 'mainboardController'
        })
        .when('/profile', {
            templateUrl: './view/_profile.html',
            controller: 'profileController'
        })
        .when('/work_task', {
            templateUrl: './view/_work_task.html',
            controller: 'workTaskController'
        })
        .when('/client_list', {
            templateUrl: './view/_client_list.html',
            controller: 'clientListController'
        })
        .when('/client_list/page/:page', {
            templateUrl: './view/_client_list.html',
            controller: 'clientListController'
        })
        .when('/client_add', {
            templateUrl: './view/_client_add_update.html',
            controller: 'clientAddUpdateController'
        })
        .when('/client_update/:clientId', {
            templateUrl: './view/_client_add_update.html',
            controller: 'clientAddUpdateController'
        })
        .when('/project_list', {
            templateUrl: './view/_project_list.html',
            controller: 'projectListController'
        })
        .otherwise({
            templateUrl: './view/_mainboard.html',
            controller: 'mainboardController'
        });
    //$locationProvider.html5Mode(true);
}]);
