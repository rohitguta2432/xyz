/**
 * @author Gaurav Sirauthiya
 */
define([
    'angular',
    'angularRoute',
    'jquery',
    'bootstrapDate'
], function (angular, angularRoute) {

    angular.module('socioApp.outreach.composePostController', ['ui.bootstrap.datetimepicker'])
        .constant('uiDatetimePickerConfig', {
            dateFormat: 'yyyy-MM-dd HH:mm',
            defaultTime: (new Date()).getHours() + ":" + ((new Date()).getMinutes() + 7) + ":" + ((new Date()).getSeconds()),
            html5Types: {
                date: 'yyyy-MM-dd',
                'datetime-local': 'yyyy-MM-ddTHH:mm:ss.sss',
                'month': 'yyyy-MM'
            },
            initialPicker: 'date',
            reOpenDefault: false,
            enableDate: true,
            enableTime: true,
            buttonBar: {
                show: true,
                now: {
                    show: false,
                    text: 'Now',
                    cls: 'btn-sm btn-default'
                },
                today: {
                    show: true,
                    text: 'Today',
                    cls: 'btn-sm btn-default'
                },
                clear: {
                    show: true,
                    text: 'Clear',
                    cls: 'btn-sm btn-default'
                },
                date: {
                    show: true,
                    text: 'Date',
                    cls: 'btn-sm btn-default'
                },
                time: {
                    show: true,
                    text: 'Time',
                    cls: 'btn-sm btn-default'
                },
                close: {
                    show: true,
                    text: 'Done',
                    cls: 'btn-sm btn-default'
                }
            },
            closeOnDateSelection: true,
            closeOnTimeNow: true,
            appendToBody: false,
            altInputFormats: [],
            ngModelOptions: {},
            saveAs: false,
            readAs: false
        })
        .controller('composePostController', function (socialHelper, $http, $stateParams, httpServices, $scope, $location, localstorage, helperFactory, $state, securityGroups, $timeout, rolesHelper, outreachHelper, userHelper, formValidator, contentHelper, composePostHelper, clientHelper, menuFactory, $interval) {

            /**Check if user is logged in**/
            if (!helperFactory.isLoggedIn()) {
                $state.go('login');
                return false;
            }
            $scope.refershTime = function () {
                $scope.defaultTime = (new Date()).getHours() + ":" + ((new Date()).getMinutes() + 7) + ":" + ((new Date()).getSeconds());
            }

            $interval($scope.refershTime, 1000);

            var canComposePost = rolesHelper.canCreate('MANAGE_POST') && rolesHelper.canView('GET_BRAND_FOR_CLIENT') && rolesHelper.canView('GET_CAMPAIGN_BY_CLIENT') && rolesHelper.canView('GET_SOCIAL_HANDLER_BY_CLIENT_PLATFORM_ID');
            if (!canComposePost) {
                $state.go('summary');
            }

            $scope.getHandleImage = function (handleObject, plateForm) {
                var _arr = [];
                angular.forEach(handleObject, function (value, key) {
                    if (value.platform.toLowerCase() == plateForm) {
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
                    if (value.platform.toLowerCase() == plateForm) {
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

            $scope.addContentFormInstance = $scope.test;
            /* $scope.refreshTime = function(){
                defaultTimeConfig = (new Date()).getHours() + ":" + ((new Date()).getMinutes() + 6) + ":" + ((new Date()).getSeconds());
             }*/
            /**Constant**/
            $scope.$emit('pageTitle', "Compose Post");
            $scope.$emit('menuItem', menuFactory.getMenuItems($scope));
            $scope.$emit('getHeader', true);
            $scope.$emit('getSidebar', true);
            $scope.$emit('getFooter', true);
            $scope.$emit('titleSection', true);
            $scope.composeTab = "active";
            $scope.saveAndScheduleBtn = false;
            $scope.clientDropdown = false;
            $scope.notifyCheck = false;
            $scope.selectedHandler = "";
            $scope.composePostBtn = false;
            $scope.viewCampaign = false;
            $scope.campaignId = "";
            $scope.campaignName = "";
            $scope.dx = [];
            $scope.tabDisable = [true, false, false];
            $scope.clientListingData = {};
            $scope.chekCampaignEnabled = false;
            $scope.step0 = true;
            $scope.audienceData = [];
            $scope.page = 0;
            $scope.handlersOpt = [];
            $scope.selectedHandlerPlatform = [];

            $scope.isBrandDisabled = true;
            $scope.isPlatformDisabled = true;
            $scope.isHandlerDisabled = true;
            $scope.isCampaignDisabled = true;
            $scope.selectedHandlersData = {};
            $scope.isOpen = false;

            $scope.lastSelected = "";
            $scope.currentSelected = "";


            $scope.openCalendar = function (e) {
                $scope.isOpen = true;
            };
            /*form validation*/
            $scope.formValidator = formValidator;
            /**Client dropdown setting*/
            $scope.selectedClientPost = [];
            /**Brand dropdown setting*/
            $scope.selectedBrand = [];
            /**Campaign dropdown setting*/
            $scope.selectedCampaign = [];
            /**Platform dropdown setting*/
            $scope.selectedPlatform = [];
            /**Handlers dropdown setting*/
            $scope.selectedHandlers = [];
            /**Audiences dropdown setting*/
            $scope.selectedAudience = [];

            $scope.selectedClientError = false;
            $scope.selectedBrandError = false;
            $scope.selectedPlatformError = false;
            $scope.selectedHandlersError = false;
            $scope.postDescError = false;
            jQuery('.dropdown-menu.custom_sdropdown').on('click', function (event) {
                event.stopPropagation();
            });

            $scope.extraSettings = SINGLE_CLIENT_DROPDOWN;

            $scope.extraMultiSettings = MULTIPLE_DROPDOWN_SETTING;
            $scope.isAdmin = false;
            /**Check if user is admin**/

            if (userHelper.isAdmin() || userHelper.isContentAppover()) {
                $scope.showPostButton = true;
            }

            /**If post is editable */
            $scope.editPostData = function () {
                $scope.selectedMedia = [];
                $scope.currentPostData = localstorage.getObject("currentPost");
                console.log($scope.currentPostData);
                $scope.clientId = $scope.currentPostData.clientId;
                $scope.tinymceModel = $scope.currentPostData.text;
                //console.log($scope.tinymceModel);
                if ($scope.tinymceModel != null) {
                    $scope.twtPrevContent = composePostHelper.splitter($scope.tinymceModel, 141);
                } else {
                    $scope.twtPrevContent = $scope.tinymceModel;
                }

                composePostHelper.getBrandByClientId($scope);
                composePostHelper.getCampaignByClient($scope);
                $scope.isBrandDisabled = false;
                $scope.isCampaignDisabled = false;

                $scope.isPlatformDisabled = false;
                $scope.isHandlerDisabled = false;

                $scope.iseditablePost = true;
                $scope.editablePostId = $scope.currentPostData.id;
                angular.forEach($scope.currentPostData.mediaUrls, function (med) {
                    $scope.showGallery = true;
                    med.select = true;
                    $scope.selectedMedia.push(med);
                })
            }


            if (userHelper.isAdmin()) {
                $scope.isAdmin = true;
                $scope.clientDropdown = true;
                /* Client dropdown settings*/
                composePostHelper.getClient($scope, httpServices, helperFactory, localstorage);
                if (composePostHelper.isPostEdit()) {

                    $scope.editPostData();

                } else {
                    $scope.iseditablePost = false;
                }
            } else {
                if (composePostHelper.isPostEdit()) {
                    $scope.editPostData();
                } else {
                    /* fetch Campaign & Brand by client id */
                    $scope.selectedClientId = localstorage.get('clientId');
                    $scope.clientId = localstorage.get('clientId');
                    $scope.clientName = localstorage.get('clientName');
                    composePostHelper.getBrandByClientId($scope);
                    composePostHelper.getCampaignByClient($scope);
                    $scope.isBrandDisabled = false;
                    $scope.isPlatformDisabled = false;
                    $scope.isCampaignDisabled = false;
                    $scope.iseditablePost = false;
                }
            }

            /**Load default data*/

            if (!composePostHelper.isPostEdit()) {
                composePostHelper.getPlatforms($scope);
            }
            composePostHelper.getAudience($scope);
            $scope.clientComptitors = null;
            /*if user is admin*/
            $scope.changeClientDropDownP = function () {
                $scope.clientId = $scope.selectedClientPost[0].id;
                __c.log($scope.selectedClientPost[0]);
                $scope.clientComptitors = $scope.selectedClientPost[0].competitiorsDefinitions;
                $scope.clientName = $scope.selectedClientPost[0].label;
                $scope.isBrandDisabled = false;
                $scope.isPlatformDisabled = false;
                $scope.isCampaignDisabled = false;
                $scope.isHandlerDisabled = true;
                composePostHelper.getBrandByClientId($scope);
                composePostHelper.getCampaignByClient($scope);
                /**Refreh platform on client change*/
                $scope.selectedPlatform = [];
                composePostHelper.getPlatforms($scope);
                /**Refreh handlers on client change*/
                var woeid = ($scope.selectedClientPost[0].woeid != null) ? $scope.selectedClientPost[0].woeid : 23424848;
                socialHelper.getTwitterTrends($scope, woeid);
                $scope.selectedHandlers = [];
                $scope.selectedBrand = [];
                $scope.handlersOpt = [];
                /**error hide on selection */
                $scope.selectedClientError = false;
            }
            /*On unchecked client*/
            $scope.onDeselectClientP = function () {
                $scope.isBrandDisabled = true;
                $scope.isPlatformDisabled = true;
                $scope.isHandlerDisabled = true;
                $scope.isCampaignDisabled = true;
                $scope.clientComptitors = null;
                $scope.selectedBrand = [];
                $scope.selectedPlatform = [];
            }
            /*On unchecked client*/
            $scope.onDeselectPlatform = function (item) {
                /**Refreh handlers*/
                $scope.selectedHandlers = [];
                if ($scope.selectedPlatform.length > 0) {
                    $scope.platformId = item.id;
                    composePostHelper.refreshHandlers($scope);

                } else {
                    $scope.handlersOpt = [];
                    $scope.isHandlerDisabled = true;
                }

            }

            /*On platforms selection load handlers*/
            $scope.changePlatforms = function (data) {
                /**error hide on selection */
                $scope.selectedPlatformError = false;
                $scope.platformId = data.id;
                $scope.isHandlerDisabled = false;
                composePostHelper.getHandlers($scope);
            }

            /*On platforms selection load handlers*/
            $scope.changeCampaign = function (data) {
                $scope.selectedPlatform = [];
                $scope.selectedHandlers = [];
                $scope.handlersOpt = [];
                $scope.campaignId = data.id;
                composePostHelper.getPlatformsByCampaignId($scope);

                //$scope.picker1.datepickerOptions.maxDate = (new Date(data.endDate + (86400 - 1) * 1000)).toDateString();
                $scope.picker1.datepickerOptions.maxDate = (new Date(data.endDate)).toDateString();
            }

            /*On platforms selection load handlers*/
            $scope.deSelectCampaign = function (data) {
                $scope.picker1.datepickerOptions.maxDate = null;
                $scope.handlersOpt = [];
                $scope.selectedHandlers = [];
                $scope.selectedPlatform = [];
                $scope.isHandlerDisabled = true;
                composePostHelper.getPlatforms($scope);
            }

            /*On brand selection*/
            $scope.changeBrand = function (data) {
                $scope.selectedBrandError = false;
            }

            function getPlatform(platformId, index) {
                angular.forEach($scope.platformOpt, function (platform) {
                    if (platform.id == platformId) {
                        $scope.selectedHandlerPlatform[index] = platform;
                        console.log('final::: ', $scope.selectedHandlerPlatform);
                    }
                })
            }

            $scope.updateSelectedPlatformList = function () {
                console.log($scope.platformOpt, ' init ', $scope.selectedHandlers);
                $scope.selectedHandlerPlatform = [];
                var indexCount = 0;
                angular.forEach($scope.selectedHandlers, function (handle) {
                    var isExist = false;
                    if ($scope.selectedHandlerPlatform.length > 0) {
                        var isExist = false;
                        angular.forEach($scope.selectedHandlerPlatform, function (unq) {
                            if (handle.platformId == unq.id) {
                                isExist = true;
                            }
                        })
                        if (!isExist) {
                            getPlatform(handle.platformId, indexCount);
                            indexCount++;
                        }
                    } else {
                        getPlatform(handle.platformId, indexCount);
                        indexCount++;
                    }
                })
            }

            /*On handlers selection*/
            $scope.changeHandlers = function (data) {
                $scope.selectedHandlersError = false;
                $scope.updateSelectedPlatformList();
            }
            /*On handlers selection*/
            $scope.onDeselectHandlers = function (data) {
                $scope.updateSelectedPlatformList();
            }

            /*URL Shortener*/
            $scope.srtnBtnTxt = "Shorten";
            $scope.doShortenUrl = function () {
                if ($scope.shortenURL != undefined && $scope.shortenURL != "" && $scope.shortenURL != null) {
                    $scope.srtnBtnTxt = "Wait..";

                    var n1 = $scope.shortenURL.indexOf("http://");
                    var n2 = $scope.shortenURL.indexOf("https://");

                    if (n1 != -1 || n2 != -1) {
                        var _url = $scope.shortenURL;
                    } else {
                        var _url = 'http://' + $scope.shortenURL;
                    }

                    $http({
                        method: 'GET',
                        url: 'https://api-ssl.bitly.com/v3/shorten?access_token=d04650aa89aa68f9ff369b3bc500a7bc597ebc88&longUrl=' + _url
                    })
                        .then(function (data, status, headers, config) {
                            $scope.shortenURL = "";
                            if ($scope.tinymceModel != undefined) {
                                $scope.tinymceModel += " " + data.data.data.url;
                                var _tt = jQuery('#composePostEditor').val() + " " + data.data.data.url;
                                jQuery('#composePostEditor').val(_tt)
                                var _pp = jQuery('.copier').html() + " " + data.data.data.url;
                                jQuery('.copier').html(_pp);
                            } else {
                                $scope.tinymceModel = data.data.data.url;
                            }
                            $scope.srtnBtnTxt = "Shorten";
                        },
                        function myError(data, status, headers, config) {
                            $scope.srtnBtnTxt = "Shorten";
                        });
                }

            }

            $scope.isMediaSelected = false;
            $scope.selectedMedia = [];
            $scope.showGallery = false;
            $scope.quantity = 4;


            /***********************************************************************************************************************************************************************/
            //written by gaurav check conditions
            $scope.isEnablePlatform = false;
            if (!userHelper.isAdmin()) {
                $scope.isEnablePlatform = true;
                $scope.chekCampaignEnabled = true;
                $scope.clientListingData.selectedClient = helperFactory.getLoggedInUserClientId();
            }


            $scope.popupContent = '';
            $scope.setDataToEditor = function (value) {
                //console.log(value)
                //$scope.popupContent = value;
                $scope.tinymceModel = value;
            }

            /**Break twt content */
            $scope.isContent = function (data) {
                if (data != undefined && data != "" && data != null) {
                    $scope.postDescError = false;
                    $scope.twtPrevContent = composePostHelper.splitter(data, 141);
                }
            }

            $scope.previewContent = function () {
                $scope.isContent($scope.tinymceModel);
                $scope.seePreview = jQuery('.copier').html();
                if (composePostHelper.validatePostForm($scope)) {
                    $("#preview").modal();
                }
            }

            /*
             * @method open Media library window
             */

            $scope.openMediaLib = function (mediaType) {
                $scope.mediaType = mediaType;
                $scope.mediaErrorMsg = "";
                if ($scope.clientId != undefined) {
                    $timeout(function () {
                        jQuery('#myContentModal').modal();
                        jQuery('#mediaTab').click();
                    });
                } else {
                    $scope.selectedClientError = true;
                }
            }


            $scope.setMedia = function (key, media) {

                if ($scope.selectedMedia.length == 0) {
                    media.select = true;
                    $scope.selectedMedia.push(media);
                } else {
                    if ($scope.selectedMedia[0].mediaType.toLowerCase() != $scope.mediaType.toLowerCase()) {
                        $scope.selectedMedia = [];
                        media.select = true;
                        $scope.selectedMedia.push(media);
                    } else {
                        var matchFound = -1;
                        angular.forEach($scope.selectedMedia, function (selMed, selIndex) {
                            if (media.id == selMed.id) {
                                matchFound = selIndex;
                            }
                        })
                        if (matchFound == -1) {
                            media.select = true;
                            $scope.selectedMedia.push(media);
                        } else {
                            media.select = false;
                            $scope.selectedMedia.splice(matchFound, 1);
                        }
                    }

                    if ($scope.selectedMedia.length > 4 && $scope.mediaType.toLowerCase() == "image") {
                        $scope.mediaErrorMsg = "You can share maximum 4 images.";
                        angular.forEach($scope.selectedMedia, function (mediaCom, ind) {
                            if (media.id == mediaCom.id) {
                                media.select = false;
                                $scope.selectedMedia.splice(ind, 1);
                            }
                        });
                        console.log($scope.selectedMedia)
                    } else if ($scope.selectedMedia.length > 1 && $scope.mediaType.toLowerCase() == "video") {
                        $scope.mediaErrorMsg = "You can share maximum 1 video.";
                        angular.forEach($scope.selectedMedia, function (mediaCom, ind) {
                            if (media.id == mediaCom.id) {
                                media.select = false;
                                $scope.selectedMedia.splice(ind, 1);
                            }
                        });
                    } else {
                        $scope.mediaErrorMsg = "";

                    }
                }

            }

            $scope.insertMedia = function () {
                $scope.showGallery = true;
                jQuery('#myContentModal .close').click();

            }

            $scope.getPagedData = function (page) {
                if (page < $scope.dx.length && page >= 0) {
                    $scope.page = page;
                    if ($scope.tab == "content") {
                        outreachHelper.getContentView($scope);
                    } else {
                        outreachHelper.getMediaView($scope);
                    }
                }
            }

            $scope.selectedTab = function (tab) {
                $scope.page = 0;
                $scope.tab = tab;
                if (tab == "content") {
                    outreachHelper.getContentView($scope);
                } else {
                    outreachHelper.getMediaView($scope);
                }
            }

            /**
             * @method removeSelectedMedia
             */
            $scope.removeSelectedMedia = function ($key) {
                $scope.selectedMedia.splice($key, 1);
                if ($scope.selectedMedia.length == 0) {
                    $scope.showGallery = false;
                }
            }
            /** end */

            function getFormData(isDraft) {
                var formData = {};
                formData.hashTags = helperFactory.getAllWords($scope.tinymceModel);
                formData.socialHandlers = [];
                formData.clientId = $scope.clientId;
                formData.clientName = $scope.clientName;
                if ($scope.selectedBrand.length > 0) {
                    formData.brandId = $scope.selectedBrand[0].id;
                    formData.brandName = $scope.selectedBrand[0].label;
                }
                if ($scope.selectedCampaign.length > 0) {
                    formData.campaignId = $scope.selectedCampaign[0].id;
                    formData.campaignTitle = $scope.selectedCampaign[0].label;
                } else {
                    formData.campaignId = "";
                    formData.campaignTitle = "";
                }



                if ($scope.selectedHandlers.length > 0) {
                    angular.forEach($scope.selectedHandlers, function (val, index) {
                        formData.socialHandlers.push({
                            'id': val.id
                        });
                    });
                }

                if ($scope.selectedPlatform.length > 0) {
                    angular.forEach($scope.selectedPlatform, function (plt, index) {
                        var handlersIds = [];
                        angular.forEach($scope.selectedHandlers, function (hnd, ind) {
                            if (hnd.platformId == plt.id) {
                                handlersIds.push(hnd.id);
                                $scope.selectedHandlersData[hnd.platformId] = handlersIds;
                            }
                        });
                    });
                }

                formData.selectedHandlers = $scope.selectedHandlersData;
                formData.url = $scope.shortenURL;
                formData.text = $scope.tinymceModel;
                formData.mediaIds = [];
                angular.forEach($scope.selectedMedia, function (medVal, medIndex) {
                    formData.mediaIds.push(medVal.id);
                });
                formData.isNotifyUser = $scope.notifyCheck;
                formData.isDraft = isDraft;
                formData.status = 4;
                formData.audiences = [];
                formData.approvedBy = localstorage.get('userId');
                formData.createdDate = helperFactory.getUTCTimeStamp(new Date()); //helperFactory.getCurrentTimeStamp();
                formData.createdBy = localstorage.get('userId');
                formData.updatedDate = helperFactory.getUTCTimeStamp(new Date()); //helperFactory.getCurrentTimeStamp();
                formData.updatedBy = localstorage.get('userId');
                if ($scope.iseditablePost) {
                    formData.id = $scope.editablePostId;
                }

                return formData;
            }

            /**Reset form*/
            $scope.saveAddNew = function () {
                var getDatas = getFormData(true);
                if (composePostHelper.validatePostForm($scope)) {
                    var postParams = {
                        'action': API_PATH + "post",
                        'myparam': getDatas,

                    };
                    httpServices.postRequest(API_URL, postParams).then(function (data) {
                        if (data.status == 200) {
                            $scope.selectedClientPost = [];
                            $scope.selectedBrand = [];
                            $scope.selectedCampaign = [];
                            $scope.selectedPlatform = [];
                            $scope.selectedHandlers = [];
                            $scope.tinymceModel = "";

                            $scope.selectedClientError = false;
                            $scope.selectedBrandError = false;
                            $scope.selectedPlatformError = false;
                            $scope.selectedHandlersError = false;
                            $scope.isBrandDisabled = false;
                            $scope.isPlatformDisabled = false;
                            $scope.isHandlerDisabled = true;
                            $scope.isCampaignDisabled = false;

                            localstorage.delete('isPostEdit');
                            localstorage.delete('currentPost');
                            $scope.draftSuccessMsg = "Post saved successfully.";
                            helperFactory.successMessage($scope.draftSuccessMsg);
                        } else {
                            $scope.draftSuccessMsg = "Error while saving.";
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

            /*compose post step 1*/
            $scope.isContSche = false;
            
            $scope.saveDraft = function (draftForm) {
                $scope.isDrftClk = true;
                $scope.getFormData = getFormData(true);
                composePostHelper.saveInDraft($scope);
            }

            /*compose post step 2*/
            $scope.saveAndSchedule = function () {
                $scope.isDrftClk = false;
                $scope.getFormData = getFormData(true);
                composePostHelper.saveInDraft($scope);
            }



            /***validation checks */
            $scope.onSelectVal = function (field, k) {
                if (field == 'platform') {
                    $scope['errorPlt' + k] = false;
                } else if (field == 'frequency') {
                    $scope['errorFreq' + k] = false;
                }
            }
            /***validation checks */
            $scope.onDateClose = function (date, pkey, key, val = false) {

                if (date == 'sDate') {
                    $scope['errorSDate' + pkey + '' + key] = false;
                    val.endDT = null;
                    val.endDateOption = {
                        date: new Date(),
                        datepickerOptions: {
                            showWeeks: false,
                            startingDay: 0,
                            minDate: new Date(val.startDT).toDateString(),
                            maxDate: $scope.picker1.datepickerOptions.maxDate
                        }
                    }
                } else {
                    $scope['errorEDate' + pkey + '' + key] = false;
                }

            }

            /*compose post step 3*/
            $scope.saveSchecule = function (formName) {

                if (composePostHelper.validateScheduledForm($scope)) {

                    var formDataForSch = [];
                    angular.forEach($scope.allPlatforms, function (platform) {

                        if (!$scope.schedulerError && platform.frequency != null && platform.platforms != null) {
                            var schData = {};
                            schData.clientId = $scope.clientId;
                            schData.clientName = $scope.clientName;
                            schData.campaignId = $scope.campaignId;
                            schData.campaignName = $scope.campaignName;
                            schData.postId = $scope.scheduleSaveData.id;
                            schData.platformId = platform.platforms.id;
                            schData.frequencyCode = platform.frequency.id;
                            schData.createdBy = localstorage.get('userId');
                            schData.scheduleTime = [];
                            
                           /*  angular.forEach(platform.dateTime, function (dt) {
                                var tmpDT = {};
                                var date = new Date(Date.parse(dt.startDT));
                                
                                tmpDT.startTime = ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
                                if (platform.frequency.id != 9) {
                                    var dateEnd = new Date(Date.parse(dt.endDT));
                                    tmpDT.endTime = ('0' + dateEnd.getDate()).slice(-2) + '/' + ('0' + (dateEnd.getMonth() + 1)).slice(-2) + '/' + dateEnd.getFullYear() + ' ' + dateEnd.getHours() + ':' + dateEnd.getMinutes();
                                }
                                schData.scheduleTime.push(tmpDT);
                            });  */
                            
                            /*
                            * save scheduled time in UTC
                            * @author: Anjani Gupta
                            */
                            angular.forEach(platform.dateTime, function (dt) {
                                var tmpDT = {};
                                var date = new Date(Date.parse(dt.startDT));
                                
                                tmpDT.startTime = ('0' + date.getUTCDate()).slice(-2) + '/' + ('0' + (date.getUTCMonth() + 1)).slice(-2) + '/' + date.getUTCFullYear() + ' ' + ('0' + date.getUTCHours()).slice(-2) + ':' + ('0' + date.getUTCMinutes()).slice(-2);
                                if (platform.frequency.id != 9) {
                                    var dateEnd = new Date(Date.parse(dt.endDT));
                                    tmpDT.endTime = ('0' + dateEnd.getUTCDate()).slice(-2) + '/' + ('0' + (dateEnd.getUTCMonth() + 1)).slice(-2) + '/' + dateEnd.getUTCFullYear() + ' ' + ('0' + dateEnd.getUTCHours()).slice(-2) + ':' + ('0' + dateEnd.getUTCMinutes()).slice(-2);
                                }
                                schData.scheduleTime.push(tmpDT);
                            });

                            formDataForSch.push(schData);
                        }

                    })

                    var postParams = {
                        'action': API_PATH + "post_postSchedule_" + $scope.scheduleSaveData.id + "_schedule",
                        'myparam': formDataForSch
                    };
                    
                    httpServices.postRequest(API_URL, postParams).then(function (data) {
                        if (data.status == 200 && data.data) {

                            var getDatas = getFormData(false);
                            getDatas.id = $scope.scheduleSaveData.id;
                            $scope.scheduleAudData = data.data;
                            /*$scope.step2 = false;
                            $scope.step1 = false;
                            $scope.step0 = true;
                            $scope.tabDisable[0] = true;*/
                            $scope.sendForReview();
                        } else {
                            $scope.errorMsgLogin = '';
                        }
                    }).catch(function (error) {
                        $scope.errorMsgLogin = 'Server error.';
                    });

                } else {


                }
            }
            /*compose post step 4*/
            $scope.configScroll = SCROLL_CONFIG;
            $scope.sendForReview = function () {
                if ($scope.scheduleSaveData === undefined) {
                    $scope.errorAudiennceFormError = "Please create post and schedule first.";
                } else {
                    var getDatas = getFormData(false);
                    getDatas.id = $scope.scheduleSaveData.id;
                    angular.forEach($scope.selectedAudience, function (aud, ind) {
                        getDatas.audiences.push(aud.id);
                    });
                    //getDatas.audiences = $scope.selectedAudience;
                    var postUpParams = {
                        'action': API_PATH + "post_" + $scope.scheduleSaveData.id + '_activate',
                        'myparam': getDatas,
                    };
                    httpServices.postRequest(API_URL, postUpParams).then(function (upData) {
                        if (upData.status == 200) {
                            $scope.campaignId = getDatas.campaignId;
                            helperFactory.successMessage(upData.message);
                            $state.go('composePost', [], {
                                reload: true
                            });
                        } else {
                            helperFactory.errorMessage(upData.message);
                        }
                    }).catch(function (error) {
                        $scope.errorMsg = 'Server error.';
                        helperFactory.errorMessage($scope.errorMsg);
                    });

                }
            }

            $scope.activeStep = function (tabId, tabDisable) {
                if (tabDisable) {
                    switch (tabId) {
                        case 0:
                            $scope.step0 = true;
                            $scope.step1 = false;
                            $scope.step2 = false;
                            break;
                        case 1:
                            $scope.step0 = false;
                            $scope.step1 = true;
                            $scope.step2 = false;
                            break;
                        case 2:
                            $scope.step0 = false;
                            $scope.step1 = false;
                            $scope.step2 = true;
                            break;
                    }
                }
            }
            /*$scope.dateToday = {'min': (new Date()).getHours() + ":" + (new Date()).getMinutes() + ":" + (new Date()).getSeconds()};*/

            var myDate = new Date();
            /* myDate.setMinutes(myDate.getMinutes() + 5);*/


            $scope.picker1 = {
                date: myDate,
                datepickerOptions: {
                    showWeeks: false,
                    startingDay: 0,
                    minDate: new Date().toDateString(),
                    maxDate: null
                },
                timepickerOptions: {
                    min: null,
                    showMeridian: false
                }
            };
            /* $scope.picker10 = {
                 date: new Date().toDateString(),
                 timepickerOptions: {
                     max: null
                 }
             };
 
 
             $scope.picker11 = {
                 timepickerOptions: {
                     min: $scope.picker10.date
                 }
             };*/
            $scope.allFrequency = ALL_FREQUENCY;
            $scope.checkEndOption = function (freq) {
                if (!helperFactory.isEmpty(freq) && freq.id == 9) {
                    angular.forEach($scope.allPlatforms, function (platform) {
                        if (platform.frequency != null && platform.frequency.id == 9) {
                            angular.forEach(platform.dateTime, function (dt) {
                                dt.endDT = null;
                            })
                        }
                    })
                }
            }
            $scope.allPlatforms = [];
            $scope.totalRows = 1;
            $scope.addPlatform = function () {
                $scope.isContSche = true;
                var newScheduleData = {}
                if ($scope.allPlatforms.length == 0) {
                    newScheduleData.id = $scope.allPlatforms.length;
                } else {
                    newScheduleData.id = $scope.allPlatforms[$scope.allPlatforms.length - 1].id + 1;
                }
                newScheduleData.platforms = "";
                newScheduleData.frequency = {};
                newScheduleData.dateTime = [{
                    "id": 0,
                    "isStartOpen": false,
                    "isEndOpen": false,

                }];

                newScheduleData.errorPlt = false;
                $scope.allPlatforms.push(newScheduleData);
                $scope.totalRows++;
            }
            $scope.showStart = false
            $scope.addDT = function (scheduleData) {
                scheduleData.dateTime.push({
                    "id": scheduleData.dateTime[scheduleData.dateTime.length - 1].id + 1,
                    "isStartOpen": false,
                    "isEndOpen": false,
                });
            }

            /* Schedule delete button click event */
            $scope.deleteDT = function (deleteData, scheduleData) {
                if (deleteData.id == 0) {
                    var index = $scope.allPlatforms.indexOf(scheduleData);
                    $scope.allPlatforms.splice(index, 1);
                } else {
                    var index = scheduleData.dateTime.indexOf(deleteData);
                    scheduleData.dateTime.splice(index, 1);
                }
            }


            /***get social apis by Gaurav***/
            $scope.tf = {};
            /* get industries */
            clientHelper.getIndustriesData($scope, httpServices, helperFactory);


            socialHelper.getFilteredTweets($scope, 6);
            /**
             * @method set Filters
             */
            $scope.setTweetsFilter = function (industryId = false) {
                console.log($scope.tf)
                if (industryId) {
                    $scope.getSegments(industryId);
                }
                $scope.popularTweetsData = null;
                var filterData = $scope.tf;
                var str = '';
                if (typeof filterData.industryFilter != 'undefined' && filterData.industryFilter != null) {
                    str += filterData.industryFilter.industryName
                }
                if (typeof filterData.segmentFilter != 'undefined' && filterData.segmentFilter != null) {
                    str += ' OR ' + filterData.segmentFilter.segmentName
                }
                if (typeof filterData.compFilter != 'undefined' && filterData.compFilter != null) {
                    str += ' OR ' + filterData.compFilter.handles
                }
                var _queryParams = str.replace(/^( OR )/, "");
                socialHelper.getFilteredTweets($scope, 6, _queryParams);
            }

            $scope.getSegments = function ($val) {
                var params = {
                    'action': API_PATH + 'segment_industry_' + $val
                }
                httpServices.getRequest(API_URL, params).then(function (response) {
                    if (response.status == 200) {
                        $scope.allSegments = response.data;
                    }
                }).catch(function (error) {

                });
            }
            $scope.woeid = 23424848;
            if (typeof localstorage.get('userClientData') != 'undefined' && localstorage.get('userClientData') != 'undefined' && !helperFactory.isEmpty(localstorage.get('userClientData'))) {
                var clientData = JSON.parse(localstorage.get('userClientData'));
                if (typeof clientData.woeid != 'undefined' && clientData.woeid != null && clientData.woeid == parseInt(clientData.woeid, 10)) {
                    $scope.woeid = clientData.woeid
                }
                if (!userHelper.isAdmin()) {
                    $scope.clientComptitors = clientData.competitiorsDefinitions
                }
            }
            socialHelper.getTwitterTrends($scope, $scope.woeid);
            $scope.getTrends = function (global = false) {
                if (global) {
                    socialHelper.getTwitterTrends($scope, 1);
                } else {
                    socialHelper.getTwitterTrends($scope, $scope.woeid);
                }

            }
            $scope.contentDataComposePost = {};
            contentHelper.saveContentData($scope);

            /* 
                @author: Anjani
                @method: publishNow
                @date: 19/07/2017
             */
            $scope.publishPostNow = function () {
                $scope.getFormData = getFormData(false);
                composePostHelper.publishPostNow($scope);
            }

        })

});