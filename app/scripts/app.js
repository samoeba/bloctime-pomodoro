var blocTime = angular.module("blocTime", ["firebase", "ui.router", "directives", "filters", "services"]);

blocTime.config(function($stateProvider, $locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
    $stateProvider
        .state('landing', {
            url: '/',
            templateUrl: '/templates/login.html',
            controller: 'LoginCtrl'
        })
        .state('pomodoro', {
            url: '/pomodoro',
            templateUrl: '/templates/pomodoro.html',
            controller: 'MainCtrl'
        });
});