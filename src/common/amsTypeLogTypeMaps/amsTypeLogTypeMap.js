angular.module('amsTypeLogTypeMap', ['appConfig']).factory('amsTypeLogTypeMapApi', ['$http', 'appConfig',
    function($http, appConfig) {
        return {
            // get all AMS Types
            get: function() {
                return $http.get(appConfig.baseUrl + '/API/AmsTypeLogTypeMaps/GetAll');
            }
        };
    }
]);