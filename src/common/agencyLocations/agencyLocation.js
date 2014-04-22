angular.module('agencyLocation', ['appConfig']).factory('agencyLocationApi', ['$http', 'appConfig',
    function($http, appConfig) {
        return {
            // get list of agency locations
            getAgencyLocations: function() {
                return $http.get(appConfig.baseUrl + '/API/AgencyLocations/GetAll');
            }
        };
    }
]);