var app = angular.module('moonrayLight', ['ui.select2', 'ui.bootstrap', 'moonrayLight.contact', 'moonrayLight.campaign', 'templates-common']);
app.directive('arMoonrayLight', function($log) {
    return {
        restrict: 'AE',
        templateUrl: 'moonrayLights/moonrayLight.tpl.html',
        controller: 'MoonRayLightCtrl',
        link: function(scope, elem, attrs) {
            $log.log('moonrayLights.arMoonRayLight');
        }
    };
});
app.controller('MoonRayLightCtrl', function($scope, $log, $modal, contactApi) {
    $log.log('moonrayLights.MoonRayLightCtrl');
    $scope.data = {
        contacts: [],
        campaigns: []
    };
    // MoonrayLight Modal instance controller
    var MoonrayLightModalInstanceCtrl = function($scope, $log, $modalInstance, campaignApi, data) {
        $scope.processing = true;
        $scope.data = data;
        var contactIds = [];
        for (var i = $scope.data.contacts.length - 1; i >= 0; i--) {
            contactIds.push($scope.data.contacts[i].id);
        }
        var campaignIds = [];
        for (var j = $scope.data.campaigns.length - 1; j >= 0; j--) {
            campaignIds.push($scope.data.campaigns[j].id);
        }
        campaignApi.assign(contactIds, campaignIds).success(function(data) {
            $scope.processing = false;
            $scope.data.success = true;
        }).error(function(err) {
            $scope.processing = false;
            $scope.data.success = false;
            $log.log(err);
        });
        $scope.doAnother = function() {
            $modalInstance.close(true);
        };
    };
    // show modal
    $scope.showMoonrayLightModal = function() {
        var modalInstance = $modal.open({
            templateUrl: 'moonrayLights/moonrayLight.modal.tpl.html',
            controller: MoonrayLightModalInstanceCtrl,
            resolve: {
                data: function() {
                    return $scope.data;
                }
            }
        });
        modalInstance.result.then(function(doAnother) {
            if (doAnother) {
                $scope.data = {
                    contacts: [],
                    campaigns: []
                };
            }
        }, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
    // assign contact(s) to campaign(s)
    $scope.assign = function() {
        $scope.showMoonrayLightModal();
    };
});