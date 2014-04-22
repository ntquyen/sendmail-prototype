angular.module('agencyLocationProperty', ['appConfig']).factory('agencyLocationPropertyApi', ['$http', 'appConfig',
    function($http, appConfig) {
        return {
            // get list of agency location propertiess by portal Id
            getAgencyLocationProperties: function(agencyLocationId) {
                if (agencyLocationId >= 0) {
                    return $http.get(appConfig.baseUrl + '/api/AgencyLocationProperties/GetByAgencyLocationId?agencyLocationId=' + agencyLocationId);
                }
                throw new Error('agencyLocationId required!');
            }
        };
    }
]);