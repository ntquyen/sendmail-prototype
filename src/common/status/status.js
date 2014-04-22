angular.module('status', ['appConfig']).factory('statusApi', ['$http', 'appConfig',
    function($http, appConfig) {
        return {
            // get status
            getStatus: function(agencyLocationKey) {
                if (!agencyLocationKey) {
                    throw new Error('Agency Location Key is required');
                }
                return $http.get(appConfig.baseUrl + '/Api/Status/Get/' + agencyLocationKey);
            }
        };
    }
]);