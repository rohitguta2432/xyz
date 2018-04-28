/**
 * Social Helper
 */

define([
    'angular',
    'angularRoute',
    'jquery'
], function (angular, angularRoute) {
    angular.module('socioApp.outreach.socialHelper', ['ngSanitize']).factory('socialHelper', function (localstorage, httpServices, helperFactory, userHelper, clientHelper, pagination, $timeout) {
        var socialHelper = {};
        /**
         * @method fetch Trends from twitter
         */
        socialHelper.getTwitterTrends = function (scope, region) {
            var params = { 'woeid': region };
            httpServices.twitterGetTrends(API_URL + '/twitter/trends', params).then(function (data) {
                if (data.status == 200 && !helperFactory.isEmpty(data)) {
                    scope.trendsData = data.data.trends;
                    pagination.setPagination(scope);
                } else {
                    scope.trendsData = null;
                }
            }).catch(function (error) {
                scope.errorMsgLogin = 'Server error.';
            });

        }
        /**
         * @method get Trending Tweets
         */
        socialHelper.getTrendingTweets = function (scope, _count, global = false, cData = null) {
            $timeout(function () {
                var _queryParams = 'a';
                if (!userHelper.isAdmin()) {
                    if (typeof localstorage.get('userClientData') != 'undefined' && !global) {
                        var clientData = JSON.parse(localstorage.get('userClientData'));
                        var c = ' OR ';
                        if (!helperFactory.isEmpty(clientData.competitiorsDefinitions)) {
                            angular.forEach(clientData.competitiorsDefinitions, function (element) {
                                c += element.name + ' OR ';
                            });
                        }
                        _queryParams = clientData.industry.industryName + c;
                    }
                } else {
                    if (!helperFactory.isEmpty(cData)) {
                        if (!cData.keywords) {
                            var clientData = cData;
                            var c = ' OR ';
                            if (!helperFactory.isEmpty(clientData.competitiorsDefinitions)) {
                                angular.forEach(clientData.competitiorsDefinitions, function (element) {
                                    c += element.name + ' OR ';
                                });
                            }

                            _queryParams = clientData.industry.industryName + c;
                        } else {
                            var c = '';
                            if (!helperFactory.isEmpty(cData.keywords)) {
                                angular.forEach(cData.keywords, function (element) {
                                    c += element + ' OR ';
                                });
                            }
                            _queryParams = c.replace(/ OR +$/, '');;
                        }
                    }
                }
                var params = {
                    q: _queryParams, lang: 'en', result_type: 'popular', count: _count
                };

                httpServices.twitterGetTrends(API_URL + '/twitter/trendingPost', params).then(function (data) {
                    if (data.status == 200 && !helperFactory.isEmpty(data)) {
                        scope.popularTweetsData = data.data.statuses;
                    } else {
                        scope.trendsData = null;
                    }
                }).catch(function (error) {
                });
            }, 1000)
        }


        socialHelper.getFilteredTweets = function (scope, _count, data = false) {
            $timeout(function () {
                var _queryParams = 'a';
                /* if (!userHelper.isAdmin()) {
                    
                } else {
                    var str = '';
                    if (data && data.length > 0) {
                        _queryParams = data;
                    }
                } */
                 var str = '';
                    if (data && data.length > 0) {
                        _queryParams = data;
                    }
                var params = {
                    q: _queryParams, lang: 'en', result_type: 'popular', count: _count
                };

                httpServices.twitterGetTrends(API_URL + '/twitter/trendingPost', params).then(function (data) {
                    if (data.status == 200 && !helperFactory.isEmpty(data)) {
                        scope.popularTweetsData = data.data.statuses;
                    } else {
                        scope.trendsData = null;
                    }
                }).catch(function (error) {
                });
            }, 1000)
        }


        return socialHelper;
    });
});     