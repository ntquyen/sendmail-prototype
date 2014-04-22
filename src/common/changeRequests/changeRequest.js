angular.module('changeRequest', ['appConfig']).factory('changeRequestApi', ['$http', 'appConfig',
    function($http, appConfig) {
        var baseUrl = appConfig.baseUrl + '/API/changeRequests';
        return {
            // create ZenDesk changeRequest
            create: function(changeRequest) {
                if (!changeRequest.subject) {
                    throw new Error('Subject is required');
                }
                return $http.post(baseUrl + '/Create', changeRequest);
            },
            // get all ZenDesk change requests raised by this user
            getChangeRequests: function() {
                return $http.get(baseUrl + '/GetChangeRequests');
            }
        };
    }
]);