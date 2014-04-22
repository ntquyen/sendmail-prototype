var app = angular.module('pushNotification.mainState', ['ui.router', 'appConfig']);
/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
app.config(function config($stateProvider) {
    $stateProvider.state('mainState', {
        url: '/mainState',
        views: {
            "main": {
                controller: 'MainStateCtrl',
                templateUrl: 'mainState/mainState.tpl.html'
            }
        },
        data: {
            pageTitle: 'Main View'
        }
    });
});
app.factory('testServiceApi', ['$http', 'appConfig',
    function($http, appConfig) {
        return {
            getResult: function(data) {
                return $http.post(appConfig.baseUrl + '/sendmail', data);
            }
        };

    }
]);
/**
 * And of course we define a controller for our route.
 */
app.controller('MainStateCtrl', ['$scope', '$state', 'appConfig', 'testServiceApi',
    function($scope, $state, appConfig, testServiceApi) {
        $scope.sender = {
            name: 'Lucas',
            email: 'lucas@agencyrevolution.com'
        };
        $scope.receivers = [];
        $scope.receiver = {
            name: 'test',
            email: 'test@mail.com'
        };
        $scope.addReceiver = function() {
            $scope.receivers.push($scope.receiver);
            $scope.receiver = {
                name: '',
                email: ''
            };

        };
        $scope.send = function() {
            var payload = {
                "sender": $scope.sender,
                "receivers": $scope.receivers
            };
            testServiceApi.getResult(payload).success(function(data) {
                $scope.test = data;
            });
        };
    }
]);