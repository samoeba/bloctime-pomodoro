var blocTime = angular.module("blocTime", ["firebase", "ui.router", "directives", "filters"]);

blocTime.config(function($stateProvider, $locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: '../templates/home.html',
            controller: 'MainCtrl'
        });
});