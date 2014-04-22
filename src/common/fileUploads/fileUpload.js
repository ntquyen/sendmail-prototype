angular.module('fileUpload', ['appConfig']).factory('fileUploadApi', ['$http', 'appConfig',
    function($http, appConfig) {
        var config = {
            baseUrl: appConfig.baseUrl + '/API/FileUploads'
        };
        return {
            // verify
            verify: function(data) {
                return $http.post(config.baseUrl + '/Verify', data);
            },
            import: function(data) {
                return $http.post(config.baseUrl + '/Import', data);
            }
        };
    }
]);