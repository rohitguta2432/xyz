/**
 * @author Gaurav Sirauthiya
 */
define([
    'angular',
    'angularRoute'
], function (angular, angularRoute) {
    angular.module('socioApp.outreach.campaignController', [])
        .controller('campaignListingController', function ($scope, $stateParams, $location, localstorage, helperFactory, $state, httpServices, pagination, formValidator, userHelper, outreachHelper, rolesHelper, menuFactory) {
            if (!helperFactory.isLoggedIn()) {
                $state.go('login');
                return false;
            }
            $scope.addLocalTimeStamp = -((new Date()).getTimezoneOffset()*60*1000);

            $scope.convertTimeToUTC = helperFactory;
            /**Check Campaign Listing access */
            var checkAccess = rolesHelper.canView('FETCH_ALL_CAMPAIGN') || rolesHelper.canView('GET_CAMPAIGN_BY_CLIENT') ||
                rolesHelper.canView('GET_CAMPAIGN_BY_USERID');
            if (!checkAccess) {
                $state.go('summary');
            }

            /**Check Create campaign button access */
            $scope.canCreateCampaign = rolesHelper.canCreate('MANAGE_CAMPAIGN') && rolesHelper.canView('GET_BRAND_FOR_CLIENT') && rolesHelper.canView('FETCH_TEAMS_BY_CLIENT') && rolesHelper.canView('GET_SOCIAL_HANDLER_BY_CLIENT_PLATFORM_ID');


            /**Check action access */
            $scope.canViewCampaign = rolesHelper.canView('MANAGE_CAMPAIGN');
            $scope.canChangeStatusCampaign = rolesHelper.canEdit('UPDATE_STATUS_BY_CAMPAIGN_ID');


            $scope.sorting = {
                attribute: 'createdDate',
                direction: 'desc'
            };

            $scope.dir = 'desc';
            $scope.sortBy = function (attribute, dir) {

                var _dir = (dir == 'desc') ? 'desc' : 'asc';
                $scope.sorting = {
                    attribute: attribute,
                    direction: _dir
                }
                $scope.getCampaignView(0);
                $scope.dir = (dir == 'desc') ? 'asc' : 'desc';
            }

            $scope.formValidator = formValidator;
            $scope.$emit('pageTitle', "Campaign Listing");
            $scope.$emit('menuItem', menuFactory.getMenuItems($scope));
            $scope.$emit('getHeader', true);
            $scope.$emit('getSidebar', true);
            $scope.$emit('getFooter', true);
            $scope.$emit('titleSection', true);

            $scope.dx = [];

            $scope.getCampaignView = function (page) {
                $scope.page = page;

                if ($stateParams.startDate != "" && $stateParams.endDta != "") {
                    var params = {
                        'action': $scope.action,
                        'page': page,
                        'size': 10,
                        'q': 'status:1,2;startDate:' + $stateParams.startDate + ',gte,' + $stateParams.endDate + ',lte!true',
                        'sort': $scope.sorting.attribute + ',' + $scope.sorting.direction
                    };
                } else {
                    var params = {
                        'action': $scope.action,
                        'page': page,
                        'size': 10,
                        'q': 'status:1,2',
                        'sort': $scope.sorting.attribute + ',' + $scope.sorting.direction
                    };
                }


                if ($scope.searchKey != undefined && $scope.searchKey != null) {
                    params.q += ';title:' + $scope.searchKey + '~true'
                } else {
                    $scope.searchKey = null;
                }
                $scope.uniqueFilter = function (collection, keyname) {
                    var output = [],
                        keys = [];

                    angular.forEach(collection, function (item) {
                        var key = item[keyname];
                        if (keys.indexOf(key) === -1) {
                            keys.push(key);
                            output.push(item);
                        }
                    });
                    return output;
                }

                httpServices.getRequest(API_URL, params).then(function (data) {
                    if (data.status == 200 && !helperFactory.isEmpty(data.data)) {
                        $scope.campaignData = [];
                        angular.forEach(data.data, function (item) {
                            var pltfrms = [];
                            $scope.uniqueIcons = $scope.uniqueFilter(item.platformList, 'name');
                            item.uniquIcons = $scope.uniqueIcons;
                            $scope.campaignData.push(item);
                        });
                        //$scope.campaignData = $scope.campaignData;
                    } else {
                        $scope.campaignData = null;
                    }

                    $scope.totalRecords = data.count;
                    pagination.setPagination($scope);
                }).catch(function (error) {
                    $scope.errorMsgLogin = 'Server error.';
                });
            };
            $scope.searchCLients = function ($event) {
                if ($event.keyCode == 13 && $scope.searchKey != null) {
                    $scope.getCampaignView(0);
                }
                if ($event.keyCode == 8) {
                    $scope.getCampaignView(0);
                }

            }

            $scope.extraSettings = SINGLE_CLIENT_DROPDOWN;
            if (!userHelper.isAdmin()) {
                $scope.adminClientDropdown = false;
                $scope.selectedClientId = localstorage.get('clientId');
                $scope.action = API_PATH + "campaign_client_" + $scope.selectedClientId;
                if (!userHelper.isClientAdmin()) {
                    $scope.action = API_PATH + "campaign_user_" + helperFactory.getLoggedInUserId() + '_team';
                }
                $scope.getCampaignView(0);
            } else {
                $scope.adminClientDropdown = true;
                outreachHelper.getClient($scope, httpServices, helperFactory, localstorage);
                $scope.selectedClient = [];
                if ($stateParams.clientId != "") {
                    $scope.action = API_PATH + "campaign_client_" + $stateParams.clientId;
                    $scope.selectedClient = $stateParams.clientId;
                } else {
                    $scope.action = API_PATH + "campaign_all";
                }
                $scope.getCampaignView(0);
            }

            $scope.getPagedData = function (page) {
                if (page < $scope.dx.length && page >= 0) {
                    this.getCampaignView(page);
                }
            }

            $scope.actionCampaignData = function (selectedCampaignValue, action) {
                if (selectedCampaignValue) {
                    localstorage.set("currentCampaignId", selectedCampaignValue.id);
                    $state.go("viewCampaign");
                }
            }

            $scope.changeCampaignStatus = function (selectedCampaignValue, setStatus) {
                var status = (!setStatus) ? 2 : 1;
                var formData = {};
                var clientId = $scope.selectedClientId;
                var params = {
                    'action': API_PATH + "campaign_status_" + selectedCampaignValue.id + "_" + status + "_" + clientId,
                    'rawBody': formData
                };
                httpServices.putRequest(API_URL + '/put', params).then(function (data) {
                    if (data.status == 200) {

                    } else {
                        $scope.errorMsgLogin = '';
                    }
                }).catch(function (error) {
                    $scope.errorMsgLogin = 'Server error.';
                });
            }
            $scope.selectedClientId = null;
            $scope.changeClient = function (data) {
                $stateParams.startDate = "";
                $stateParams.endDate = "";
                $scope.selectedClientId = data.id;
                $scope.action = API_PATH + "campaign_client_" + $scope.selectedClientId;
                $scope.getCampaignView(0);
            }
            /*On unchecked client*/
            $scope.onDeselectClient = function (data) {
                $stateParams.startDate = "";
                $stateParams.endDate = "";
                $scope.action = API_PATH + "campaign_all";
                $scope.getCampaignView(0);
            }
            /*On unchecked client*/

        }).controller('viewCampaignController', function ($scope, $location, localstorage, helperFactory, $state, httpServices, securityGroups, userHelper, outreachHelper, pagination, $timeout, Upload, composePostHelper, rolesHelper, menuFactory) {
            $scope.addLocalTimeStamp = -((new Date()).getTimezoneOffset()*60*1000);
            
            $scope.convertTimeToUTC = helperFactory;
            if (!helperFactory.isLoggedIn()) {
                $state.go('login');
                return false;
            }
            var canViewCampaign = rolesHelper.canView('MANAGE_CAMPAIGN');
            if (!canViewCampaign) {
                $state.go('summary');
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

            $scope.currentUser = helperFactory.getLoggedInUserId();
            $scope.canEditCampaign = rolesHelper.canEdit('MANAGE_CAMPAIGN') && rolesHelper.canView('GET_BRAND_FOR_CLIENT') && rolesHelper.canView('FETCH_TEAMS_BY_CLIENT') && rolesHelper.canView('GET_SOCIAL_HANDLER_BY_CLIENT_PLATFORM_ID');
            $scope.canViewPosts = rolesHelper.canView('FETCH_ALL_POST');

            $scope.canEditDraft = rolesHelper.canEdit('MANAGE_POST') && rolesHelper.canView('GET_BRAND_FOR_CLIENT') && rolesHelper.canView('GET_CAMPAIGN_BY_CLIENT') && rolesHelper.canView('GET_SOCIAL_HANDLER_BY_CLIENT_PLATFORM_ID');
            if (userHelper.isAdmin()) {
                $scope.isAdmin = true;
            }
            $scope.editModed = false;
            $scope.configScroll = SCROLL_CONFIG;
            $scope.changeToEditMode = function () {
                $scope.editModed = !$scope.editModed;
                if (!$scope.editModed) {
                    var hashArray = [];
                    angular.forEach($scope.campaignViewdata.hashtags, function (hash) {
                        hashArray.push(hash.text)
                    });
                    $scope.campaignViewdata.hashtags = hashArray;
                }
                if (!$scope.editModed) {
                    var keywordArr = [];
                    angular.forEach($scope.campaignViewdata.keywords, function (keyword) {
                        keywordArr.push(keyword.text)
                    });
                    $scope.campaignViewdata.keywords = keywordArr;
                }
            }

            $scope.viewCampaign = true;
            $scope.hf = helperFactory;
            $scope.minDate = new Date().toDateString();
            $scope.selectedPlatforms = "";
            $scope.$emit('pageTitle', "View Campaign");
            $scope.$emit('menuItem', menuFactory.getMenuItems($scope));
            $scope.$emit('getHeader', true);
            $scope.$emit('getSidebar', true);
            $scope.$emit('getFooter', true);
            $scope.$emit('titleSection', true);
            $scope.audienceSelected = [];
            $scope.selectedBrand = [];
            $scope.selectedSocial = [];
            $scope.selectedHandle = [];
            $scope.selectedTeam = [];
            $scope.selectedCurrency = [];
            $scope.selectedCountry = [];
            $scope.selectedState = [];
            $scope.extraMultiSettings = MULTIPLE_DROPDOWN_SETTING;
            $scope.extraSettings = SINGLE_CLIENT_DROPDOWN;
            /**
             * file manager
             */
            $scope.opeFileManager = function () {
                jQuery('#campaignPic').click();
            }

            $scope.changeMySrc = function () {
                if (typeof $scope.campaignViewdata.file != 'undefined' && $scope.campaignViewdata.file != null) {
                    if (helperFactory.getImageMessages($scope.campaignViewdata.file)) {
                        $scope.campaignImage = $scope.campaignViewdata.file.$ngfBlobUrl;

                    } else {
                        $scope.campaignViewdata.file = null;
                    }
                }
            }

            /**
             * load campaign data by campaign id
             **/

            $scope.campaignId = localstorage.get("currentCampaignId");
            outreachHelper.getCampignData($scope, securityGroups, $scope.viewCampaign);

            $timeout(function audData() {
                if (typeof $scope.campaignViewdata != 'undefined' && !helperFactory.isEmpty($scope.campaignViewdata.targetAudience)) {
                    composePostHelper.getAudience($scope, $scope.campaignViewdata.targetAudience);
                }
            }, 1000);


            /**campaign tab/ view campaign*/
            $scope.clickCampaignTab = function () {
                $scope.hideBtn = false;
                outreachHelper.getCampignData($scope, securityGroups, $scope.viewCampaign);
            }

            $scope.onTagAdding = function (tag) {
                var str = tag.text;
                var indices = [];
                for (var i = 0; i < str.length; i++) {
                    if (str[i] === "#") indices.push(i);
                }
                if (indices.length > 1 || (indices.length) == 1 && indices[0] > 0) {
                    return false;
                }
            }

            $scope.tagAdded = function (tag) {
                $scope.hashtagsError = false;
                $scope.hashtagsErrorMsg = "";
                jQuery("#hashtagsData").removeClass('formErrorMsgCampBorer');
            };

            $scope.tagAddedKeywords = function (tag) {
                $scope.keywordsError = false;
                $scope.keywordsErrorMsg = "";
                jQuery("#keywordsData").removeClass('formErrorMsgCampBorer');
            };

            $scope.audienceAdded = function (tag) {

                $scope.audienceError = false;
                $scope.audienceErrorMsg = "";
                jQuery("#audienceData").removeClass('formErrorMsgCampBorer');
            };
            
            $scope.resetEndDate = function (budget) {
                if (!helperFactory.isEmpty(budget.endDate)) {
                    budget.endDate = null;
                }
            }
            outreachHelper.updateTeamDropdown($scope);
            outreachHelper.updateBrandDropdown($scope);
            outreachHelper.updateHandleDropdown($scope);
            outreachHelper.updateSocialPlatform($scope);
            outreachHelper.updateCountryAndState($scope);


            function validateTags(campaignViewdata) {
                if (campaignViewdata.keywords != undefined && campaignViewdata.keywords.length > 0) {
                    $scope.keywordsError = false;
                    $scope.keywordsErrorMsg = "";
                    jQuery("#keywordsData").removeClass('formErrorMsgCampBorer');
                } else {
                    $scope.keywordsError = true;
                    $scope.keywordsErrorMsg = "Required";
                    jQuery("#keywordsData").addClass('formErrorMsgCampBorer');
                }

                if (campaignViewdata.hashtags != undefined && campaignViewdata.hashtags.length > 0) {
                    $scope.hashtagsError = false;
                    $scope.hashtagsErrorMsg = "";
                    jQuery("#hashtagsData").removeClass('formErrorMsgCampBorer');
                } else {
                    $scope.hashtagsError = true;
                    $scope.hashtagsErrorMsg = "Required";
                    jQuery("#hashtagsData").addClass('formErrorMsgCampBorer');
                }
                if ($scope.selectedTeam.length > 0) {
                    $scope.selectedTeamErrorFlag = false;
                } else {
                    $scope.selectedTeamErrorFlag = true;
                }

                if ($scope.selectedBrand.length > 0) {
                    $scope.selectedBrandsErrorFlag = false;
                } else {
                    $scope.selectedBrandsErrorFlag = true;
                }

                if ($scope.selectedHandle.length > 0) {
                    $scope.selectedHandlersErrorFlag = false;
                } else {
                    $scope.selectedHandlersErrorFlag = true;
                }
                if ($scope.selectedSocial.length > 0) {
                    $scope.mediaChannelErrorFlag = false;
                } else {
                    $scope.mediaChannelErrorFlag = true;
                }

                if (!$scope.keywordsError && !$scope.hashtagsError /* && !$scope.audienceError*/ && !$scope.selectedBrandsErrorFlag && !$scope.selectedHandlersErrorFlag && !$scope.mediaChannelErrorFlag && !$scope.selectedTeamErrorFlag) {
                    return true;
                } else {
                    return false;
                }
            }

            function saveCampaignData(campignParams) {
                httpServices.putRequest(API_URL + '/media/put', campignParams).then(function (data) {
                    if (data.status == 200) {
                        helperFactory.successMessage(data.message);
                    } else {
                        helperFactory.errorMessage(data.message);
                        $scope.errorMsg = '';
                    }
                    $state.go('viewCampaign', {}, {
                        reload: true
                    });
                }).catch(function (error) {
                    $scope.errorMsg = 'Server error.';
                    helperFactory.errorMessage($scope.errorMsg);

                });
            }

            $scope.saveData = function (updateCampaign) {

                if ($scope.selectedCurrency.length > 0) {
                    var isValidBudgetList = outreachHelper.validateBudgetList($scope, $scope.selectedPlatformList);
                } else {
                    var isValidBudgetList = true;
                }

                if (updateCampaign.$valid && validateTags($scope.campaignViewdata) && isValidBudgetList) {
                    var formData = {};
                    var targetAudience = [];
                    angular.forEach($scope.audienceSelected, function (aud) {
                        delete aud.label;
                        targetAudience.push(aud);
                    })
                    if (targetAudience.length > 0) {
                        formData.targetAudience = targetAudience;
                    }

                    formData.id = $scope.campaignViewdata.id;
                    formData.title = $scope.campaignViewdata.title;
                    formData.objective = $scope.campaignViewdata.objective;
                    formData.description = $scope.campaignViewdata.description;
                    delete $scope.selectedTeam[0].label;
                    formData.team = $scope.selectedTeam[0];
                    formData.brands = [];
                    formData.keywords = [];
                    formData.hashtags = [];
                    formData.status = 1;
                    formData.platformList = [];
                    formData.handles = [];
                    formData.clientId = $scope.campaignViewdata.clientId;
                    $scope.makePostMetricsModel();
                    angular.forEach($scope.campaignViewdata.keywords, function (data) {
                        formData.keywords.push(data.text);
                    });

                    angular.forEach($scope.campaignViewdata.hashtags, function (data) {
                        formData.hashtags.push(data.text);
                    });


                    angular.forEach($scope.selectedBrand, function (data) {
                        delete data.label;
                        formData.brands.push(data);
                    });
                    angular.forEach($scope.selectedHandle, function (data) {
                        delete data.label;
                        formData.handles.push(data);
                    });

                    angular.forEach($scope.selectedSocial, function (data) {
                        var tmpData = data;
                        delete tmpData.label;
                        delete tmpData.class;
                        delete tmpData.href;
                        formData.platformList.push(tmpData);
                    });
                    formData.location = {};
                    if ($scope.selectedCountry.length > 0) {
                        formData.location.country = $scope.selectedCountry[0].label;
                    }
                    if ($scope.selectedState.length > 0) {
                        formData.location.region = $scope.selectedState[0].label;
                    }
                    if (!helperFactory.isEmpty($scope.campaignViewdata.location.city)) {
                        formData.location.city = $scope.campaignViewdata.location.city;
                    }

                    formData.postMetrics = $scope.noteTriggerData;

                    formData.createdBy = localstorage.get('userId');
                    formData.updatedBy = localstorage.get('userId');
                    formData.startDate = helperFactory.getUTCTimeStamp($scope.campaignViewdata.startDate);
                    formData.endDate = helperFactory.getUTCTimeStamp($scope.campaignViewdata.endDate);

                    var budgetListData = [];
                    angular.forEach($scope.selectedPlatformList, function (budget) {
                        if (budget.platform && budget.durability && budget.budget && budget.startDate && budget.endDate && $scope.selectedCurrency.length > 0) {
                            budgetListData.push({
                                "platform": budget.platform.name,
                                "platformId": budget.platform.id,
                                "budget": budget.budget,
                                "duration": budget.durability,
                                "startDate": helperFactory.getUTCTimeStamp(budget.startDate),
                                "endDate": helperFactory.getUTCTimeStamp(budget.endDate),
                                "currency": $scope.selectedCurrency[0].name
                            });

                        }
                    })



                    $timeout(function execute() {
                        if (budgetListData.length > 0) {
                            formData.budgetList = budgetListData;
                        } else {
                            formData.budgetList = [];
                        }
                        var campignParams = {
                            'action': API_PATH + "campaign_" + formData.id,
                            'rawBody': formData,
                            'rawBodyKey': 'campaign',
                            'fileKey': 'logo',
                        };

                        if ($scope.campaignViewdata.file) {
                            fileName = $scope.campaignViewdata.file.name;
                            Upload.upload({
                                url: API_URL + '/image',
                                data: {
                                    file: $scope.campaignViewdata.file
                                }
                            }).then(function (resp) {
                                if (resp.data.error_code === 0) {
                                    campignParams.file = resp.data.upload_file_name;
                                    saveCampaignData(campignParams);
                                }
                            }, function (resp) {

                            }, function (evt) {});
                        } else {
                            campignParams.file = null;
                            saveCampaignData(campignParams);
                        }
                    }, 200);
                }
            }

            /**
             * show all post within campaign
             **/

            $scope.clickPostTab = function (page) {
                $scope.campaignPostsLength = false;
                $scope.hideBtn = true;
                $scope.per_page = 5;
                $scope.getPagedData = function (page) {
                    if (page < $scope.dx.length && page >= 0) {
                        getCampPostView(page);
                    }
                }

                function getCampPostView(page) {
                    $scope.page = page;
                    var postParams = {
                        'action': API_PATH + "post_all",
                        'q': 'campaignId:' + $scope.campaignViewdata.id,
                        'page': page,
                        'sort': 'createdDate,desc',
                        'size': 5
                    };
                    if (!userHelper.isAdmin() && !userHelper.isClientAdmin()) {
                        postParams.q += ';createdBy:' + helperFactory.getLoggedInUserId();
                    }
                    httpServices.getRequest(API_URL, postParams).then(function (data) {
                        if (data.status == 200 && data.count > 0) {
                            $scope.campaignPosts = data.data;
                            angular.forEach($scope.campaignPosts, function (postObj) {
                                securityGroups.platformUniqueAction(postObj);
                            })
                            securityGroups.draftListAction($scope.campaignPosts);
                            $scope.countValue = data.count;
                            $scope.totalRecords = data.count;
                            pagination.setPagination($scope);
                            $scope.campaignPostsLength = true;
                        } else {
                            $scope.campaignPostsLength = false;
                        }
                    }).catch(function (error) {
                        $scope.errorMsg = 'Server error.';
                    });
                }
                $scope.previewPostIndex = function (postIndex) {
                    $scope.previewPost = null;
                    $scope.previewPost = $scope.campaignPosts[postIndex];
                    $scope.previewPost.optionSocial = [];
                    angular.forEach($scope.previewPost.socialHandlers, function (handler) {
                        $scope.previewPost.optionSocial.push(handler.socialPlatform);
                    })
                    securityGroups.setOptionSocial($scope.previewPost.optionSocial);
                    $timeout(function () {
                        $('#preview').modal('show');
                    }, 800, false);
                }

                $scope.editPostIndex = function (postIndex) {
                    var params = {
                        'action': API_PATH + "post_" + $scope.campaignPosts[postIndex].id,
                    }
                    httpServices.getRequest(API_URL, params).then(function (data) {
                        if (data.status == 200 && data.data) {
                            localstorage.setObject("currentPost", data.data);
                            localstorage.set("isPostEdit", true);
                            $state.go('composePost');
                        } else {

                        }
                    }).catch(function (error) {});
                }
                getCampPostView(0);
            }


        }).controller('createCampaignController', function ($scope, $location, localstorage, helperFactory, $state, httpServices, securityGroups, formValidator, outreachHelper, userHelper, Upload, composePostHelper, menuFactory) {
            if (!helperFactory.isLoggedIn()) {
                $state.go('login');
                return false;
            }
            $scope.adminClientDropdown = false;
            $scope.minDate = new Date().toDateString();
            $scope.$emit('pageTitle', "Create Campaign");
            $scope.$emit('menuItem', menuFactory.getMenuItems($scope));
            $scope.$emit('getHeader', true);
            $scope.$emit('getSidebar', true);
            $scope.$emit('getFooter', true);
            $scope.$emit('titleSection', true);


            if (userHelper.isAdmin()) {
                outreachHelper.getClient($scope, httpServices, helperFactory, localstorage);
                $scope.adminClientDropdown = true;
                $scope.selectedClient = [];
                $scope.extraSettings = SINGLE_CLIENT_DROPDOWN;
            } else {
                $scope.selectedClientId = localstorage.get('clientId');
                outreachHelper.fetchClientBrands($scope, $scope.selectedClientId);
            }

            $scope.audienceSelected = [];
            $scope.selectedBrand = [];
            $scope.selectedSocial = [];
            $scope.selectedHandle = [];
            $scope.selectedCountry = [];
            $scope.selectedState = [];
            $scope.selectedCurrency = [];
            $scope.selectedTeam = [];

            $scope.extraSettings = SINGLE_CLIENT_DROPDOWN;
            $scope.extraMultiSettings = MULTIPLE_DROPDOWN_SETTING;

            composePostHelper.getAudience($scope);

            jQuery('.prev-step').on('click', function (e) {
                var $activeTab = jQuery('.tab-pane.active');

                var formName = jQuery(this).closest('form').attr('name');

                if (jQuery(e.target).hasClass('next-step')) {

                } else {
                    var prevTab = $activeTab.prev('.tab-pane').attr('id');
                    jQuery('[href="#' + prevTab + '"]').addClass('btn-info').removeClass('btn-default');
                    jQuery('[href="#' + prevTab + '"]').tab('show');

                    var res = prevTab.substring(4, 5);
                    res = parseInt(res) + 1;
                    var nextTab = "menu" + res + "";
                    jQuery('.process-step.bs-wizard-step.' + nextTab + '').addClass('disabled').removeClass('active');
                    jQuery('.process-step.bs-wizard-step.' + prevTab + '').addClass('active').removeClass('complete');
                }

            });
            /**
             * file manager
             */
            $scope.opeFileManager = function () {
                jQuery('#campaignPic').click();
            }

            $scope.changeMySrc = function () {
                if (typeof $scope.file != 'undefined' && $scope.file != null) {
                    if (helperFactory.getImageMessages($scope.file)) {
                        $scope.campaignImage = $scope.file.$ngfBlobUrl;
                    } else {
                        $scope.file = null;
                    }
                }
            }

            var that = this;
            that.visibility = true;
            $scope.campaign = {};
            $scope.clientPlatformHandle = [];
            securityGroups.socialPlatformAction($scope, false, outreachHelper);
            var action;
            $scope.teams = [];
            $scope.handlerPost = [];
            $scope.brandPost = [];

            if (!userHelper.isAdmin()) {
                action = API_PATH + "team_client_" + helperFactory.getLoggedInUserClientId();
                $scope.selectedClientId = helperFactory.getLoggedInUserClientId();
                outreachHelper.getTeamByClientId($scope, $scope.selectedClientId);
            }

            outreachHelper.getAllCurrency($scope);

            outreachHelper.getAllCountry($scope);

            $scope.saveCampaignStep1 = function (formName) {
                /* console.log(helperFactory.getUTCTimeStamp($scope.startDate));
                return false;
 */
                var n = 0; /**TODO*/
                /*var isValidBudgetList = outreachHelper.validateBudgetList($scope, $scope.selectedPlatformList);*/
                if ($scope.adminClientDropdown && $scope.selectedClient.length > 0) {
                    $scope.selectedClientErrorFlag = false;
                } else {
                    $scope.selectedClientErrorFlag = true;
                }
                if (!$scope.adminClientDropdown) {
                    $scope.selectedClientErrorFlag = false;
                }
                if ($scope.selectedBrand.length > 0) {
                    $scope.selectedBrandsErrorFlag = false;
                } else {
                    $scope.selectedBrandsErrorFlag = true;
                }

                if ($scope.selectedHandle.length > 0) {
                    $scope.selectedHandlersErrorFlag = false;
                } else {
                    $scope.selectedHandlersErrorFlag = true;
                }

                if ($scope.selectedSocial.length > 0) {
                    $scope.mediaChannelErrorFlag = false;
                } else {
                    $scope.mediaChannelErrorFlag = true;
                }

                if ($scope.selectedCurrency.length > 0) {
                    var isValidBudgetList = outreachHelper.validateBudgetList($scope, $scope.selectedPlatformList);
                } else {
                    var isValidBudgetList = true;
                }

                if (formName.$valid && !$scope.selectedBrandsErrorFlag && !$scope.mediaChannelErrorFlag && !$scope.selectedHandlersErrorFlag && !$scope.selectedClientErrorFlag && isValidBudgetList) {
                    /*if (true) {*/
                    var $activeTab = jQuery('.tab-pane.active');
                    var nextTab = $activeTab.next('.tab-pane').attr('id');
                    jQuery('[href="#' + nextTab + '"]').addClass('btn-info').removeClass('btn-default');
                    jQuery('[href="#' + nextTab + '"]').tab('show');

                    var res = nextTab.substring(4, 5);
                    res = parseInt(res) - 1;
                    var prevTab = "menu" + res + "";


                    jQuery('#menu1').removeClass('active in');
                    jQuery('.process-step.menu1').removeClass('active').addClass('complete');
                    jQuery('.process-step.menu2').removeClass('disabled').addClass('active');
                    jQuery('#menu2').addClass('active in');
                }
            }

            securityGroups.budgetListAction($scope);
            $scope.addNewListPlatform();

            function isSelected(element) {
                return element;
            }

            $scope.onTagAdding = function (tag) {
                var str = tag.text;
                var indices = [];
                for (var i = 0; i < str.length; i++) {
                    if (str[i] === "#") indices.push(i);
                }
                if (indices.length > 1 || (indices.length) == 1 && indices[0] > 0) {
                    return false;
                }
            }

            $scope.tagAdded = function (tag) {
                $scope.hashtagsError = false;
                $scope.hashtagsErrorMsg = "";
                jQuery("#hashtagsData").removeClass('formErrorMsgCampBorer');
            };

            $scope.tagAddedKeywords = function (tag) {

                $scope.keywordsError = false;
                $scope.keywordsErrorMsg = "";
                jQuery("#keywordsData").removeClass('formErrorMsgCampBorer');
            };

            $scope.tagAddedHashtags = function (tag) {

                $scope.hashtagsError = false;
                $scope.hashtagsErrorMsg = "";
                jQuery("#hashtagsData").removeClass('formErrorMsgCampBorer');
            };

            function saveCampaignData(campignParams) {
                httpServices.postMediaRequest(API_URL + '/media', campignParams).then(function (data) {
                    if (data.status == 200) {
                        helperFactory.successMessage(data.message);
                        $state.go('campaignListing')

                    } else {
                        $scope.errorMsgLogin = '';
                        helperFactory.errorMessage(data.message);
                    }
                }).catch(function (error) {
                    $scope.errorMsgLogin = 'Server error.';
                });
            }

            $scope.saveCampaign = function (formName) {
                
                if ($scope.campaign.keywords != undefined && $scope.campaign.keywords.length > 0) {
                    $scope.keywordsError = false;
                    $scope.keywordsErrorMsg = "";
                    jQuery("#keywordsData").removeClass('formErrorMsgCampBorer');
                } else {
                    $scope.keywordsError = true;
                    $scope.keywordsErrorMsg = "Required";
                    jQuery("#keywordsData").addClass('formErrorMsgCampBorer');
                }

                if ($scope.campaign.hashtags != undefined && $scope.campaign.hashtags.length > 0) {
                    $scope.hashtagsError = false;
                    $scope.hashtagsErrorMsg = "";
                    jQuery("#hashtagsData").removeClass('formErrorMsgCampBorer');
                } else {
                    $scope.hashtagsError = true;
                    $scope.hashtagsErrorMsg = "Required";
                    jQuery("#hashtagsData").addClass('formErrorMsgCampBorer');
                }

                if ($scope.selectedTeam.length > 0) {
                    $scope.selectedTeamErrorFlag = false;
                } else {
                    $scope.selectedTeamErrorFlag = true;
                }



                if (formName.$valid && !$scope.keywordsError && !$scope.selectedTeamErrorFlag && !$scope.hashtagsError) {
                    var formData = {};
                    var targetAudience = [];
                    $scope.makePostMetricsModel();
                    angular.forEach($scope.audienceSelected, function (aud) {
                        delete aud.label;
                        targetAudience.push(aud);
                    })
                    if (targetAudience.length > 0) {
                        formData.targetAudience = targetAudience;
                    }
                    if (userHelper.isAdmin()) {
                        formData.clientId = $scope.selectedClientId;
                    } else {
                        formData.clientId = localstorage.get('clientId');
                    }
                    formData.createdBy = localstorage.get('userId');
                   // Date.parse(new Date().toUTCString())

                    formData.startDate = helperFactory.getUTCTimeStamp($scope.startDate);
                    formData.endDate = helperFactory.getUTCTimeStamp($scope.endDate) + (86400 - 1) * 1000;

                    formData.title = $scope.campaign.title;
                    formData.objective = $scope.campaign.objective;
                    formData.description = $scope.campaign.description;
                    delete $scope.selectedTeam[0].label
                    formData.team = $scope.selectedTeam[0];
                    formData.platformList = [];
                    formData.handles = [];
                    formData.brands = [];
                    formData.status = 1;
                    formData.keywords = [];
                    formData.hashtags = [];
                    angular.forEach($scope.campaign.keywords, function (data) {
                        formData.keywords.push(data.text);
                    });

                    angular.forEach($scope.campaign.hashtags, function (data) {
                        formData.hashtags.push(data.text);
                    });

                    angular.forEach($scope.selectedHandle, function (data) {
                        var tmpData = data;
                        delete tmpData.label;
                        formData.handles.push(tmpData);
                    });
                    angular.forEach($scope.selectedBrand, function (data) {
                        var editBrand = data;
                        delete editBrand.label;
                        formData.brands.push(editBrand);
                    });

                    angular.forEach($scope.selectedSocial, function (data) {
                        var tmpData = data;
                        delete tmpData.label;
                        delete tmpData.select;
                        delete tmpData.class;
                        delete tmpData.href;
                        formData.platformList.push(tmpData);
                    });

                    var budgetListData = [];
                    angular.forEach($scope.selectedPlatformList, function (budget) {
                        if (budget.platform && budget.platform && budget.durability && budget.budget && budget.startDate && budget.endDate) {
                            delete budget.platform.class;
                            delete budget.platform.href;

                            if ($scope.selectedCurrency.length > 0) {
                                budgetListData.push({
                                    "platform": budget.platform.name,
                                    "platformId": budget.platform.id,
                                    "budget": budget.budget,
                                    "duration": budget.durability,
                                    "startDate": helperFactory.getUTCTimeStamp(budget.startDate),
                                    "endDate": helperFactory.getUTCTimeStamp(budget.endDate),
                                    "currency": $scope.selectedCurrency[0].name
                                });
                            }

                        }
                    })

                    if (budgetListData.length > 0) {
                        formData.budgetList = budgetListData;
                    }

                    formData.postMetrics = $scope.noteTriggerData;

                    formData.location = {};
                    if ($scope.selectedCountry.length > 0) {
                        formData.location.country = $scope.selectedCountry[0].label;
                    }
                    if ($scope.selectedState.length > 0) {
                        formData.location.region = $scope.selectedState[0].label;
                    }
                    if (!helperFactory.isEmpty($scope.selectedCity)) {
                        formData.location.city = $scope.selectedCity;
                    }

                    var campignParams = {
                        'action': API_PATH + "campaign",
                        'rawBody': formData,
                        'rawBodyKey': 'campaign',
                        'fileKey': 'logo',
                    };



                    if ($scope.file) {
                        fileName = $scope.file.name;
                        Upload.upload({
                            url: API_URL + '/image',
                            data: {
                                file: $scope.file
                            }
                        }).then(function (resp) {
                            if (resp.data.error_code === 0) {
                                campignParams.file = resp.data.upload_file_name;
                                saveCampaignData(campignParams);
                            }
                        }, function (resp) {

                        }, function (evt) {});
                    } else {
                        campignParams.file = null;
                        saveCampaignData(campignParams);
                    }

                }
            }

            securityGroups.selectAudienceAction($scope);

            $scope.formValidator = formValidator;

            $scope.listValidator = function (inptVal) {
                return formValidator.listValidatorAudience($scope.selectedAud.length);
            }
            outreachHelper.fetchPostMetrics($scope);
            $scope.changeClient = function (data) {
                $scope.selectedClientErrorFlag = false;
                $scope.handlerPost = [];
                $scope.brandPost = [];
                $scope.selectedBrand = [];
                $scope.selectedClientId = data.id;
                outreachHelper.getTeamByClientId($scope, $scope.selectedClientId);
                outreachHelper.handleFromSocialClient($scope);
                outreachHelper.fetchClientBrands($scope, $scope.selectedClientId);
            }
            /*On unchecked client*/
            $scope.onDeselectClient = function (data) {
                $scope.handlerPost = [];
                $scope.brandPost = [];
                $scope.selectedBrand = [];
                $scope.selectedClientId = null;
            }
            /*On unchecked client*/

            outreachHelper.updateTeamDropdown($scope);
            outreachHelper.updateBrandDropdown($scope);
            outreachHelper.updateHandleDropdown($scope);
            outreachHelper.updateSocialPlatform($scope);
            outreachHelper.updateCountryAndState($scope);

        });
})