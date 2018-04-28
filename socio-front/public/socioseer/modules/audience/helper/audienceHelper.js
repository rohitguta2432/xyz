/***
 * @author Gaurav Sirauthiya 
 */
define([
    'angular',
    'angularRoute'
], function (angular, angularRoute) {
    angular.module('socioApp.audience.audienceHelper', []).factory('audienceHelper', function (localstorage, httpServices, helperFactory, pagination, userHelper, clientHelper) {
        var audienceHelper = {};
        audienceHelper.fetchAudience = function (scope, all = false, clientId = false) {
            scope.getAudienceView = function (page) {
                var action;
                if (all) {
                    if (clientId) {
                        action = API_PATH + 'audience-types_' + clientId;
                    } else {
                        action = API_PATH + 'audience-types_all';
                    }
                } else {
                    action = API_PATH + 'audience-types_' + helperFactory.getLoggedInUserClientId();
                }

                scope.page = page;
                scope.per_page = 10;
                var params = {
                    'action': action,
                    'page': page,
                    'size': scope.per_page,
                    'q': '',
                    'sort': scope.sorting.attribute + ',' + scope.sorting.direction
                };
                if (scope.searchKey != undefined && scope.searchKey != null) {
                    params.q += ';name:' + scope.searchKey + '~true'
                } else {
                    scope.searchKey = null;
                }
                httpServices.getRequest(API_URL, params).then(function (data) {
                    if (data.status == 200 && !helperFactory.isEmpty(data)) {
                        scope.audienceData = data.data;
                        pagination.setPagination(scope);
                    } else {
                        scope.audienceData = null;
                    }
                }).catch(function (error) {
                    scope.errorMsgLogin = 'Server error.';
                });
            }
        }

        return audienceHelper;
    });
});