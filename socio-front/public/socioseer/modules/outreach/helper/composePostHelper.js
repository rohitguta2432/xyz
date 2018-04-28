/**
 * @author Anjani Gupta
 */
define([
    'angular',
    'angularRoute'
], function (angular, angularRoute) {

    angular.module('socioApp.outreach.composePostHelper', [])
        .factory('composePostHelper', function ($timeout, localstorage, httpServices, helperFactory, userHelper, pagination, contentHelper, $q) {
            var composePostHelper = {};
            /**
             * @method Get Client List
             * @param scope
             */
            composePostHelper.getClient = function (scope, httpServices, helperFactory, localstorage) {
                var action = API_PATH + "client_all";
                var params = {
                    'action': action,
                    'page': 0,
                    'size': 10000,
                    'q': 'status:1'
                };
                httpServices.getRequest(API_URL, params).then(function (data) {
                    scope.clientOptPost = [];
                    if (data.status == 200 && !helperFactory.isEmpty(data)) {
                        scope.clientObject = data.data;
                        angular.forEach(data.data, function (val) {
                            var clientObj = {};
                            clientObj.id = val.id;
                            clientObj.label = val.clientName;
                            clientObj.competitiorsDefinitions = val.competitiorsDefinitions;
                            clientObj.woeid = val.woeid;
                            scope.clientOptPost.push(clientObj);
                        });
                        /*set default selected if drfat edit*/
                        if (composePostHelper.isPostEdit()) {
                            scope.currentPostData = localstorage.getObject("currentPost");
                            angular.forEach(data.data, function (val, ind) {

                                if (val.id == scope.currentPostData.clientId) {
                                    scope.selectedClientPost.push(scope.clientOptPost[ind]);
                                }
                            });
                        }

                    }
                }).catch(function (error) {

                });
            }

            /****Get brands by client id*****/
            composePostHelper.getBrandByClientId = function (scope) {

                var brandParams = {
                    'action': API_PATH + "brand_client_" + scope.clientId,
                };
                httpServices.getRequest(API_URL, brandParams).then(function (data) {
                    scope.brandOpt = [];
                    if (data.status == 200 && !helperFactory.isEmpty(data.data)) {
                        angular.forEach(data.data, function (val) {
                            var brandObj = {};
                            brandObj.id = val.id;
                            brandObj.label = val.name;
                            scope.brandOpt.push(brandObj);
                        });
                        /*set default selected if drfat edit*/
                        if (composePostHelper.isPostEdit()) {
                            scope.currentPostData = localstorage.getObject("currentPost");
                            angular.forEach(data.data, function (val, ind) {
                                if (val.id == scope.currentPostData.brandId) {
                                    scope.selectedBrand.push(scope.brandOpt[ind]);
                                }
                            });
                        }
                    } else {
                        scope.brandList = "";
                    }
                }).catch(function (error) {
                    scope.errorMsgLogin = 'Server error.';
                });
            }



            /****Get audiences*****/
            composePostHelper.getAudience = function (scope, initData = false) {

                var params = {
                    'action': API_PATH + "audience-types_all",
                };
                httpServices.getRequest(API_URL, params).then(function (data) {
                    scope.audienceOpt = [];
                    if (data.status == 200 && !helperFactory.isEmpty(data.data)) {
                        angular.forEach(data.data, function (val) {
                            var audObj = {};
                            audObj = val;
                            audObj.label = val.name;
                            scope.audienceOpt.push(audObj);
                        });
                        if (initData) {
                            angular.forEach(initData, function (aud) {
                                var keepGoing = true;
                                angular.forEach(scope.audienceOpt, function (audOpt) {
                                    if (keepGoing) {
                                        if (aud.id == audOpt.id) {
                                            keepGoing = false;
                                            scope.audienceSelected.push(audOpt);
                                        }
                                    }
                                })
                            })
                        }
                    }
                }).catch(function (error) {
                    scope.errorMsgLogin = 'Server error.';
                });
            }

            /****Get campaign by client id*****/
            composePostHelper.getCampaignByClient = function (scope) {

                var action = API_PATH + "campaign_client_" + scope.clientId;
                if (!userHelper.isClientAdmin() && !userHelper.isAdmin()) {
                    action = API_PATH + "campaign_user_" + helperFactory.getLoggedInUserId() + '_team';
                }
                var params = {
                    'action': action,
                    'q': 'status:1'
                };

                httpServices.getRequest(API_URL, params).then(function (data) {
                    scope.campaignOpt = [];
                    if (data.status == 200 && data.count > 0) {
                        angular.forEach(data.data, function (val) {
                            var campaignObj = {};
                            campaignObj.id = val.id;
                            campaignObj.label = val.title;
                            campaignObj.endDate = val.endDate;
                            scope.campaignOpt.push(campaignObj);
                        });
                        if (composePostHelper.isPostEdit()) {

                            scope.currentPostData = localstorage.getObject("currentPost");

                            if (scope.currentPostData.campaignId != undefined && scope.currentPostData.campaignId != "") {
                                scope.campaignId = scope.currentPostData.campaignId;
                                angular.forEach(data.data, function (val, ind) {
                                    if (val.id == scope.currentPostData.campaignId) {
                                        scope.selectedCampaign.push(scope.campaignOpt[ind]);
                                    }
                                });
                                composePostHelper.getPlatformsByCampaignId(scope);
                            } else {
                                composePostHelper.getPlatforms(scope);
                            }
                        }
                    } else {

                        composePostHelper.getPlatforms(scope);
                    }
                }).catch(function (error) {

                });
            }
            /****Get social platforms*****/
            composePostHelper.getPlatforms = function (scope) {
                scope.handlarObjArray = [];
                var mediaParam = {
                    'action': API_PATH + "social-platforms_all"
                }
                httpServices.getRequest(API_URL, mediaParam).then(function (data) {
                    scope.platformOpt = [];
                    if (data.status == 200 && !helperFactory.isEmpty(data.data)) {
                        angular.forEach(data.data, function (val) {
                            var platformObj = {};
                            platformObj.id = val.id;
                            platformObj.label = val.name;
                            scope.platformOpt.push(platformObj);
                        });

                        if (composePostHelper.isPostEdit()) {
                            var platformArr = [];
                            scope.currentPostData = localstorage.getObject("currentPost");
                            angular.forEach(data.data, function (val, ind) {
                                angular.forEach(scope.currentPostData.selectedHandlers, function (plt, pind) {
                                    if (val.id == pind) {
                                        angular.forEach(scope.platformOpt, function (v, i) {
                                            if (v.id == pind) {
                                                scope.selectedPlatform.push(v);
                                            }
                                        });

                                        platformArr.push(val.id);

                                    }
                                });
                            });

                            scope.selectedHand = [];
                            var lastChecked = false;
                            if (platformArr.length > 0) {
                                angular.forEach(platformArr, function (platformId, i) {
                                    scope.platformId = platformId;
                                    if (platformArr.length == i + 1) {
                                        lastChecked = true;

                                    }
                                    composePostHelper.getHandlers(scope, lastChecked);

                                });

								/*$q.all(promises).then(function(){
										console.log(promises);
                                        angular.forEach(scope.handlarObjArray,function(data){
                                                console.log(data)
                                        })
								});*/
                            }

                        }
                    }
                });
            }
            /****Get social handlers by client and platform id*****/
            composePostHelper.getHandlers = function (scope, lastChecked = false) {
                var platformId = scope.platformId;

                var mediaParam = {
                    'action': API_PATH + "social-handler_client_" + scope.clientId + '_' + platformId
                }
                httpServices.getRequest(API_URL, mediaParam).then(function (data) {
                    if (data.status == 200 && !helperFactory.isEmpty(data.data)) {
                        angular.forEach(data.data, function (val) {
                            var handlerObj = {};
                            handlerObj.id = val.id;

                            if (!helperFactory.isEmpty(val.accessToken)) {
                                handlerObj.accessToken = val.accessToken;
                            }
                            if (!helperFactory.isEmpty(val.socialPlatform.name)) {
                                handlerObj.platform = val.socialPlatform.name;
                                handlerObj.platformId = val.socialPlatform.id;
                                if (val.socialPlatform.name.toLowerCase() == 'twitter') {
                                    handlerObj.label = val.accessToken.screen_name;
                                } else if (val.socialPlatform.name.toLowerCase() == 'facebook') {
                                    handlerObj.label = val.accessToken.fullName;
                                }
                            } else {
                                handlerObj.label = "";
                            }

                            scope.handlersOpt.push(handlerObj);

                        });
                        /*to send date on server prepare a formate for selected handlers*/

                        if (composePostHelper.isPostEdit()) {

                            scope.currentPostData = localstorage.getObject("currentPost");
                            if (scope.currentPostData.socialHandlers.length > 0) {
                                angular.forEach(data.data, function (val, ind) {

                                    angular.forEach(scope.currentPostData.socialHandlers, function (hand, hind) {
                                        if (val.id == hand.id) {

                                            angular.forEach(scope.handlersOpt, function (dataHandle) {
                                                if (dataHandle.id == hand.id) {
                                                    scope.selectedHand.push(dataHandle);
                                                }
                                            })
                                        }
                                    });

                                });

                                scope.selectedHandlers = composePostHelper.removeDuplicates(scope.selectedHand, 'id');
                                scope.updateSelectedPlatformList();
                            }

                        }
                        /*set false to clear data & chaneg clinet object*/
                        //localstorage.set("isPostEdit", false);
                        if (lastChecked) {

                            localstorage.set("isPostEdit", false);

                        }
                    }
                });
            }
            /****Refresh handlers object*****/
            composePostHelper.refreshHandlers = function (scope) {

                var platformId = scope.platformId;
                var handlersIds = [];
                var mediaParam = {
                    'action': API_PATH + "social-handler_client_" + scope.clientId + '_' + platformId
                }
                httpServices.getRequest(API_URL, mediaParam).then(function (data) {
                    if (data.status == 200 && !helperFactory.isEmpty(data.data)) {
                        angular.forEach(data.data, function (val) {
                            angular.forEach(scope.handlersOpt, function (hnd, i) {
                                if (hnd.id == val.id) {
                                    scope.handlersOpt.splice(i, 1);
                                }
                            });
                        });

                    }
                    delete scope.selectedHandlersData[platformId];

                });
            }
            /****Get platforms by campaign id*****/
            composePostHelper.getPlatformsByCampaignId = function (scope) {
                var params = {
                    'action': API_PATH + "campaign_" + scope.campaignId
                }
                httpServices.getRequest(API_URL, params).then(function (data) {
                    scope.platformOpt = [];
                    if (data.status == 200 && !helperFactory.isEmpty(data.data)) {
                        angular.forEach(data.data.platformList, function (val) {
                            var platformObj = {};
                            platformObj.id = val.id;
                            platformObj.label = val.name;
                            scope.platformOpt.push(platformObj);
                        });
                        if (composePostHelper.isPostEdit()) {
                            var platformArr = [];
                            scope.currentPostData = localstorage.getObject("currentPost");

                            angular.forEach(data.data.platformList, function (val, ind) {
                                angular.forEach(scope.currentPostData.selectedHandlers, function (plt, pind) {
                                    if (val.id == pind) {
                                        angular.forEach(scope.platformOpt, function (v, i) {
                                            if (v.id == pind) {
                                                scope.selectedPlatform.push(v);
                                            }
                                        });
                                        platformArr.push(val.id);

                                    }
                                });
                            });

                            scope.selectedHand = [];
                            var lastChecked = false;
                            if (platformArr.length > 0) {
                                angular.forEach(platformArr, function (platformId, i) {
                                    scope.platformId = platformId;
                                    if (platformArr.length == i + 1) {
                                        lastChecked = true;

                                    }
                                    composePostHelper.getHandlers(scope, lastChecked);

                                });
                            }

                        }
                    }
                });
            }

            composePostHelper.validatePostForm = function (scope) {

                console.log("MEDIA", scope.selectedMedia);

                if (!userHelper.isAdmin()) {
                    scope.selectedClientPost.length = 1;
                }

                if (scope.selectedClientPost.length > 0 && scope.selectedBrand.length > 0 && scope.selectedPlatform.length > 0 && scope.selectedHandlers.length > 0 && (scope.tinymceModel != undefined && scope.tinymceModel != "" || scope.selectedMedia.length > 0)) {
                    scope.postDescError = false;
                    return true;
                } else {

                    if (scope.selectedClientPost.length == 0) {
                        scope.selectedClientError = true;
                    }
                    if (scope.selectedBrand.length == 0) {
                        scope.selectedBrandError = true;
                    }
                    if (scope.selectedPlatform.length == 0) {
                        scope.selectedPlatformError = true;
                    }
                    if (scope.selectedHandlers.length == 0) {
                        scope.selectedHandlersError = true;
                    }
                    if ((scope.tinymceModel == "" || scope.tinymceModel == undefined) && scope.selectedMedia.length == 0) {
                        scope.postDescError = true;
                    }
                    return false;
                }
            }

            composePostHelper.validateScheduledForm = function (scope) {
                if (scope.allPlatforms.length > 0) {

                    var c1 = 0,
                        c2 = 0,
                        c3 = 0,
                        c4 = 0,
                        n = 0;
                    angular.forEach(scope.allPlatforms, function (val, key) {

                        if (val.platforms == "" || val.platforms == undefined || val.platforms == null) {
                            var k = key;
                            scope['errorPlt' + k] = true;
                            c1++;
                        }

                        if (val.frequency == null || !val.frequency.frequency) {
                            var k = key;
                            scope['errorFreq' + k] = true;
                            c2++;
                        }

                        angular.forEach(val.dateTime, function (_dval, _dkey) {
                            if (!_dval.startDT) {
                                var k = key;
                                scope['errorSDate' + k + '' + _dkey] = true;
                                c3++;
                            } else {
                                var currentDate = new Date();
                                if (_dval.startDT.toDateString() == (currentDate).toDateString()) {
                                    if ((helperFactory.getCurrentTimeStamp() + 5 * 60) * 1000 >= helperFactory.getTimeStamp(_dval.startDT)) {
                                        var k = key;
                                        scope['errorSDate' + k + '' + _dkey] = true;
                                        c3++;
                                    }
                                }
                            }
                            if (!_dval.endDT && val.frequency.id != 9) {
                                var k = key;
                                scope['errorEDate' + k + '' + _dkey] = true;
                                c4++;
                            } else {
                                if (val.frequency.id != 9) {
                                    var currentDate = new Date();
                                    if (_dval.endDT.toDateString() == (currentDate).toDateString()) {
                                        if ((helperFactory.getCurrentTimeStamp() + 5 * 60) * 1000 >= helperFactory.getTimeStamp(_dval.endDT)) {
                                            var k = key;
                                            scope['errorEDate' + k + '' + _dkey] = true;
                                            c3++;
                                        }
                                    }
                                }

                            }

                        });

                    });

                    if (c1 == 0 && c2 == 0 && c3 == 0 && c4 == 0) {
                        return true;
                    } else {
                        return false;
                    }

                } else {
                    return false;
                }


            }

            composePostHelper.splitter = function (str, l) {
                var strs = [];
                while (str.length > l) {
                    var pos = str.substring(0, l).lastIndexOf(' ');
                    pos = pos <= 0 ? l : pos;
                    strs.push(str.substring(0, pos));
                    var i = str.indexOf(' ', pos) + 1;
                    if (i < pos || i > pos + l)
                        i = pos;
                    str = str.substring(i);
                }
                strs.push(str);
                return strs;
            }

            composePostHelper.isPostEdit = function () {
                if (typeof localstorage.get("isPostEdit") != 'undefined' && localstorage.get("isPostEdit") == 'true') {
                    return true;
                }
            }

            composePostHelper.removeDuplicates = function (arr, prop) {
                var new_arr = [];
                var lookup = {};

                for (var i in arr) {
                    lookup[arr[i][prop]] = arr[i];
                }

                for (i in lookup) {
                    new_arr.push(lookup[i]);
                }

                return new_arr;
            }

            /**Save in draft mode */
            composePostHelper.saveInDraft = function ($scope) {
                $scope.brands = [];
                var brandObj = {};
                var getDatas = $scope.getFormData;
                if (composePostHelper.validatePostForm($scope)) {
                    var postParams = {
                        'action': API_PATH + "post",
                        'myparam': getDatas,

                    };
                    httpServices.postRequest(API_URL, postParams).then(function (data) {
                        if (data.status == 200) {
                            $scope.editedId = data.data.id;

                            $scope.iseditablePost = true;
                            $scope.editablePostId = data.data.id;

                            if (!$scope.isDrftClk) {
                                if (!$scope.isContSche) {
                                    $scope.addPlatform();
                                }
                                $scope.scheduleSaveData = data.data;
                                $scope.step1 = true;
                                $scope.step0 = false;
                                localstorage.delete('isPostEdit');
                                localstorage.delete('currentPost');
                                $scope.tabDisable[1] = true;
                            } else {
                                $scope.draftSuccessMsg = "Draft saved successfully.";
                                helperFactory.successMessage($scope.draftSuccessMsg);
                                $scope.success = true;
                            }
                            
                        } else {
                            $scope.draftSuccessMsg = "Error while composing post.";
                            helperFactory.errorMessage($scope.draftSuccessMsg);
                            $scope.success = false;
                        }
                    }).catch(function (error) {
                        $scope.errorMsgLogin = 'Server error.';
                        helperFactory.errorMessage($scope.errorMsgLogin);
                        $scope.success = false;
                    });
                }
            }
            /**Post now method */
            composePostHelper.publishPostNow = function ($scope) {
                $scope.brands = [];
                var brandObj = {};
                var getDatas = $scope.getFormData;
                if (composePostHelper.validatePostForm($scope)) {
                    var postParams = {
                        'action': API_PATH + "post",
                        'myparam': getDatas,

                    };
                    httpServices.postRequest(API_URL, postParams).then(function (data) {
                        if (data.status == 200) {
                            $scope.scheduleSaveData = data.data;
                            var formDataForSch = [];
                            angular.forEach($scope.selectedPlatform, function (platform) {

                                var schData = {};
                                schData.clientId = $scope.clientId;
                                schData.clientName = $scope.clientName;
                                schData.campaignId = $scope.campaignId;
                                schData.campaignName = $scope.campaignName;
                                schData.postId = $scope.scheduleSaveData.id;
                                schData.platformId = platform.id;
                                schData.frequencyCode = 9;
                                schData.createdBy = localstorage.get('userId');
                                schData.scheduleTime = [];

                                var tmpDT = {};
                                var date = new Date();
                                tmpDT.startTime = ('0' + date.getUTCDate()).slice(-2) + '/' + ('0' + (date.getUTCMonth() + 1)).slice(-2) + '/' + date.getUTCFullYear() + ' ' + date.getUTCHours() + ':' + parseInt(parseInt(date.getUTCMinutes()) + 2);
                                schData.scheduleTime.push(tmpDT);
                                formDataForSch.push(schData);

                            })
                            console.log(formDataForSch)
                            /* $scope.draftSuccessMsg = "Draft saved successfully.";
                            helperFactory.successMessage($scope.draftSuccessMsg);
                            $scope.success = true;*/
                            /** scheduler */

                            var postParams = {
                                'action': API_PATH + "post_postSchedule_" + $scope.scheduleSaveData.id + "_schedule",
                                'myparam': formDataForSch
                            };

                            httpServices.postRequest(API_URL, postParams).then(function (data) {
                                if (data.status == 200 && data.data) {
                                    $scope.sendForReview();
                                } else {
                                    $scope.errorMsgLogin = '';
                                }
                            }).catch(function (error) {
                                $scope.errorMsgLogin = 'Server error.';
                            });



                        }
                    }).catch(function (error) {
                        $scope.errorMsgLogin = 'Server error.';
                        helperFactory.errorMessage($scope.errorMsgLogin);
                        $scope.success = false;
                    });
                }
            }

            return composePostHelper;
        });
});