'use strict';
define([
    'angular',
    'angularRoute',
    'datepicker',
    'outreachHelper',
    'contentHelper',
    'composePostHelper',
    'userHelper',
    'socialHelper',
    'composePostController',
    'summaryController',
    'campaignController',
    'eventController'
], function (angular) {
    angular.module('socioApp.outreach', ['ui.router', 'socioApp.outreach.outreachHelper', 'socioApp.user.userHelper', 'socioApp.outreach.socialHelper', 'socioApp.outreach.composePostController', 'socioApp.outreach.summaryController', 'socioApp.outreach.eventController', 'socioApp.outreach.campaignController', 'socioApp.outreach.composePostHelper', 'ngSanitize'])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state('outreach', {
                url: '/outreach',
                abstract: true,
                controller: 'outreachController',
                resolve: {
                    activeMenu: function () {
                        jQuery('body').removeClass('full-width');
                    }
                }
            })
                .state("summary", {
                    url: '/summary',
                    templateUrl: 'modules/outreach/views/summary.html',
                    controller: 'summaryController',
                }).state("campaignListing", {
                    url: '/campaignListing',
                    templateUrl: 'modules/outreach/views/campaignListing.html',
                    controller: 'campaignListingController',
                    params: {
                        startDate: "",
                        endDate: "",
                        clientId: ""
                    }
                }).state("createCampaign", {
                    url: '/createCampaign',
                    templateUrl: 'modules/outreach/views/createCampaign.html',
                    controller: 'createCampaignController',
                }).state("viewCampaign", {
                    url: '/viewCampaign',
                    templateUrl: 'modules/outreach/views/viewCampaign.html',
                    controller: 'viewCampaignController',
                }).state("composePost", {
                    url: '/composePost',
                    templateUrl: 'modules/outreach/views/composePost.html',
                    controller: 'composePostController',
                    params: {
                        clear: true
                    }
                }).state("draft", {
                    url: '/draft',
                    templateUrl: 'modules/outreach/views/draft.html',
                    controller: 'draftController',
                }).state("scheduled", {
                    url: '/scheduled',
                    templateUrl: 'modules/outreach/views/scheduled.html',
                    controller: 'scheduledController',
                }).state("published", {
                    url: '/published',
                    templateUrl: 'modules/outreach/views/published.html',
                    controller: 'publishedController',
                }).state("tasks", {
                    url: '/tasks',
                    templateUrl: 'modules/outreach/views/tasks.html',
                    controller: 'tasksController',
                }).state("trending", {
                    url: '/trending',
                    templateUrl: 'modules/outreach/views/trending.html',
                    controller: 'trendingController',
                }).state("reviewApprove", {
                    url: '/taskApprove',
                    templateUrl: 'modules/outreach/views/reviewApprove.html',
                    controller: 'reviewApproveController',
                }).state("postApprove", {
                    url: '/postApprove',
                    templateUrl: 'modules/outreach/views/postApprove.html',
                    controller: 'postReviewApproveController',
                }).state("event", {
                    url: '/event',
                    templateUrl: 'modules/outreach/views/eventListing.html',
                    controller: 'eventController',
                    params: {
                        startDate: null,
                        endDate: null
                    }
                }).state("postDetail", {
                    url: '/draftDetail',
                    templateUrl: 'modules/outreach/views/postDetails.html',
                    controller: 'postDetailController',
                });
        }])
        .controller('trendingController', function ($scope, $location, localstorage, helperFactory, $state, socialHelper, userHelper, menuFactory) {
            if (!helperFactory.isLoggedIn()) {
                $state.go('login');
                return false;
            }
            $scope.$emit('menuItem', menuFactory.getMenuItems($scope));
            $scope.$emit('pageTitle', "Trending");
            $scope.$emit('getHeader', true);
            $scope.$emit('getSidebar', true);
            $scope.$emit('getFooter', true);
            $scope.$emit('titleSection', true);
            $scope.showRecommended = true;
            if (userHelper.isAdmin()) {
                $scope.isAdmin = true;
                $scope.showRecommended = false;
                userHelper.fetchClientForTeam($scope);
                $scope.clientDropdown = true;
                $scope.getClientData = function () {

                }
            } else {
                $scope.selectedClientId = localstorage.get('clientId');
                $scope.clientDropdown = false;
            }
            $scope.configScroll = SCROLL_CONFIG;

            $scope.changeClient = function (data) {
                if (data != null) {
                    if (helperFactory.isEmpty(data)) {
                        $scope.selectedClientId = undefined;
                    } else {
                        $scope.selectedClientId = data.id;
                    }
                    var woeid = (data.woeid != null) ? data.woeid : 23424848;
                    socialHelper.getTwitterTrends($scope, woeid);
                    $scope.selectedClientData = data;
                    $scope.showRecommended = true;
                    socialHelper.getTrendingTweets($scope, 50, false, data);
                    $scope.showLoader = false;
                    $scope.showLoaderSchedule = false;
                }
            }
            if (userHelper.isAdmin()) {
                $scope.isAdmin = true;
                socialHelper.getTwitterTrends($scope, 1);
                socialHelper.getTrendingTweets($scope, 50, 'global');
            } else {
                $scope.woeid = 23424848;
                if (typeof localstorage.get('userClientData') != 'undefined' && localstorage.get('userClientData') != 'undefined' && !helperFactory.isEmpty(localstorage.get('userClientData'))) {
                    var clientData = JSON.parse(localstorage.get('userClientData'));
                    if (typeof clientData.woeid != 'undefined' && clientData.woeid != null && clientData.woeid == parseInt(clientData.woeid, 10)) {
                        $scope.woeid = clientData.woeid
                    }
                }
                socialHelper.getTwitterTrends($scope, $scope.woeid)
                socialHelper.getTrendingTweets($scope, 50);
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
        }).controller('tasksController', function ($scope, $location, localstorage, helperFactory, $state, httpServices, pagination, securityGroups, $q, userHelper, $timeout, rolesHelper, menuFactory) {
            if (!helperFactory.isLoggedIn()) {
                $state.go('login');
                return false;
            }
            $scope.addLocalTimeStamp = -((new Date()).getTimezoneOffset() * 60 * 1000);
            var canViewTask = rolesHelper.canView('FETCH_ALL_TASKS') || (rolesHelper.canView('GET_TASK_BY_CLIENT') && rolesHelper.canEdit('MANAGE_TASK') && rolesHelper.canView('MANAGE_TASK'));
            if (!canViewTask) {
                $state.go('summary');
            }
            $scope.currentTabId = 1;
            $scope.$emit('menuItem', menuFactory.getMenuItems($scope));
            $scope.$emit('pageTitle', "Tasks");
            $scope.$emit('getHeader', true);
            $scope.$emit('getSidebar', true);
            $scope.$emit('getFooter', true);
            $scope.$emit('titleSection', true);
            $scope.configScroll = SCROLL_CONFIG;
            $scope.dx = [];

            /**
             *  Check if user is super admin
             */
            if (userHelper.isAdmin()) {
                $scope.adminClientDropdown = true;
                $scope.extraSettings = SINGLE_CLIENT_DROPDOWN;
                userHelper.fetchClientForTeam($scope);
            } else {
                $scope.clientId = localstorage.get('clientId');
                $scope.adminClientDropdown = false;
            }

            /**
             * function to get campaign data by campaign id
             */
            $scope.campaignData = function (listTaskData, angularElement) {
                securityGroups.draftListAction(listTaskData)
                angular.forEach(listTaskData, function (campaignCall, keyIn) {
                    var campParam = {
                        'action': API_PATH + 'campaign_' + campaignCall.campaignId
                    }
                    httpServices.getRequest(API_URL, campParam).then(function (camp) {
                        if (camp.data) {
                            listTaskData[keyIn].campaignData = camp.data;
                        } else {
                            listTaskData[keyIn].campaignData = {
                                'hashtags': ['NA']
                            };
                        }
                    })
                    if (listTaskData.length == keyIn + 1) {
                        $timeout(function () {
                            angularElement.trigger('click');
                        });
                    }
                })
            }

            /**
             *  function to redirect a task to approve page
             */
            $scope.reviewApprove = function (taskData) {
                localstorage.set('taskApprovalData', JSON.stringify(taskData));
                $state.go("reviewApprove");
            }

            /**
             *  get task by search filter from input text field on enter or click model value set in
             *  search key that will filter campaign title containg that string
             */
            $scope.searchTasks = function ($event, currentTabId) {
                if ($event.keyCode == 13 && $scope.searchKey != null) {
                    $scope.getTasks(0, $scope.currentTabId);
                }

                if ($event.keyCode == 8) {
                    $scope.getTasks(0, $scope.currentTabId);
                }

            }

            /**
             * function to get filtered or all tasks list depending on login user access
             */
            $scope.getTasks = function (page, tabId) {
                $scope.page = page;
                $scope.per_page = 10;
                $scope.indexer = eval($scope.page * $scope.per_page);
                $scope.paginationData = {};
                $scope.currentTabId = tabId;
                var allTaskParam = {
                    'page': page,
                    'size': $scope.per_page,
                    'sort': 'createdDate,desc',
                };
                if (userHelper.isAdmin()) {
                    if ($scope.clientId == undefined || $scope.clientId == null) {
                        allTaskParam.action = API_PATH + "task_all";
                    } else {
                        allTaskParam.action = API_PATH + "task_client_" + $scope.clientId;
                    }
                } else {
                    allTaskParam.action = API_PATH + "task_client_" + $scope.clientId;
                }
                switch (tabId) {
                    case 1:
                        allTaskParam.q = 'status:14,15,16,26';
                        break;
                    case 2:
                        allTaskParam.q = 'status:14';
                        break;
                    case 3:
                        allTaskParam.q = 'status:15';
                        break;
                    case 4:
                        allTaskParam.q = 'status:16';
                        break;
                    case 5:
                        allTaskParam.q = 'status:26';
                        break;
                }
                if (!userHelper.isClientAdmin() && !userHelper.isAdmin()) {
                    allTaskParam.q += ';approverId:' + helperFactory.getLoggedInUserId()
                }
                if ($scope.searchKey != undefined && $scope.searchKey != null) {
                    allTaskParam.q += ';campaignTitle:' + $scope.searchKey + '~true';
                } else {
                    $scope.searchKey = null;
                }

                httpServices.getRequest(API_URL, allTaskParam).then(function (data) {

                    $scope.noTaskFound = "No task found.";
                    $scope.allTasksData = [];
                    $scope.allPendingData = [];
                    $scope.allApprovedData = [];
                    $scope.allRejectedData = [];
                    $scope.allExpiredData = [];

                    if (data.status == 200 && !helperFactory.isEmpty(data.data)) {
                        $scope.noTaskFound = "";
                        switch (tabId) {
                            case 1:
                                $scope.allTasksData = data.data;
                                $scope.campaignData($scope.allTasksData, angular.element('#all a'))
                                break;
                            case 2:
                                $scope.allPendingData = data.data;
                                $scope.campaignData($scope.allPendingData, angular.element('#pending a'))
                                break;
                            case 3:
                                $scope.allApprovedData = data.data;
                                $scope.campaignData($scope.allApprovedData, angular.element('#approved a'))
                                break;
                            case 4:
                                $scope.allRejectedData = data.data;
                                $scope.campaignData($scope.allRejectedData, angular.element('#rejected a'))
                                break;
                            case 5:
                                $scope.allExpiredData = data.data;
                                $scope.campaignData($scope.allExpiredData, angular.element('#expired a'))
                                break;
                        }
                        $scope.success = true;
                    } else {
                        if (data.status != 200 && helperFactory.isEmpty(data.data)) {
                            helperFactory.errorMessage(data.message);
                            $scope.success = false;
                        }
                    }
                    $scope.totalRecords = data.count;
                    pagination.setPagination($scope);

                }).catch(function (error) {
                    $scope.errorMsgLogin = 'Server error.';
                    helperFactory.errorMessage($scope.errorMsgLogin);
                    $scope.success = false;
                });
            }

            /**
             *  function for page data of task
             */
            $scope.getPagedData = function (page) {
                if (page < $scope.dx.length && page >= 0) {
                    this.getTasks(page, $scope.currentTabId);
                }
            }

            $scope.getTasks(0, $scope.currentTabId);
            $scope.selectedClient = [];

            /** function for user admin case if
             * a client is selected, appropriate action to take
             */
            $scope.changeClient = function () {
                $scope.searchKey = null;
                if ($scope.selectedClient.length < 1) {
                    $scope.clientId = null;
                } else {
                    $scope.clientId = $scope.selectedClient[0].id;
                }
                $scope.getTasks(0, $scope.currentTabId);
            }

            /** function for user admin case if
             * a client is deselected, appropriate action to take
             */
            $scope.onDeselectClient = function (data) {
                $scope.clientId = null;
                $scope.getTasks(0, $scope.currentTabId);
            }





        }).controller('publishedController', function ($rootScope, formValidator, $scope, $location, localstorage, helperFactory, $state, httpServices, userHelper, outreachHelper, securityGroups, $timeout, rolesHelper, menuFactory) {

            if (!helperFactory.isLoggedIn()) {
                $state.go('login');
                return false;
            }
            $scope.addLocalTimeStamp = -((new Date()).getTimezoneOffset() * 60 * 1000);

            var canViewPublished = rolesHelper.canView('POST_SCHEDULE_FILTER_BY_DATE_RANGE_STATUS') && rolesHelper.canView('GET_CAMPAIGN_BY_CLIENT');

            if (!canViewPublished) {
                $state.go('summary');
            }
            $scope.formValidator = formValidator;
            $scope.$emit('menuItem', menuFactory.getMenuItems($scope));
            $scope.$emit('pageTitle', "Published");
            $scope.$emit('getHeader', true);
            $scope.$emit('getSidebar', true);
            $scope.$emit('getFooter', true);
            $scope.$emit('titleSection', true);

            /**
             *  function that will reset end date filter if start date changes
             */
            $scope.resetEndDate = function () {
                $scope.fEndDate = null;
            }

            /** variable that enable reset button if changes applied */
            $scope.showResetButton = false;

            if ($scope.pubPlatform || $scope.fStartDate || $scope.fEndDate || $scope.selectedCampaign) {
                $scope.showResetButton = true;
            }
            var cData = {};

            /**
             * function to get filtered or all published post on the basis of login user
             * @param {*} startDate 
             * @param {*} endDate 
             */
            function getPublishedPost(startDate, endDate) {
                $scope.showLoader = false;
                var eventArray = [];
                var params;
                var calParams;
                if ($scope.clientId != undefined && $scope.clientId != "") {
                    params = {
                        'action': API_PATH + 'post_postSchedule_startDate_' + startDate + '_endDate_' + endDate + '_status_true',
                        'q': 'clientId:' + $scope.clientId
                    };
                } else {
                    params = {
                        'action': API_PATH + 'post_postSchedule_startDate_' + startDate + '_endDate_' + endDate + '_status_true'
                    };
                }
                if (!helperFactory.isEmpty($scope.clientId) && !helperFactory.isEmpty($scope.camapignId)) {
                    params.q = 'clientId:' + $scope.clientId + ';campaignId:' + $scope.camapignId
                }

                if (!helperFactory.isEmpty($scope.pubPlatform)) {
                    if (params.hasOwnProperty('q')) {
                        params.q += ";";
                    } else {
                        params.q = "";

                    }
                    params.q += 'platform.id:' + $scope.pubPlatform.id;
                }

                httpServices.getRequest(API_URL, params).then(function (data) {
                    $timeout(function dooo() {
                        $scope.showLoader = true;
                    }, 300);

                    if (data.status == 200 && !helperFactory.isEmpty(data.data)) {
                        $scope.camapignId = null;
                        $scope.publishedPost = data.data;

                        var fPost = data.data[0].post;
                        if (fPost != null) {
                            $scope.postContent = data.data[0];
                        } else {
                            $scope.postContent = "No Content available";
                        }
                        $scope.dataAvail = true;

                        calParams = params;
                        calParams.action += "_calander";

                        httpServices.getRequest(API_URL, calParams).then(function (data) {
                            eventArray = [];
                            if (data.status == 200 && !helperFactory.isEmpty(data.data)) {
                                var dataLength = data.data.length;
                                angular.forEach(data.data, function (events, key) {
                                    var cData = {};
                                    cData.id = events.campaignId;
                                    cData.title = "Title: " + events.campaignName;
                                    cData.start = new Date(events.createDate + $scope.addLocalTimeStamp);
                                    cData.postCount = events.countPost;
                                    cData.color = '#257e4a';
                                    cData.icon = "twitter";
                                    eventArray.push(cData);

                                    if (dataLength == key + 1) {
                                        $('#calendarDiv').fullCalendar('destroy');
                                        loadCalendar(eventArray);
                                    }
                                });
                            } else { }
                        }).catch(function (error) {
                            $scope.errorMsg = 'Server error.';
                        });
                    } else {
                        $scope.postContent = "No Content available";
                        $scope.dataAvail = false;
                    }
                    $roots.isDateFormOpen = false;
                    $scope.openCalendar = false;

                }).catch(function (error) {
                    $scope.errorMsg = 'Server error.';
                    $scope.isDateFormOpen = false;
                    $scope.openCalendar = false;
                });
                var v = $scope.pubPlatform || $scope.fStartDate || $scope.fEndDate || $scope.selectedCampaign;
                if (typeof v != 'undefined' && v) {
                    $scope.showResetButton = true;
                } else {
                    $scope.showResetButton = false;
                }

            }

            /**client listing**/
            if (userHelper.isAdmin()) {
                $scope.clientDropdown = true;
                outreachHelper.getClient($scope, httpServices, helperFactory, localstorage);
                $scope.selectedClient = [];
                $scope.extraSettings = SINGLE_CLIENT_DROPDOWN;
                $scope.clientId = "";
            } else {
                $scope.clientDropdown = false;
                $scope.clientId = localstorage.get('clientId');
                getCampaignByClientId($scope.clientId);
            }
            $scope.configScroll = SCROLL_CONFIG;

            /** action if client is change */
            $scope.changeClient = function (data) {
                $scope.clientId = data.id;
                getPublishedPost($scope.endDate, $scope.startDate);
                getCampaignByClientId($scope.clientId);
            }
            /*On unchecked client*/
            $scope.onDeselectClient = function (data) {
                $scope.clientId = "";
                $scope.campaign = [];
                getPublishedPost($scope.endDate, $scope.startDate);
            }
            /*On unchecked client*/

            /** function that will bring all platforms (ex. facebook, twitter etc.) */
            securityGroups.socialPlatformAction($scope);

            /** action while a campaign is select that will filter post on tghe basis of selected campign */
            $scope.changeCampaign = function (data) {
                if (data != undefined) {
                    $scope.camapignId = data.id;
                    getPublishedPost($scope.endDate, $scope.startDate);
                } else {
                    $scope.camapignId = "";
                }
            }

            var today = new Date();
            /**max date variable set to today */
            $scope.maxDate = today;
            /** default start date set to current */
            $scope.startDate = Date.parse(new Date());
            /** default end date set to 7 days before */
            $scope.endDate = Date.parse(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7));
            /** loader array from constants.js */
            $scope.loaderArray = LOADER_ARRAY;

            /** filter existing published post by a platform(ex.fb, twitter etc.) */
            $scope.filterPubPost = function (platformGot) {
                getPublishedPost($scope.endDate, $scope.startDate);
            }

            getPublishedPost($scope.endDate, $scope.startDate);

            /**Get campaign by client id**/
            function getCampaignByClientId(clientId) {
                $scope.campaign = [];
                var params = {
                    'action': API_PATH + 'campaign_client_' + clientId,
                    'q': 'status:1'
                };
                httpServices.getRequest(API_URL, params).then(function (data) {
                    if (data.status == 200 && !helperFactory.isEmpty(data.data)) {
                        angular.forEach(data.data, function (camp) {
                            var campObj = {};
                            campObj.id = camp.id;
                            campObj.title = camp.title;
                            campObj.is = camp.title;
                            $scope.campaign.push(campObj);
                        });
                    } else {
                        $scope.campaign = [];
                    }
                }).catch(function (error) {
                    $scope.errorMsg = 'Server error.';
                });

            }

            /**Get post by post id*/
            $scope.getPostDetails = function (post, index) {
                angular.element("#allPost ul li").removeClass("active");
                angular.element("#post" + index).addClass("active");
                var postText = post;
                if (postText != null) {
                    $scope.postContent = postText;
                    console.log($scope.postContent)
                } else {
                    $scope.postContent = "No Content available";
                }
            }

            /**redirect to post detail page */
            $scope.getPostDetail = function (postclick) {
                $('#campaignPreview').modal('hide');
                $timeout(function dooo() {
                    sessionStorage.postSelectedId = postclick.id;
                    $state.go('postDetail');
                }, 200);
            }

            /**mark favourate*/
            $scope.markFavourite = function (post, index) {
                var target = jQuery('#marker' + index + ' > i');
                if (!target.hasClass('fav')) {
                    target.removeClass('fa-star-o').addClass('fa-star fav');
                } else {
                    target.removeClass('fa-star fav').addClass('fa-star-o');
                }
            }

            /***date range filter****/
            $scope.filterPostByDate = function (formName, reload) {
                if (formName.$valid) {
                    $scope.startDate = helperFactory.getTimeStamp($scope.fStartDate);
                    $scope.endDate = helperFactory.getTimeStamp($scope.fEndDate);
                    getPublishedPost($scope.startDate, $scope.endDate);
                }
            }

            /** reset filterd published post to default */
            $scope.resetForm = function (formName) {
                formName.reset();
            }

            /** jquery function close calender if open */
            jQuery('#resetIt').on('click', function (e) {
                $scope.publishedPost = null;

                jQuery('#resetHidden').click();
                jQuery('#resetHiddenCal').click();
                var today = new Date();
                $scope.maxDate = today;
                $scope.startDate = Date.parse(new Date());
                $scope.endDate = Date.parse(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7));
                getPublishedPost($scope.endDate, $scope.startDate);

            })

            /**Load calendar**/
            $scope.calDisplay = false;

            /*** function for action on click of post shows on caledner */
            $scope.alertOnEventClick = function (dataCamp, jsEvent, view) {
                $scope.alertCampaign = {};
                $scope.alertCampaign.campData = {
                    'title': dataCamp.title
                };
                var startTimeStamp;
                var dayLastTimeStamp;
                if (dataCamp.start._d.toDateString() == (new Date()).toDateString()) {
                    startTimeStamp = helperFactory.convertToTimeStamp(helperFactory.getDateValue(0));
                    dayLastTimeStamp = helperFactory.getCurrentTimeStamp() * 1000;
                } else {
                    var finalday = dataCamp.start._d.getFullYear() + "-" + (dataCamp.start._d.getMonth() + 1) + "-" + dataCamp.start._d.getDate();
                    startTimeStamp = helperFactory.getTimeStamp(finalday);
                    dayLastTimeStamp = startTimeStamp + (24 * 60 * 60 * 1000);
                }

                var params = {
                    'action': API_PATH + 'post_postSchedule_startDate_' + startTimeStamp + '_endDate_' + dayLastTimeStamp + '_status_true',
                    'q': 'campaignId:' + dataCamp.id,
                    'page': 0,
                    'size': 10000
                };


                httpServices.getRequest(API_URL, params).then(function (data) {
                    if (data.status == 200 && !helperFactory.isEmpty(data.data)) {
                        $scope.alertCampaign.postData = data.data;
                        $('#campaignPreview').modal('show');
                    } else {
                        $scope.errorMsgLogin = '';
                    }

                }).catch(function (error) {
                    $scope.errorMsgLogin = 'Server error.';
                });

            };

            /*** function that will update calender */
            function loadCalendar(eventArray) {
                jQuery(document).find('#calendarDiv').fullCalendar({
                    header: {
                        left: 'prev, next today',
                        center: 'title',
                        right: 'month'
                    },
                    navLinks: true,
                    businessHours: true,
                    editable: true,
                    displayEventTime: false,
                    events: eventArray,
                    eventLimit: 3,
                    eventStartEditable: false,
                    eventClick: $scope.alertOnEventClick,
                    defaultView: 'month',
                    defaultDate: new Date(),
                    eventRender: function (event, element) {
                        if (event.icon) {
                            element.append(" No of post: " + event.postCount + " ");
                        }
                    }
                });
                jQuery(document).find('#calendarDiv').fullCalendar('refresh');

            }
        }).controller('reviewApproveController', function ($scope, $location, localstorage, helperFactory, httpServices, $state, securityGroups, outreachHelper, menuFactory) {

            if (!helperFactory.isLoggedIn()) {
                $state.go('login');
                return false;
            }
			var d = new Date();
			var n = d.getTimezoneOffset();
			$scope.getCurrentZoneDiff = n*60*1000;
			
            $scope.allFrequency = ALL_FREQUENCY;

            /**
             *  function to get handler image
             */
            $scope.getHandleImage = function (handleObject, plateForm) {
                var _arr = [];
                angular.forEach(handleObject, function (value, key) {
                    if (value.socialPlatform.name.toLowerCase() == plateForm) {
                        _arr.push(value);
                    }

                });
                if (_arr.length > 0) {
                    if (typeof _arr[0].accessToken.profileImage != 'undefined' && _arr[0].accessToken.profileImage != null) {
                        return _arr[0].accessToken.profileImage;
                    } else {
                        return false;
                    }
                }
            }

            /**
             *  function to get handler name
             */
            $scope.getHandleName = function (handleObject, plateForm) {
                var _arr = [];
                angular.forEach(handleObject, function (value, key) {
                    if (value.socialPlatform.name.toLowerCase() == plateForm) {
                        _arr.push(value);
                    }

                });
                if (_arr.length > 0) {
                    if (typeof _arr[0].accessToken.fullName != 'undefined' && _arr[0].accessToken.fullName != null) {
                        return _arr[0].accessToken.fullName;
                    } else {
                        return false;
                    }
                }
            }

            /**
             *  function to get handler data
             */
            $scope.getHandlesData = function (handleObject, plateForm) {
                var _arr = [];
                if (!helperFactory.isEmpty(handleObject)) {
                    angular.forEach(handleObject, function (value, key) {
                        if (value.socialPlatform.name.toLowerCase() == plateForm) {
                            _arr.push(value);
                        }
                    })
                    if (_arr.length > 0) {
                        return _arr.accessToken;
                    }
                }
            }

            $scope.$emit('menuItem', menuFactory.getMenuItems($scope));
            $scope.$emit('pageTitle', "Review & Approve");
            $scope.$emit('getHeader', true);
            $scope.$emit('getSidebar', true);
            $scope.$emit('getFooter', true);
            $scope.$emit('titleSection', true);

            /*securityGroups.socialPlatformAction($scope);*/
            if (typeof localstorage.get('taskApprovalData') == 'undefined' || localstorage.get('taskApprovalData') == 'undefined') {
                $state.go('tasks');
                return false;
            } else {
                var taskForApp = JSON.parse(localstorage.get('taskApprovalData'));
            }
            if (helperFactory.isEmpty(taskForApp) || helperFactory.isEmpty(taskForApp.id)) {
                $state.go('tasks');
            }
            $scope.postCommentArea = "";

            /**
             *  function to get task detail by its id
             */
            var allTaskParam = {
                'action': API_PATH + 'task_' + taskForApp.id
            };
            httpServices.getRequest(API_URL, allTaskParam).then(function (data) {
                if (data.status == 200 && !helperFactory.isEmpty(data.data)) {
                    $scope.currentTaskData = data.data;
                    $scope.currentPostData = data.data.post;
                    $scope.currentTaskStatus = data.data.post.status;
                    /**
                    *  function to get latest post comment of task
                    */
                    var campParam = {
                        'action': API_PATH + 'campaign_' + $scope.currentTaskData.campaignId
                    }
                    httpServices.getRequest(API_URL, campParam).then(function (camp) {
                        if (camp.data) {
                            $scope.currentTaskData.campaignData = camp.data;
                        } else {
                            $scope.currentTaskData.campaignData = {
                                'hashtags': ['NA']
                            };
                        }
                    })
                    $scope.currentTaskData.audience = [];
                    securityGroups.platformUniqueAction($scope.currentTaskData.post);

                    if (!helperFactory.isEmpty($scope.currentTaskData.post)) {
                        var commentParam = {
                            'action': API_PATH + 'post-comment_post_' + $scope.currentTaskData.post.id
                        }
                        httpServices.getRequest(API_URL, commentParam).then(function (postCmt) {
                            if (!helperFactory.isEmpty(postCmt.data)) {
                                $scope.postCommentArea = postCmt.data[0].description;
                            } else { }
                        })

                        angular.forEach($scope.currentTaskData.post.audiences, function (aud) {
                            var audParam = {
                                'action': API_PATH + 'audience-types_' + aud
                            }
                            httpServices.getRequest(API_URL, audParam).then(function (audience) {
                                $scope.currentTaskData.audience.push(audience.data);
                            })

                        })
                    }
                    $scope.scheduleData = [];
                    if (!helperFactory.isEmpty($scope.currentTaskData.post)) {
                        angular.forEach($scope.currentTaskData.post.postScheduleRequests, function (sch) {
                            var schInsert = {};
                            angular.forEach($scope.currentTaskData.post.platformUniqueList, function (opt) {
                                if (opt.id == sch.platformId) {
                                    schInsert.platform = opt.name;
                                }
                            })
                            if (schInsert.platform) {
                                angular.forEach($scope.allFrequency, function (freq) {
                                    if (freq.id == sch.frequencyCode) {
                                        schInsert.frequency = freq.frequency;
                                        schInsert.frequencyCode = freq.frequencyCode;
                                    }
                                })
                                schInsert.timeArr = []
                                angular.forEach(sch.scheduleTime, function (st) {
                                    var mydate = new Date(st.startTime);
                                    var se = {};
                                    se.startTime = helperFactory.convertToTimeStamp(st.startTime);
                                    if (!helperFactory.isEmpty(st.endTime)) {
                                        se.endTime = helperFactory.convertToTimeStamp(st.endTime);
                                    }
                                    schInsert.timeArr.push(se);
                                })
                                $scope.scheduleData.push(schInsert)
                            }
                        })

                    }
                } else { }
            }).catch(function (error) {
                $scope.errorMsgLogin = 'Server error.';
            });

            $scope.approveAndPublish = function (taskStatus) {
                $scope.currentTaskData.post.status = taskStatus;

                $scope.currentTaskData.post.updatedBy = helperFactory.getLoggedInUserId();
                var postUpParams = {
                    'action': API_PATH + "post_" + $scope.currentTaskData.post.id + "_activate",
                    'myparam': $scope.currentTaskData.post,
                };
                postUpParams.myparam.taskId = taskForApp.id;

                httpServices.postRequest(API_URL, postUpParams).then(function (upData) {
                    if (upData.status == 200 && !helperFactory.isEmpty(upData.data)) {

                        var postCommentParam = {
                            'action': API_PATH + "post-comment",
                            'myparam': {
                                'postId': $scope.currentTaskData.post.id,
                                'description': $scope.postCommentArea,
                                'createdBy': helperFactory.getLoggedInUserId(),
                                'createdByName': localstorage.get('currentUserName'),
                                'userId': helperFactory.getLoggedInUserId(),
                            },
                        };
                        httpServices.postRequest(API_URL, postCommentParam).then(function (data) {
                            if (data.status == 200 && !helperFactory.isEmpty(data.data)) { } else { }
                        }).catch(function (error) {
                            $scope.errorMsgLogin = 'Server error.';
                        });

                        $state.go('tasks');
                        helperFactory.successMessage(upData.message);
                        $scope.success = true;
                    } else {
                        helperFactory.errorMessage(upData.message);
                        $scope.success = false;
                    }
                }).catch(function (error) {
                    $scope.draftSuccessMsg = "Error in updating tsak.";
                    helperFactory.errorMessage($scope.draftSuccessMsg);
                    $scope.success = false;
                });

            }

            /*@Edit Draft Function*/
            $scope.editPost = function (editPost) {

                localstorage.setObject("currentPost", editPost);
                localstorage.set("isPostEdit", true);
                $state.go('composePost', {
                    'clear': false
                });

            }
        }).controller('postReviewApproveController', function ($scope, $location, localstorage, helperFactory, httpServices, $state, securityGroups, outreachHelper, menuFactory) {

            if (!helperFactory.isLoggedIn()) {
                $state.go('login');
                return false;
            }
            $scope.getHandleImage = function (handleObject, plateForm) {
                var _arr = [];
                angular.forEach(handleObject, function (value, key) {
                    if (value.socialPlatform.name.toLowerCase() == plateForm) {
                        _arr.push(value);
                    }

                });
                if (_arr.length > 0) {
                    if (typeof _arr[0].accessToken.profileImage != 'undefined' && _arr[0].accessToken.profileImage != null) {
                        return _arr[0].accessToken.profileImage;
                    } else {
                        return false;
                    }
                }
            }
            $scope.getHandleName = function (handleObject, plateForm) {
                var _arr = [];
                angular.forEach(handleObject, function (value, key) {
                    if (value.socialPlatform.name.toLowerCase() == plateForm) {
                        _arr.push(value);
                    }

                });
                if (_arr.length > 0) {
                    if (typeof _arr[0].accessToken.fullName != 'undefined' && _arr[0].accessToken.fullName != null) {
                        return _arr[0].accessToken.fullName;
                    } else {
                        return false;
                    }
                }
            }
            $scope.getHandlesData = function (handleObject, plateForm) {
                var _arr = [];
                if (!helperFactory.isEmpty(handleObject)) {
                    angular.forEach(handleObject, function (value, key) {
                        if (value.socialPlatform.name.toLowerCase() == plateForm) {
                            _arr.push(value);
                        }
                    })
                    if (_arr.length > 0) {
                        return _arr.accessToken;
                    }
                }
            }
            $scope.allFrequency = ALL_FREQUENCY;

            $scope.$emit('menuItem', menuFactory.getMenuItems($scope));
            $scope.$emit('pageTitle', "Post Detail");
            $scope.$emit('getHeader', true);
            $scope.$emit('getSidebar', true);
            $scope.$emit('getFooter', true);
            $scope.$emit('titleSection', true);
            /*securityGroups.socialPlatformAction($scope);*/
            if (typeof localstorage.get('postApprovalData') == 'undefined' || localstorage.get('postApprovalData') == 'undefined') {
                $state.go('draft');
                return false;
            }
            var taskForApp = JSON.parse(localstorage.get('postApprovalData'));
            if (helperFactory.isEmpty(taskForApp) || helperFactory.isEmpty(taskForApp.id)) {
                $state.go('draft');
            }
            var allTaskParam = {
                'action': API_PATH + 'post_' + taskForApp.id
            };

            httpServices.getRequest(API_URL, allTaskParam).then(function (data) {
                if (data.status == 200 && !helperFactory.isEmpty(data.data)) {
                    $scope.currentTaskData = data.data;
                    var commentParam = {
                        'action': API_PATH + 'post-comment_post_' + $scope.currentTaskData.id
                    }
                    httpServices.getRequest(API_URL, commentParam).then(function (postCmt) {
                        if (!helperFactory.isEmpty(postCmt.data)) {
                            $scope.postCommentArea = postCmt.data[0].description;
                        } else { }
                    })


                    var campParam = {
                        'action': API_PATH + 'campaign_' + $scope.currentTaskData.campaignId
                    }
                    httpServices.getRequest(API_URL, campParam).then(function (camp) {
                        if (camp.data) {
                            $scope.currentTaskData.campaignData = camp.data;
                        } else {
                            $scope.currentTaskData.campaignData = {
                                'hashtags': ['NA']
                            };
                        }
                    })
                    $scope.currentTaskData.audience = [];
                    securityGroups.platformUniqueAction($scope.currentTaskData);

                    if (!helperFactory.isEmpty($scope.currentTaskData.post)) {
                        angular.forEach($scope.currentTaskData.post.audiences, function (aud) {
                            var audParam = {
                                'action': API_PATH + 'audience-types_' + aud
                            }
                            httpServices.getRequest(API_URL, audParam).then(function (audience) {
                                $scope.currentTaskData.audience.push(audience.data);
                            })

                        })
                    }
                    $scope.scheduleData = [];
                    if (!helperFactory.isEmpty($scope.currentTaskData)) {
                        angular.forEach($scope.currentTaskData.postScheduleRequests, function (sch) {
                            var schInsert = {};
                            angular.forEach($scope.currentTaskData.platformUniqueList, function (opt) {
                                if (opt.id == sch.platformId) {
                                    schInsert.platform = opt.name;
                                }
                            })
                            if (schInsert.platform) {
                                angular.forEach($scope.allFrequency, function (freq) {
                                    if (freq.id == sch.frequencyCode) {
                                        schInsert.frequency = freq.frequency;
                                        schInsert.frequencyCode = freq.frequencyCode;
                                    }
                                })
                                schInsert.timeArr = []
                                angular.forEach(sch.scheduleTime, function (st) {
                                    var mydate = new Date(st.startTime);
                                    var se = {};
                                    se.startTime = helperFactory.convertToTimeStamp(st.startTime);
                                    if (!helperFactory.isEmpty(st.endTime)) {
                                        se.endTime = helperFactory.convertToTimeStamp(st.endTime);
                                    }
                                    schInsert.timeArr.push(se);
                                })
                                $scope.scheduleData.push(schInsert)
                            }
                        })

                    }
                } else { }
            }).catch(function (error) {
                $scope.errorMsgLogin = 'Server error.';
            });


            $scope.approveAndPublish = function (taskStatus) {
                $scope.currentTaskData.status = taskStatus;
                $scope.currentTaskData.updatedBy = helperFactory.getLoggedInUserId();
                var postUpParams = {
                    'action': API_PATH + "post_" + $scope.currentTaskData.id + "_activate",
                    'myparam': $scope.currentTaskData,
                };
                postUpParams.myparam.taskId = taskForApp.id;
                httpServices.postRequest(API_URL, postUpParams).then(function (upData) {
                    if (upData.status == 200 && !helperFactory.isEmpty(upData.data)) {
                        $state.go('draft');
                        helperFactory.successMessage(upData.message);
                        $scope.success = true;
                    } else {
                        Rejected
                        helperFactory.errorMessage(upData.message);
                        $scope.success = false;
                    }
                }).catch(function (error) {
                    $scope.draftSuccessMsg = "Error in updating tsak.";
                    helperFactory.errorMessage($scope.draftSuccessMsg);
                    $scope.success = false;
                });

            }
        }).controller('scheduledController', function ($timeout, $rootScope, $scope, $location, localstorage, helperFactory, $state, httpServices, userHelper, outreachHelper, rolesHelper, menuFactory, securityGroups) {

            if (!helperFactory.isLoggedIn()) {
                $state.go('login');
                return false;
            }
            $scope.addLocalTimeStamp = -((new Date()).getTimezoneOffset() * 60 * 1000);
            console.log('addLocalTimeStamp: ', $scope.addLocalTimeStamp);    
            
            $scope.configScroll = SCROLL_CONFIG;

            $scope.$emit('menuItem', menuFactory.getMenuItems($scope));
            $scope.$emit('pageTitle', "Scheduled");
            $scope.$emit('getHeader', true);
            $scope.$emit('getSidebar', true);
            $scope.$emit('getFooter', true);
            $scope.$emit('titleSection', true);
            $scope.showButtons = false;

            var canViewScheduled = rolesHelper.canView('POST_SCHEDULE_FILTER_BY_DATE_RANGE_STATUS_BY_CALENDAR') && rolesHelper.canView('FETCH_ALL_EVENTS');
            if (!canViewScheduled) {
                $state.go('summary');
            }
            $scope.startDate = Date.parse(helperFactory.getFirstLstDate().firstDay);
            $scope.endDate = Date.parse(helperFactory.getFirstLstDate().lastDay) + (86400 - 1) * 1000;
            $scope.defaultDate = new Date();
            var today = new Date();
            $scope.minDate = today;

            $scope.defaultView = 'month';

            if (userHelper.isAdmin()) {
                $scope.isAdmin = true;
                $scope.extraSettings = SINGLE_CLIENT_DROPDOWN;
                $scope.selectedClient = [];
                outreachHelper.getClient($scope, httpServices, helperFactory, localstorage);
                $scope.clientId = "";
            } else {
                $scope.clientId = localstorage.get('clientId');
                getCampaignByClientId($scope.clientId);
            }
            securityGroups.socialPlatformAction($scope);

            /**Get campaign by client id**/
            function getCampaignByClientId(clientId) {
                $scope.campaign = [];
                var params = {
                    'action': API_PATH + 'campaign_client_' + clientId,
                    'q': 'status:1'
                };
                httpServices.getRequest(API_URL, params).then(function (data) {
                    if (data.status == 200 && !helperFactory.isEmpty(data.data)) {
                        angular.forEach(data.data, function (camp) {
                            var campObj = {};
                            campObj.id = camp.id;
                            campObj.title = camp.title;
                            campObj.is = camp.title;
                            $scope.campaign.push(campObj);
                        });
                    } else {
                        $scope.campaign = [];
                    }
                }).catch(function (error) {
                    $scope.errorMsg = 'Server error.';
                });

            }
            $scope.changeClient = function () {
                $scope.clientId = $scope.selectedClient[0].id;
                $('#calendarDiv').fullCalendar('destroy');
                getScheduledPost($scope.endDate, helperFactory.getCurrentTimeStamp() * 1000);
                getEvents($scope.startDate, $scope.endDate, $scope.defaultDate, $scope.defaultView);
                getCampaignByClientId($scope.clientId);
            }
            $scope.onDeselectClient = function () {
                $scope.clientId = null;
                $('#calendarDiv').fullCalendar('destroy');
                getEvents($scope.startDate, $scope.endDate, $scope.defaultDate, $scope.defaultView);
                $scope.campaign = [];
                getScheduledPost($scope.endDate, helperFactory.getCurrentTimeStamp() * 1000);
            }

            $scope.alertOnEventClick = function (dataCamp, jsEvent, view) {
                if (dataCamp.isEvent) {
                    var getStartDate = helperFactory.getTimeStamp(dataCamp.start._d);
                    var getEndDate = parseInt(getStartDate) + parseInt(86400000);
                    $state.go('event', {
                        'startDate': getStartDate,
                        'endDate': getEndDate
                    });
                } else {
                    $scope.alertCampaign = {};
                    $scope.alertCampaign.campData = {
                        'title': dataCamp.title
                    };
                    var startTimeStamp;
                    var dayLastTimeStamp;
                    if (dataCamp.start._d.toDateString() == (new Date()).toDateString()) {
                        startTimeStamp = helperFactory.getCurrentTimeStamp() * 1000;
                        dayLastTimeStamp = helperFactory.convertToTimeStamp(helperFactory.getDateValue(1));
                    } else {
                        var finalday = dataCamp.start._d.getFullYear() + "-" + (dataCamp.start._d.getMonth() + 1) + "-" + dataCamp.start._d.getDate();
                        startTimeStamp = helperFactory.getTimeStamp(finalday);
                        dayLastTimeStamp = startTimeStamp + ((24 * 60 * 60 - 1) * 1000);
                    }

                    var params = {
                        'action': API_PATH + 'post_postSchedule_startDate_' + startTimeStamp + '_endDate_' + dayLastTimeStamp + '_status_false',
                        'q': 'campaignId:' + dataCamp.id,
                        'page': 0,
                        'size': 10000
                    };

                    /* if(!helperFactory.isEmpty(dataCamp.id)){
                         params.q='campaignId:' + dataCamp.id;
                     }*/

                    httpServices.getRequest(API_URL, params).then(function (data) {
                        if (data.status == 200 && !helperFactory.isEmpty(data.data)) {
                            $scope.alertCampaign.postData = data.data;
                            $timeout(function dooo() {
                                $('#campaignPreview').modal('show');
                            }, 300);
                        } else {
                            $scope.errorMsgLogin = '';
                        }

                    }).catch(function (error) {
                        $scope.errorMsgLogin = 'Server error.';
                    });

                }

            };

            $scope.getPostDetail = function (postclick) {
                $('#campaignPreview').modal('hide');
                $timeout(function dooo() {
                    sessionStorage.postSelectedId = postclick.id;
                    $state.go('postDetail');
                }, 200);
            }

            /**Get post by post id*/
            $scope.getPostDetails = function (post, index) {
                angular.element("#allPost ul li").removeClass("active");
                angular.element("#post" + index).addClass("active");
                var postText = post;
                if (postText != null) {
                    $scope.postContent = postText;
                    console.log($scope.postContent)
                } else {
                    $scope.postContent = "No Content available";
                }
            }

            function getEvents(startDate, endDate, defaultDate, defaultView) {
                var eventArray = [];
                var clientId = $scope.clientId;
                var currentTimeStamp;
                if ($scope.defaultView == "month") {
                    currentTimeStamp = helperFactory.getCurrentTimeStamp() * 1000;
                } else {
                    currentTimeStamp = startDate;
                }
                var params = {
                    'action': API_PATH + "post_postSchedule_startDate_" + currentTimeStamp + "_endDate_" + endDate + "_status_false_calander",
                };
                if (!helperFactory.isEmpty(clientId)) {
                    params.q = 'clientId:' + clientId
                }

                if (!userHelper.isClientAdmin() && !userHelper.isAdmin()) {
                    params.q = 'clientId:' + clientId + ';createdBy:' + helperFactory.getLoggedInUserId()
                }

                httpServices.getRequest(API_URL, params).then(function (data) {
                    if (data.status == 200) {
                        if (!helperFactory.isEmpty(data.data)) {
                            angular.forEach(data.data, function (eve) {
                                var cData = {};
                                cData.id = eve.campaignId;
                                cData.title = eve.campaignName;
                                /*cData.desc = eve.description;*/
                                cData.icon = "twitter";
                                cData.postCount = eve.countPost;
                                cData.start = new Date(eve.createDate + $scope.addLocalTimeStamp);
                                cData.isEvent = false;
                                cData.color = '#5cb85c'
                                eventArray.push(cData);

                            });
                        }
                        /**
                         * events all from event scheduler list append in existing eventArray variable
                         */
                        var eParam = {
                            'action': API_PATH + "event_all",
                            'sortingOrder': 'ASC',
                            'q': 'status:1;startDate:' + startDate + ',gte,' + endDate + ',lte!true&page=0&size=200'
                        }
                        if (!helperFactory.isEmpty(clientId)) {
                            eParam.q = 'status:1;clientId:' + clientId + ';startDate:' + startDate + ',gte,' + endDate + ',lte!true&page=0&size=200'
                        }

                        httpServices.getRequest(API_URL, eParam).then(function (edata) {
                            if (data.status == 200) {
                                if (!helperFactory.isEmpty(edata.data)) {
                                    angular.forEach(edata.data, function (eve, k) {
                                        var cData = {};
                                        cData.id = eve.id;
                                        cData.title = eve.eventName;
                                        cData.start = new Date(eve.startDate + $scope.addLocalTimeStamp);
                                        cData.isEvent = true;
                                        cData.color = '#1195ce';
                                        eventArray.push(cData);
                                    });
                                }
                                /*$('#calendarDiv').fullCalendar('destroy');*/

                                loadCalendar(defaultDate, eventArray, defaultView);

                                $scope.showButtons = true;
                            }
                        }).catch(function (error) {
                            $scope.errorMsgLogin = 'Server error.';
                        });

                    }
                }).catch(function (error) {

                });
            }
            function getScheduledPost(endDate, startDate) {
                console.log(endDate, startDate, ' ferfcer ');
                $scope.showLoader = false;
                var eventArray = [];
                var params;
                if ($scope.clientId != undefined && $scope.clientId != "") {
                    params = {
                        'action': API_PATH + 'post_postSchedule_startDate_' + startDate + '_endDate_' + endDate + '_status_false',
                        'q': 'clientId:' + $scope.clientId
                    };
                } else {
                    params = {
                        'action': API_PATH + 'post_postSchedule_startDate_' + startDate + '_endDate_' + endDate + '_status_false'
                    };
                }
                if (!helperFactory.isEmpty($scope.clientId) && !helperFactory.isEmpty($scope.camapignId)) {
                    params.q = 'clientId:' + $scope.clientId + ';campaignId:' + $scope.camapignId
                }

                if (!helperFactory.isEmpty($scope.pubPlatform)) {
                    if (params.hasOwnProperty('q')) {
                        params.q += ";";
                    } else {
                        params.q = "";

                    }
                    params.q += 'platform.id:' + $scope.pubPlatform.id;
                }

                httpServices.getRequest(API_URL, params).then(function (data) {
                    $timeout(function dooo() {
                        $scope.showLoader = true;
                    }, 300);

                    if (data.status == 200 && !helperFactory.isEmpty(data.data)) {
                        $scope.camapignId = null;
                        $scope.publishedPost = [];

                        if (!helperFactory.isEmpty(data.data)) {
                            var keepGoing = true;
                            angular.forEach(data.data, function (pc) {
                                if (pc.active) {
                                    $scope.publishedPost.push(pc);
                                    if (keepGoing && pc.post != null) {
                                        $scope.postContent = pc;
                                        keepGoing = false;
                                    }
                                }
                            })
                        } else {
                            $scope.postContent = "No Content available";
                        }
                        $scope.dataAvail = true;
                    } else {
                        $scope.postContent = "No Content available";
                        $scope.dataAvail = false;
                    }
                    $roots.isDateFormOpen = false;
                    $scope.openCalendar = false;

                }).catch(function (error) {
                    $scope.errorMsg = 'Server error.';
                    $scope.isDateFormOpen = false;
                    $scope.openCalendar = false;
                });
                var v = $scope.pubPlatform || $scope.fStartDate || $scope.fEndDate || $scope.selectedCampaign;
                if (typeof v != 'undefined' && v) {
                    $scope.showResetButton = true;
                } else {
                    $scope.showResetButton = false;
                }

            }

            getEvents($scope.startDate, $scope.endDate, $scope.defaultDate, $scope.defaultView);
            $scope.changeCampaign = function (data) {
                if (data != undefined) {
                    $scope.camapignId = data.id;
                    getScheduledPost($scope.endDate, helperFactory.getCurrentTimeStamp() * 1000);
                } else {
                    $scope.camapignId = "";
                }
            }
            $scope.filterPubPost = function (platformGot) {
                getScheduledPost($scope.endDate, $scope.startDate);
            }
            getScheduledPost($scope.endDate, helperFactory.getCurrentTimeStamp() * 1000);

            $scope.filterPostByDate = function (formName, reload) {
                if (formName.$valid) {
                    $scope.startDate = helperFactory.getTimeStamp($scope.fStartDate);
                    $scope.endDate = helperFactory.getTimeStamp($scope.fEndDate);
                    getScheduledPost($scope.startDate, $scope.endDate);
                }
            }

            $scope.resetForm = function (formName) {
                formName.reset();
            }
            jQuery('#resetIt').on('click', function (e) {
                $scope.publishedPost = null;

                jQuery('#resetHidden').click();
                jQuery('#resetHiddenCal').click();
                var today = new Date();
                $scope.minDate = today;
                $scope.startDate = Date.parse(helperFactory.getFirstLstDate().firstDay);
                $scope.endDate = Date.parse(helperFactory.getFirstLstDate().lastDay) + (86400 - 1) * 1000;
                getScheduledPost($scope.endDate, helperFactory.getCurrentTimeStamp() * 1000);
            })

            $scope.nextMonth = function () {
                $('#calendarDiv').fullCalendar('next');

                var isMonthTab = $("#calendarDiv .fc-right .fc-button-group .fc-month-button").hasClass('fc-state-active');
                var isWeekTab = $("#calendarDiv .fc-right .fc-button-group .fc-agendaWeek-button").hasClass('fc-state-active');
                if (isMonthTab) {
                    $scope.defaultView = 'month';
                } else if (isWeekTab) {
                    $scope.defaultView = 'agendaWeek';
                } else {
                    $scope.defaultView = 'month';
                }

                var getdate = $('#calendarDiv').fullCalendar('getDate');

                var changeToTimestamp = new Date(helperFactory.getTimeStamp(getdate));
                var startDate = new Date(changeToTimestamp.getFullYear(), changeToTimestamp.getMonth(), 1);

                var date = new Date(helperFactory.getTimeStamp(startDate));
                var endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);



                getEvents(Date.parse(startDate), Date.parse(endDate), startDate, $scope.defaultView);
            }

            $scope.prevMonth = function () {
                $('#calendarDiv').fullCalendar('prev');
                var isMonthTab = $("#calendarDiv .fc-right .fc-button-group .fc-month-button").hasClass('fc-state-active');
                var isWeekTab = $("#calendarDiv .fc-right .fc-button-group .fc-agendaWeek-button").hasClass('fc-state-active');
                if (isMonthTab) {
                    $scope.defaultView = 'month';
                } else if (isWeekTab) {
                    $scope.defaultView = 'agendaWeek';
                } else {
                    $scope.defaultView = 'month';
                }



                var getdate = $('#calendarDiv').fullCalendar('getDate');

                var changeToTimestamp = new Date(helperFactory.getTimeStamp(getdate));
                var startDate = new Date(changeToTimestamp.getFullYear(), changeToTimestamp.getMonth(), 1);

                var date = new Date(helperFactory.getTimeStamp(startDate));
                var endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

                getEvents(Date.parse(startDate), Date.parse(endDate), startDate, $scope.defaultView);
            }

            $scope.today = function () {
                var isMonthTab = $("#calendarDiv .fc-right .fc-button-group .fc-month-button").hasClass('fc-state-active');
                var isWeekTab = $("#calendarDiv .fc-right .fc-button-group .fc-agendaWeek-button").hasClass('fc-state-active');
                if (isMonthTab) {
                    $scope.defaultView = 'month';
                } else if (isWeekTab) {
                    $scope.defaultView = 'agendaWeek';
                } else {
                    $scope.defaultView = 'month';
                }

                $('#calendarDiv').fullCalendar('today');

                $scope.startDate = Date.parse(helperFactory.getFirstLstDate().firstDay);
                $scope.endDate = Date.parse(helperFactory.getFirstLstDate().lastDay) + (86400 - 1) * 1000;
                $scope.defaultDate = new Date();

                getEvents($scope.startDate, $scope.endDate, $scope.defaultDate, $scope.defaultView);
            }


            function loadCalendar(defaultDate, eventArray, defaultView) {
                console.log(defaultDate, eventArray, defaultView)
                $('#calendarDiv').fullCalendar({

                    header: {
                        left: '',
                        center: 'title',
                        right: 'month,agendaWeek'
                    },
                    defaultDate: defaultDate,
                    scrollTime: "00:00:00",
                    displayEventTime: false,
                    navLinks: true,
                    businessHours: true,
                    editable: true,
                    events: eventArray,
                    eventLimit: 3,
                    eventStartEditable: false,
                    defaultView: defaultView,
                    eventClick: $scope.alertOnEventClick,
                    height: 500,
                    eventRender: function (event, element) {
                        if (event.icon) {
                            element.append(" No of post: " + event.postCount + " ");
                        }
                    }
                });
            }

        })
        .controller('draftController', function ($scope, $location, localstorage,
            helperFactory, $state, httpServices, pagination, securityGroups,
            userHelper, outreachHelper, rolesHelper, menuFactory) {
            $scope.addLocalTimeStamp = -((new Date()).getTimezoneOffset() * 60 * 1000);
            if (!helperFactory.isLoggedIn()) {
                $state.go('login');
                return false;
            }
            $scope.authorOpt = [];
            $scope.se = {};
            $scope.selectedAuthor = [];
            $scope.extraMultiSettings = MULTIPLE_DROPDOWN_SETTING;
            $scope.teamMembers = [];
            $scope.clientDropdown = false;
            $scope.clientId = helperFactory.getLoggedInUserClientId();
            var canViewDraft = rolesHelper.canView('GET_DRAFT_POST_BY_CLIENT');
            if (!canViewDraft) {
                $state.go('summary');
            }
            $scope.canDeleteDraft = rolesHelper.canDelete('DELETE_POST_BY_ID');
            $scope.canEditDraft = rolesHelper.canEdit('MANAGE_POST') && rolesHelper.canView('GET_BRAND_FOR_CLIENT') && rolesHelper.canView('GET_CAMPAIGN_BY_CLIENT') && rolesHelper.canView('GET_SOCIAL_HANDLER_BY_CLIENT_PLATFORM_ID');
            if (userHelper.isAdmin()) {
                $scope.canEditDraft = true;
            }
            $scope.$emit('menuItem', menuFactory.getMenuItems($scope));
            $scope.$emit('pageTitle', "Drafts");
            $scope.$emit('getHeader', true);
            $scope.$emit('getSidebar', true);
            $scope.$emit('getFooter', true);
            $scope.$emit('titleSection', true);

            $scope.sorting = {
                attribute: 'createdDate',
                direction: 'desc'
            };

            $scope.dir = 'desc';
            $scope.textSort = {
                attribute: 'text',
                dir: 'desc'
            };
            $scope.statusSort = {
                attribute: 'statusClass.tag',
                dir: 'desc'
            };
            $scope.sortBy = function (sortingData) {
                var _dir = (sortingData.dir == 'desc') ? 'desc' : 'asc';
                $scope.sorting = {
                    attribute: sortingData.attribute,
                    direction: _dir
                }
                $scope.getDraftView(0);
                sortingData.dir = (sortingData.dir == 'desc') ? 'asc' : 'desc';
            }

            securityGroups.clientUserAction($scope);
            securityGroups.socialPlatformAction($scope);

            $scope.deleteRecord = function (data) {
                $scope.recordData = data;
            }

            $scope.deleteActionData = function (draft) {
                var params = {
                    'action': API_PATH + "post_" + draft.id + "_" + helperFactory.getLoggedInUserId()
                };
                httpServices.deleteRequest(API_URL + '/delete', params).then(function (data) {
                    if (data.status == 200) {
                        $scope.getDraftView(0);
                        jQuery('.btn-cancel').click();
                        helperFactory.successMessage(data.message);
                    } else {
                        $scope.errorMsgLogin = '';
                    }
                }).catch(function (error) {
                    $scope.errorMsgLogin = 'Server error.';
                });
            }

            $scope.dx = [];

            function getAuthorList(authorParam) {
                httpServices.getRequest(API_URL, authorParam).then(function (data) {
                    $scope.authorOpt = [];
                    if (data.status == 200) {
                        angular.forEach(data.data, function (auth) {
                            auth.label = auth.firstName + " " + auth.lastName;
                            $scope.authorOpt.push(auth);
                        })
                    } else {
                        $scope.errorMsgLogin = '';
                    }

                }).catch(function (error) {
                    $scope.errorMsgLogin = 'Server error.';
                });
            }

            if (userHelper.isAdmin()) {
                outreachHelper.getClient($scope, httpServices, helperFactory, localstorage);
                $scope.clientDropdown = true;
                $scope.isAdmin = true;
                $scope.draftParams = {
                    'action': API_PATH + "post_all",
                    'q': 'status:4,6,8,25',
                    'size': 10,
                }
                $scope.selectedClient = [];
                $scope.extraSettings = SINGLE_CLIENT_DROPDOWN;
                var authParam = {
                    'action': API_PATH + 'user_all'
                };
                getAuthorList(authParam);

            } else {
                $scope.isAdmin = false;

                $scope.draftParams = {
                    'action': API_PATH + "post_get_client_" + $scope.clientId,
                    'q': 'status:4,6,8,25;createdBy:' + helperFactory.getLoggedInUserId(),
                    'size': 10,
                }
                if (userHelper.isClientAdmin()) {
                    $scope.draftParams.q = 'status:4,6,8,25;';
                }
                var authParam = {
                    'action': API_PATH + 'user_client_' + $scope.clientId
                };
                getAuthorList(authParam);
            }

            $scope.filterDrafts = function () {
                $scope.draftParams.q = "status:4,6,8,25";
                if (!helperFactory.isEmpty($scope.postStatus)) {
                    $scope.draftParams.q = "status:" + $scope.postStatus;
                }
                if (!helperFactory.isEmpty($scope.draftPlatform)) {
                    $scope.draftParams.q += ';postScheduleRequests.platformId:' + $scope.draftPlatform.id;
                }
                if ($scope.selectedAuthor.length != 0) {
                    var authorIds = '';
                    angular.forEach($scope.selectedAuthor, function (author, key) {
                        if (key == 0) {
                            authorIds = author.id;
                        } else {
                            authorIds += ',' + author.id;
                        }
                    })
                    $scope.draftParams.q += ';createdBy:' + authorIds;
                }
                if ($scope.startDate != undefined && $scope.startDate != null) {
                    $scope.draftParams.q += ';createdDate:' + helperFactory.getTimeStamp($scope.startDate) + ',gte';
                    if ($scope.endDate != undefined && $scope.endDate != null) {
                        $scope.draftParams.q += ',' + (helperFactory.getTimeStamp($scope.endDate) + (86400 - 1) * 1000) + ',lte!true';
                    } else {
                        $scope.draftParams.q += ',' + helperFactory.getTimeStamp($scope.startDate) + ',lte!true';
                    }

                }
                if (!userHelper.isClientAdmin() && !userHelper.isAdmin()) {
                    $scope.draftParams.q += ';createdBy:' + helperFactory.getLoggedInUserId();
                }
                $scope.getDraftView(0);
            }

            $scope.getDraftView = function (page) {
                $scope.page = page;
                $scope.draftParams.page = page;
                $scope.draftParams.sort = $scope.sorting.attribute + ',' + $scope.sorting.direction;
                httpServices.getRequest(API_URL, $scope.draftParams).then(function (data) {
                    if (data.status == 200 && data.data && data.data.length > 0) {
                        $scope.draftPost = data.data;
                        $scope.draftPostCount = data.count;
                        angular.forEach($scope.draftPost, function (postObj) {
                            securityGroups.platformUniqueAction(postObj);
                        })
                        securityGroups.draftListAction($scope.draftPost);
                    } else {
                        $scope.draftPost = null;
                        if (!helperFactory.isEmpty(data.count)) {
                            if (!userHelper.isAdmin()) {
                                helperFactory.errorMessage("Access denied or error.");
                            } else {
                                helperFactory.errorMessage("Error occured");
                            }
                        }
                    }
                    $scope.totalRecords = data.count;
                    pagination.setPagination($scope);
                }).catch(function (error) {
                    $scope.errorMsgLogin = 'Server error.';
                });
            }
            $scope.getDraftView(0);

            $scope.getPagedData = function (page) {
                if (page < $scope.dx.length && page >= 0) {
                    this.getDraftView(page);
                }
            }

            /*if user is admin*/
            $scope.changeClient = function (data) {
                if (data != undefined) {
                    /**api updated for draft fetch by saud */
                    $scope.clientId = data.id;
                    $scope.draftParams = {
                        'action': API_PATH + "post_get_client_" + $scope.clientId,
                        'q': 'status:4,6,8',
                        'size': 10,
                        'sort': $scope.sorting.attribute + ',' + $scope.sorting.direction,
                    }
                } else {
                    $scope.draftParams = {
                        'action': API_PATH + "post_all",
                        'q': 'status:4,6,8',
                        'size': 10,
                        'sort': $scope.sorting.attribute + ',' + $scope.sorting.direction,
                    }

                }
                $scope.getDraftView(0);
            }
            /*On unchecked client*/
            $scope.onDeselectClient = function (data) {
                $scope.clientId = null;
                $scope.draftParams = {
                    'action': API_PATH + "post_all",
                    'q': 'status:4',
                    'size': 10,
                    'sort': $scope.sorting.attribute + ',' + $scope.sorting.direction,
                }
                $scope.getDraftView(0);
            }
            /*On unchecked client*/


            $scope.getPostData = function (data) {
                $state.go('editPost');
            }
            /*@Edit Draft Function*/
            $scope.editPost = function (editPost, rejectCase = false) {
                if (editPost.status == 4 || (editPost.status == 8 && rejectCase) || editPost.status == 25) {
                    localstorage.setObject("currentPost", editPost);
                    localstorage.set("isPostEdit", true);
                    $state.go('composePost', {
                        'clear': false
                    });
                } else /* (editPost.status == 6)*/ {
                    localstorage.set('postApprovalData', JSON.stringify(editPost));
                    $state.go("postApprove");
                }
            }


        })
        .controller('postDetailController', function ($scope, helperFactory, httpServices, outreachHelper, $state, securityGroups, menuFactory) {

            if (!helperFactory.isLoggedIn()) {
                $state.go('login');
                return false;
            }
            $scope.getHandleImage = function (handleObject, plateForm) {
                var _arr = [];
                angular.forEach(handleObject, function (value, key) {
                    if (value.socialPlatform.name.toLowerCase() == plateForm) {
                        _arr.push(value);
                    }

                });
                if (_arr.length > 0) {
                    if (typeof _arr[0].accessToken.profileImage != 'undefined' && _arr[0].accessToken.profileImage != null) {
                        return _arr[0].accessToken.profileImage;
                    } else {
                        return false;
                    }
                }
            }
            $scope.getHandleName = function (handleObject, plateForm) {
                var _arr = [];
                angular.forEach(handleObject, function (value, key) {
                    if (value.socialPlatform.name.toLowerCase() == plateForm) {
                        _arr.push(value);
                    }

                });
                if (_arr.length > 0) {
                    if (typeof _arr[0].accessToken.fullName != 'undefined' && _arr[0].accessToken.fullName != null) {
                        return _arr[0].accessToken.fullName;
                    } else {
                        return false;
                    }
                }
            }
            $scope.getHandlesData = function (handleObject, plateForm) {
                var _arr = [];
                if (!helperFactory.isEmpty(handleObject)) {
                    angular.forEach(handleObject, function (value, key) {
                        if (value.socialPlatform.name.toLowerCase() == plateForm) {
                            _arr.push(value);
                        }
                    })
                    if (_arr.length > 0) {
                        return _arr.accessToken;
                    }
                }
            }
            var postId = sessionStorage.postSelectedId;
            if (helperFactory.isEmpty(postId)) {
                $state.go('draft');
            }
            $scope.$emit('menuItem', menuFactory.getMenuItems($scope));
            $scope.$emit('pageTitle', "Post Detail");
            $scope.$emit('getHeader', true);
            $scope.$emit('getSidebar', true);
            $scope.$emit('getFooter', true);
            $scope.$emit('titleSection', true);

            var postParams = {
                'action': API_PATH + "post_" + postId,
            }

            httpServices.getRequest(API_URL, postParams).then(function (data) {
                $scope.postData = {};
                if (data.status == 200 && !helperFactory.isEmpty(data.data)) {
                    $scope.postData = data.data;
                    $scope.uniqueIcons = securityGroups.platformUniqueAction($scope.postData);
                }

            }).catch(function (error) {
                $scope.errorMsgLogin = 'Server error.';
            });
        })

});