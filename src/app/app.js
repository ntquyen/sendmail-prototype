angular.module('pushNotification', ['templates-app', 'templates-common', 'pushNotification.mainState', 'ui.router', 'ngRoute', 'appConfig']).config(function myAppConfig($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('mainState');
}).run(function run() {
    console.log('run()');
}).controller('AppCtrl', function AppCtrl($scope, $location, $http, appConfig) {
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        // global variable for App
        appConfig.fromState = fromState;
        appConfig.toState = toState;
        appConfig.fromParams = fromParams;
        appConfig.toParams = toParams;
        if (angular.isDefined(toState.data.pageTitle)) {
            $scope.pageTitle = toState.data.pageTitle;
        }
    });
});