angular.module('topic', ['appConfig']).factory('topicApi', ['$http', 'appConfig',
    function($http, appConfig) {
        var baseUrl = appConfig.baseUrl + '/API/Topics';
        return {
            // get list of agency locations by portal Id
            find: function(amsType) {
                if (!amsType) {
                    throw new Error('amsType is required');
                }
                return $http.get(baseUrl + '/Find?amsType=' + amsType);
            },
            // get Topic by id
            get: function(topicId) {
                if (!topicId) {
                    throw new Error('topicId is required');
                }
                return $http.get(baseUrl + '/Get/' + topicId);
            }
        };
    }
]);