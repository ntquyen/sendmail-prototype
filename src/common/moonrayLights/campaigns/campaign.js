var app = angular.module('moonrayLight.campaign', ['appConfig', 'appUtils', 'ui.select2']);
// api service
app.factory('campaignApi', ['$http', 'appConfig',
    function($http, appConfig) {
        var baseUrl = appConfig.baseUrl + '/api/campaigns';
        return {
            // get all moonray campaigns
            get: function() {
                return $http.get(baseUrl + '/get');
            },
            // assign contacts to campaigns
            assign: function(contactIds, campaignIds) {
                return $http.post(baseUrl + '/assign', {
                    contactIds: contactIds,
                    campaignIds: campaignIds
                });
            }
        };
    }
]);
// directive
app.directive('arCampaignSelection', [

    function() {
        return {
            restrict: 'AE',
            scope: {
                selectedCampaigns: '=ngModel'
            },
            templateUrl: 'moonrayLights/campaigns/campaign.tpl.html',
            controller: 'CampaignAssignmentCtrl',
            link: function(scope, iElement, iAttrs) {
                console.log('moonrayLight.campaign.arCampaignAssignment');
            }
        };
    }
]);
// controller
app.controller('CampaignAssignmentCtrl', ['$scope', '$log', 'campaignApi', 'appConfig', 'appUtils',
    function($scope, $log, campaignApi, appConfig, appUtils) {
        var formatResult = function(campaign, container, query) {
            return "<div>" + appUtils.boldText(query.term, campaign.name) + "</div>";
        };
        var formatSelection = function(campaign) {
            return campaign.name;
        };
        // filter campaigns by search term
        var filterCampaigns = function(campaigns, term) {
            if (!campaigns) {
                return null;
            }
            if (!term) {
                return campaigns;
            }
            var filteredCampaigns = [];
            for (var i = campaigns.length - 1; i >= 0; i--) {
                if (campaigns[i].name.toLowerCase().indexOf(term.toLowerCase()) >= 0) {
                    filteredCampaigns.push(campaigns[i]);
                }
            }
            return filteredCampaigns;
        };
        // select2 options
        $scope.select2Options = {
            multiple: true,
            query: function(options) {
                var data = {
                    results: filterCampaigns(appConfig.campaigns, options.term)
                };
                if (data.results) {
                    return options.callback(data);
                }
                data.results = ["Loading..."];
                campaignApi.get(options.term).success(function(campaigns) {
                    data.results = campaigns;
                    appConfig.campaigns = campaigns;
                    return options.callback(data);
                }).error(function(err) {
                    data.results = ["Sorry! Error occurred"];
                    $log.log(err);
                    return options.callback(data);
                });
            },
            formatResult: formatResult,
            formatSelection: formatSelection,
            id: function(campaign) {
                return campaign.id;
            }
        };
    }
]);