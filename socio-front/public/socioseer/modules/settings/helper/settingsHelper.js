/***
 * @author Gaurav Sirauthiya 
 */
define([
    'angular',
    'angularRoute'
], function (angular, angularRoute) {
    angular.module('socioApp.audience.settingsHelper', []).factory('settingsHelper', function (localstorage, httpServices, helperFactory, pagination, userHelper, clientHelper) {
        var settingsHelper = {};
        /**
         * @method Fetch Post Matrix
         */
        settingsHelper.fetchPostMatrix = function (scope, all = false, clientId = false) {
            scope.getPostMatrixView = function (page) {
                var action;
                if (all) {
                    if (clientId) {
                        action = API_PATH + 'postMetrics_' + clientId;
                    } else {
                        action = API_PATH + 'postMetrics_all';
                    }
                } else {
                    action = API_PATH + 'postMetrics_' + helperFactory.getLoggedInUserClientId();
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
                        scope.postMatrixData = data.data;
                        pagination.setPagination(scope);
                    } else {
                        scope.postMatrixData = null;
                    }
                }).catch(function (error) {
                    scope.errorMsgLogin = 'Server error.';
                });

            }
        }
        return settingsHelper;
    });
});