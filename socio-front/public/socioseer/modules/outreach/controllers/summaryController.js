/**
 * @author Gaurav Sirauthiya
 */
define([
    'angular',
    'angularRoute'
], function (angular, angularRoute) {

    angular.module('socioApp.outreach.summaryController', []).controller('summaryController', function ($scope, $location, localstorage, helperFactory, $state, httpServices, userHelper, $timeout, socialHelper, clientHelper, securityGroups, outreachHelper, menuFactory, rolesHelper) {
        if (!helperFactory.isLoggedIn()) {
            $state.go('login');
            return false;
        }
        jQuery('.dropdown-menu.stop-dropdown').on('click', function (event) {
            event.stopPropagation();
        });
        $scope.showRecommended = true;
        if (userHelper.isAdmin()) {
            $scope.isAdmin = true;
            $scope.showRecommended = false;
            outreachHelper.getClient($scope, httpServices, helperFactory, localstorage);
            $scope.clientDropdown = true;
            $scope.selectedClient = [];
            $scope.extraSettings = SINGLE_CLIENT_DROPDOWN;
        } else {
            $scope.selectedClientId = localstorage.get('clientId');
            $scope.clientDropdown = false;
        }
        $scope.canViewTask = rolesHelper.canView('FETCH_ALL_TASKS') || (rolesHelper.canView('GET_TASK_BY_CLIENT') && rolesHelper.canEdit('MANAGE_TASK') && rolesHelper.canView('MANAGE_TASK'));
        $scope.configScroll = SCROLL_CONFIG;
        $scope.showLoader = false;
        $scope.showLoaderSchedule = false;
        $scope.$emit('pageTitle', "Summary");
        $scope.$emit('menuItem', menuFactory.getMenuItems($scope));
        jQuery('body').removeClass('full-width');
        $scope.$emit('getHeader', true);
        $scope.$emit('getSidebar', true);
        $scope.$emit('getFooter', true);
        $scope.$emit('titleSection', true);
        securityGroups.socialPlatformAction($scope);
        if (userHelper.isAdmin()) {
            socialHelper.getTwitterTrends($scope, 1);
            socialHelper.getTrendingTweets($scope, 5, 'global');
        } else {
            $scope.woeid = 23424848;
            if (typeof localstorage.get('userClientData') != 'undefined' && localstorage.get('userClientData') != 'undefined' && !helperFactory.isEmpty(localstorage.get('userClientData'))) {
                var clientData = JSON.parse(localstorage.get('userClientData'));
                if (typeof clientData.woeid != 'undefined' && clientData.woeid != null && clientData.woeid == parseInt(clientData.woeid, 10)) {
                    $scope.woeid = clientData.woeid
                }
            }
            socialHelper.getTwitterTrends($scope, $scope.woeid);
            socialHelper.getTrendingTweets($scope, 5);
        }
        $scope.getTrends = function (global = false) {
            if (!helperFactory.isEmpty($scope.selectedClientData)) {
                if (global) {
                    socialHelper.getTwitterTrends($scope, 1);
                    socialHelper.getTrendingTweets($scope, 5, 'global');
                } else {
                    socialHelper.getTwitterTrends($scope, $scope.woeid);
                    socialHelper.getTrendingTweets($scope, 5, false, $scope.selectedClientData);
                }
            } else {
                if (global) {
                    socialHelper.getTwitterTrends($scope, 1);
                    socialHelper.getTrendingTweets($scope, 5, 'global');
                } else {
                    socialHelper.getTwitterTrends($scope, $scope.woeid);
                    socialHelper.getTrendingTweets($scope, 5);
                }
            }
            $scope.popularTweetsData = null;
            $scope.trendsData = null;

        }

        /**
         * filtered post case inside scheduled post
         */
        $scope.filterSchPost = function () {
            if (helperFactory.isEmpty($scope.schPlatform)) {
                publishScheduleData(false);
            } else {
                publishScheduleData(false, $scope.schPlatform.id);
            }
        }

        /**
         * filtered post case inside trending post
         */

        $scope.allTrendPost = true;
        $scope.filterTrendPost = function (tabSelect) {
            $scope.allTrendPost = false;
            $scope.facebookTrendPost = false;
            $scope.twitterTrendPost = false;
            $scope.linkedinTrendPost = false;
            $scope.googleTrendPost = false;
            switch (tabSelect) {
                case 'all':
                    $scope.allTrendPost = true;
                    break;
                case 'facebook':
                    $scope.facebookTrendPost = true;
                    break;
                case 'twitter':
                    $scope.twitterTrendPost = true;
                    break;
                case 'linkedin':
                    $scope.linkedinTrendPost = true;
                    break;
                case 'google':
                    $scope.googleTrendPost = true;
                    break;
            }
        }

        /**
         * filtered post case inside published post
         */
        $scope.allPost = true;
        $scope.filterPublishPost = function (tabSelect) {
            $scope.allPost = false;
            $scope.facebookPost = false;
            $scope.twitterPost = false;
            $scope.linkedinPost = false;
            $scope.googlePost = false;
            switch (tabSelect) {
                case 'all':
                    $scope.allPost = true;
                    break;
                case 'facebook':
                    $scope.facebookPost = true;
                    break;
                case 'twitter':
                    $scope.twitterPost = true;
                    break;
                case 'linkedin':
                    $scope.linkedinPost = true;
                    break;
                case 'google':
                    $scope.googlePost = true;
                    break;
            }
            if (tabSelect != 'all') {
                $scope.platformPublish = [];
                securityGroups.getSocialPlatformByName(tabSelect, $scope.optionSocial, $scope.platformPublish);
                publishScheduleData(true, $scope.platformPublish[0].id);
            } else {
                publishScheduleData(true);
            }
        }

        $scope.getCampaignSummary = function (listTaskData, scopeDataIDs, yesStartTS, yesEndTS, timestampForPS) {
            var sumParam = {
                'action': API_PATH + 'campaign-summary_get_postIds',
                'myparam': scopeDataIDs,
            };
            httpServices.postRequest(API_URL, sumParam).then(function (data) {
                $scope.showLoader = true;
                if (data.status == 200) {
                    angular.forEach(listTaskData, function (postData) {
                        if (!helperFactory.isEmpty(data.data)) {
                            angular.forEach(data.data, function (sumData) {
                                if (postData.id == sumData.postId) {
                                    postData.campSummary = sumData;
                                    if (yesEndTS < postData.runAt && postData.runAt < timestampForPS) {
                                        $scope.todayPubData.push(postData);
                                    } else if (yesStartTS < postData.runAt && postData.runAt <= yesEndTS) {
                                        $scope.yesPubData.push(postData);
                                    }
                                }
                            })
                        } else {
                            postData.campSummary = {};
                            if (yesEndTS < postData.runAt && postData.runAt < timestampForPS) {
                                $scope.todayPubData.push(postData);
                            } else if (yesStartTS < postData.runAt && postData.runAt <= yesEndTS) {
                                $scope.yesPubData.push(postData);
                            }
                        }
                    })
                } else { }
            }).catch(function (error) {
                $scope.errorMsgLogin = 'Server error.';
                helperFactory.errorMessage($scope.errorMsgLogin);
                $scope.success = false;
            });

        }

        function publishScheduleData(statusPS, tabSelect = false) {
            var timestampForPS;
            var tomStartTS;
            var tomEndTS;
            var yesStartTS;
            var yesEndTS;

            if (statusPS) {
                $scope.showLoader = false;
                $scope.todayPubData = [];
                $scope.yesPubData = [];
                timestampForPS = helperFactory.getCurrentTimeStamp() * 1000;
                yesEndTS = helperFactory.convertToTimeStamp(helperFactory.getDateValue(0));
                yesStartTS = helperFactory.convertToTimeStamp(helperFactory.getDateValue(-1));
            } else {
                $scope.showLoaderSchedule = false;
                $scope.todaySchData = [];
                $scope.tomSchData = [];
                timestampForPS = helperFactory.convertToTimeStamp(helperFactory.getDateValue(0));
                tomStartTS = helperFactory.convertToTimeStamp(helperFactory.getDateValue(1));
                tomEndTS = helperFactory.convertToTimeStamp(helperFactory.getDateValue(2));
                $scope.todaySchData = [];
                $scope.tomSchData = [];
            }

            var psParam = {
                'action': API_PATH + "post_postSchedule_startDate_" + timestampForPS + '_status_' + statusPS,
                'page': 0,
                'sort': 'runAt,asc',
                'size': 5
            }
            if (!helperFactory.isEmpty($scope.selectedClientId)) {
                psParam.action += '_client_' + $scope.selectedClientId;
            }
            if (tabSelect) {
                psParam.q = 'platform.id:' + tabSelect;
            }

            httpServices.getRequest(API_URL, psParam).then(function (data) {
                if (data.status == 200 && !helperFactory.isEmpty(data.data)) {
                    var listTaskData;

                    if (statusPS) {
                        var publishDataIDs = [];
                        $scope.publishedData = data.data;
                        listTaskData = $scope.publishedData;
                    } else {
                        $scope.scheduledData = data.data;
                        listTaskData = $scope.scheduledData;
                        $scope.showLoaderSchedule = true;
                    }

                    angular.forEach(listTaskData, function (campaignCall, keyIn) {
                        if (campaignCall.executed) {
                            publishDataIDs.push(campaignCall.id);
                            if (publishDataIDs.length == listTaskData.length) {
                                $scope.getCampaignSummary(listTaskData, publishDataIDs, yesStartTS, yesEndTS, timestampForPS);
                            }
                        }
                        if (!campaignCall.executed && campaignCall.active) {
                            if (timestampForPS <= campaignCall.runAt && campaignCall.runAt < tomStartTS) {
                                $scope.todaySchData.push(campaignCall);
                            } else if (tomStartTS <= campaignCall.runAt && campaignCall.runAt < tomEndTS) {
                                $scope.tomSchData.push(campaignCall);
                            } else { }
                        }
                    })
                } else {
                    if (statusPS) {
                        $scope.showLoader = true;
                    } else {
                        $scope.showLoaderSchedule = true;
                    }

                }
                if (!statusPS) {
                    $scope.showLoaderSchedule = true;
                }
            }).catch(function (error) {
                $scope.showLoader = true;
                $scope.showLoaderSchedule = true;
                $scope.errorMsgLogin = 'Server error.';
            })

        }

        var allTaskParam = {};
        if (userHelper.isAdmin()) {
            allTaskParam.action = API_PATH + 'task_count_all_all';
        } else if (userHelper.isClientAdmin()) {
            /*allTaskParam.action = API_PATH + 'task_get_user_' + helperFactory.getLoggedInUserId();*/
            allTaskParam.action = API_PATH + 'task_count_client_' + helperFactory.getLoggedInUserClientId();
        } else {
            allTaskParam.action = API_PATH + 'task_count_user_' + helperFactory.getLoggedInUserId();
        }
        $scope.countDataLoader = false;
        if ($scope.canViewTask) {
            httpServices.getRequest(API_URL, allTaskParam).then(function (data) {
                $scope.countDataLoader = true;
                if (data.status == 200 && !helperFactory.isEmpty(data.data)) {
                    $scope.countData = data.data;

                } else { }
            }).catch(function (error) {
                $scope.errorMsgLogin = 'Server error.';
            });
        }
        $scope.publishedData = [];
        $scope.scheduledData = [];
        publishScheduleData(true);
        publishScheduleData(false);

        $scope.changeClient = function (data) {
            $scope.selectedClientId = data.id;
            $scope.selectedClientData = data;
            console.log(data);
            var woeid = (data.woeid != null) ? data.woeid : 23424848;
            socialHelper.getTwitterTrends($scope, woeid);
            $scope.showRecommended = true;
            socialHelper.getTrendingTweets($scope, 5, false, data);
            publishScheduleData(true);
            publishScheduleData(false);
        }
        /*On unchecked client*/
        $scope.onDeselectClient = function (data) {
            $scope.selectedClientId = null;
            $scope.selectedClientData = null;
            publishScheduleData(true);
            publishScheduleData(false);
        }
        /*On unchecked client*/

        /**
         * Add fb handle action
         */
        $scope.addFBHandle = function () {
            if ($scope.selectedClient.length > 0) {

            }
        }
        /** TO-DO By Parag
         * Check validity of facebook handlers */
        /*userHelper.checkTokenValidity($scope);*/

        /**
			 * @method: convert timestamp into UTC
			 */
        $scope.convertTimeToUTC = helperFactory;
        

    });
});