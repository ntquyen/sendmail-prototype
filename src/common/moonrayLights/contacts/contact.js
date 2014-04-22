var app = angular.module('moonrayLight.contact', ['appConfig', 'appUtils', 'ui.select2', 'ui.bootstrap']);
// service
app.factory('contactApi', ['$http', 'appConfig',
    function($http, appConfig) {
        var baseUrl = appConfig.baseUrl + '/API/contacts';
        return {
            // find moonray contacts
            find: function(keyword) {
                return $http.get(baseUrl + '/find?k=' + keyword);
            },
            // save a contact to moonray
            save: function(contact) {
                return $http.post(baseUrl + '/save', contact);
            }
        };
    }
]);
// directive
app.directive('arContactSelection', ['$log',
    function($log) {
        return {
            restrict: 'AE',
            scope: {
                selectedContacts: '=ngModel'
            },
            templateUrl: 'moonrayLights/contacts/contact.tpl.html',
            controller: 'ContactSelectionCtrl',
            link: function(scope, iElement, iAttrs) {
                $log.log('moonrayLight.contact.ContactSelectionCtrl');
            }
        };
    }
]);
//controller
app.controller('ContactSelectionCtrl', ['$scope', 'contactApi', '$log', '$compile', '$timeout', '$modal', 'appUtils',
    function($scope, contactApi, $log, $compile, $timeout, $modal, appUtils) {
        $scope.selectedContacts = [];
        // Contact Modal instance controller
        var ContactModalInstanceCtrl = function($scope, $log, $modalInstance, contact) {
            $scope.submitted = false;
            $scope.contact = contact;
            // add a new contact or update the existing one
            $scope.saveContact = function(isValid) {
                $scope.submitted = true;
                if (!isValid) {
                    return;
                }
                contactApi.save($scope.contact).success(function(contact) {
                    $scope.savedContact = contact;
                    $modalInstance.close($scope.savedContact);
                }).error(function(err) {
                    $log.log(err);
                    $scope.saveError = err;
                    $scope.savedContact = null;
                });
            };
            $scope.cancel = function() {
                $modalInstance.dismiss('cancel');
            };
        };
        var createNewContactMarkup = function(term) {
            return "<div stype=\"cursor: pointer;\" ng-click=\"addContact()\">Create a new contact \"" + term + "\"</div>";
        };
        var formatResult = function(contact, container, query) {
            if (!contact.id) {
                return createNewContactMarkup(query.term);
            }
            var markup = "<div>" + appUtils.boldText(query.term, contact.firstName) + " " + appUtils.boldText(query.term, contact.lastName);
            if (contact.email) {
                markup += " &lt;" + appUtils.boldText(query.term, contact.email) + "&gt;</div>";
            }
            return markup;
        };
        var formatSelection = function(contact) {
            return (contact.firstName ? contact.firstName : "") + " " + (contact.lastName ? contact.lastName : "") + " &lt;" + (contact.email ? contact.email : "") + "&gt;";
        };
        // show modal
        $scope.showContactModal = function() {
            var modalInstance = $modal.open({
                templateUrl: 'moonrayLights/contacts/contact.modal.tpl.html',
                controller: ContactModalInstanceCtrl,
                resolve: {
                    contact: function() {
                        return $scope.contact;
                    }
                }
            });
            modalInstance.result.then(function(savedContact) {
                $scope.selectedContacts.push(savedContact);
            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
        // add a contact
        $scope.addContact = function() {
            var nameParts = $scope.term.split(' ');
            $scope.contact = {
                firstName: nameParts.length > 0 ? nameParts[0] : null,
                lastName: nameParts.length > 1 ? nameParts[1] : null,
                email: nameParts.length > 2 ? nameParts[2] : null
            };
            $scope.showContactModal();
        };
        // select2 options
        $scope.select2Options = {
            multiple: true,
            minimumInputLength: 3,
            query: function(options) {
                $log.log(options);
                var data = {
                    results: null
                };
                contactApi.find(options.term).success(function(contacts) {
                    data.results = contacts;
                    return options.callback(data);
                }).error(function(err) {
                    data.results = ["Sorry! Error occurred"];
                    $log.log(err);
                    return options.callback(data);
                });
            },
            formatResult: formatResult,
            formatSelection: formatSelection,
            formatNoMatches: function(term) {
                $timeout(function() {
                    $scope.term = term;
                });
                return createNewContactMarkup(term);
            },
            formatInputTooShort: function() {
                return "Enter name or email";
            },
            id: function(contact) {
                return contact.id;
            },
            createSearchChoice: function(term) {
                var nameParts = term.split(' ');
                return contact = {
                    id: "",
                    firstName: nameParts.length > 0 ? nameParts[0] : null,
                    lastName: nameParts.length > 1 ? nameParts[1] : null,
                    email: null
                };
            },
            createSearchChoicePosition: "bottom"
        };
        // watch change of $scope.term
        $scope.$watch('term', function(newVal, oldVal) {
            if (newVal && newVal !== oldVal) {
                $timeout(function() {
                    var noResultsLink = $('.select2-no-results');
                    $compile(noResultsLink.contents())($scope);
                });
            }
        }, true);
        // watch change of $scope.selectedContacts
        $scope.$watch('selectedContacts', function(newVal, oldVal) {
            if (newVal && newVal !== oldVal) {
                $timeout(function() {
                    for (var i = $scope.selectedContacts.length - 1; i >= 0; i--) {
                        var contact = $scope.selectedContacts[i];
                        if (!contact.firstName || !contact.lastName || !contact.email) {
                            $scope.contact = contact;
                            // show popup to let user correct the information first, then select if okay
                            $scope.selectedContacts.splice(i, 1);
                            $scope.showContactModal();
                            return;
                        }
                    }
                });
            }
        }, true);
    }
]);