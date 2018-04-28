/**
 * @author Gaurav Sirauthiya
 */
define([
    'angular',
    'angularRoute'
], function (angular, angularRoute) {

    angular.module('socioApp.client.clientHelper', [])
        .factory('clientHelper', function ($state, helperFactory, httpServices, $timeout, userHelper, localstorage, $http) {
            var clientHelper = {};
            /**
            * @method get Licence Type
            * @param scope,httpServices,helperFactory 
            */
            clientHelper.getLicenceTypeData = function (scope, httpServices, helperFactory) {
                /* fetch license type */
                scope.licenseTypeData = null;
                var params = {
                    'action': API_PATH + 'licence_all'
                }
                httpServices.getRequest(API_URL, params).then(function (response) {
                    if (response.status == 200 && !helperFactory.isEmpty(response.data)) {
                        scope.licenseTypeData = response.data;
                    }
                }).catch(function (error) {
                    scope.errorMsgLogin = 'Server error.';
                });
            }
            /**
             * @method get Industries
             * @param scope,httpServices,helperFactory 
             */
            clientHelper.getIndustriesData = function (scope, httpServices, helperFactory) {
                var params = {
                    'action': API_PATH + 'industry_all'
                }
                httpServices.getRequest(API_URL, params).then(function (response) {
                    if (response.status == 200 && !helperFactory.isEmpty(response.data)) {
                        scope.industries = response.data;
                        scope.industry = '';
                    }
                }).catch(function (error) {
                    scope.errorMsgLogin = 'Server error.';
                });
            }

            /* fetch segments by industry id */
            clientHelper.getSegmentsByIndustry = function (scope, httpServices, helperFactory) {
                scope.getSegments = function ($val) {
                    var params = {
                        'action': API_PATH + 'segment_industry_' + $val
                    }
                    httpServices.getRequest(API_URL, params).then(function (response) {
                        if (response.status == 200) {
                            scope.segmentsData = response.data;
                        }
                    }).catch(function (error) {
                        scope.errorMsgLogin = 'Server error.';
                    });
                }
            }
            /**
             * @method get SubSegments
             * @param scope,httpServices,helperFactory 
             */
            clientHelper.getSubSegmentsByIndustry = function (scope, httpServices, helperFactory) {
                /* fetch sub segments */
                scope.getSubSegments = function ($id) {
                    if (typeof $id != 'undefined') {
                        var params = {
                            'action': API_PATH + 'subsegment_segment_' + $id
                        }
                        httpServices.getRequest(API_URL, params).then(function (response) {
                            if (response.status == 200) {
                                scope.subSegmentsData = response.data;
                            }
                        }).catch(function (error) {
                            scope.errorMsgLogin = 'Server error.';
                        });
                    }
                }
            }

            /**
             * @method get all countries
             */
            clientHelper.getAllCountriesData = function (scope, httpServices, helperFactory) {
                scope.helperFactory = helperFactory;
                scope.getAllCountries = function () {
                    scope.countryData = null;
                    var params = {
                        'action': API_PATH + 'country_all',
                        'page': 0,
                        'size': 300,
                    }
                    httpServices.getRequest(API_URL, params).then(function (response) {
                        if (response.status == 200 && !helperFactory.isEmpty(response.data)) {
                            scope.countryData = response.data;
                        }
                    }).catch(function (error) {
                        scope.errorMsgLogin = 'Server error.';
                    });
                }
            }
            /**
            * @method get brands by client ID
            */
            clientHelper.getBrandsDataById = function (scope, httpServices, helperFactory) {
                scope.getBrandsById = function ($id) {
                    var params = {
                        'action': API_PATH + 'brand_client_' + $id
                    }
                    httpServices.getRequest(API_URL, params).then(function (response) {
                        if (response.status == 200) {
                            scope.clientBrands = response.data;
                        }
                    }).catch(function (error) {
                        scope.errorMsgLogin = 'Server error.';
                    });
                }
            }
            /**
             * @method get licence type by ID
             */
            clientHelper.getLicenceNameById = function (scope, httpServices, helperFactory) {
                scope.getLicenceById = function ($id) {
                    var params = {
                        'action': API_PATH + 'licence_' + $id
                    }
                    httpServices.getRequest(API_URL, params).then(function (response) {
                        if (response.status == 200 && !helperFactory.isEmpty(response.data)) {
                            scope.licenceName = response.data.licenceType;
                        }
                    }).catch(function (error) {
                        scope.errorMsgLogin = 'Server error.';
                    });
                }
            }

            /**
             * @method get sub segment by id
             */
            clientHelper.getSubSegmentNameById = function (scope, httpServices, helperFactory) {
                scope.getSubSegmentById = function ($id) {
                    var params = {
                        'action': API_PATH + 'subsegment_' + $id
                    }
                    httpServices.getRequest(API_URL, params).then(function (response) {
                        if (response.status == 200 && !helperFactory.isEmpty(response.data)) {
                            scope.subSegmentName = response.data.subSegmentName;
                        }
                    }).catch(function (error) {
                        scope.errorMsgLogin = 'Server error.';
                    });
                }
            }
            /**
             * @method get segment by id
             */
            clientHelper.getSegmentNameById = function (scope, httpServices, helperFactory) {
                scope.getSegmentById = function ($id) {
                    var params = {
                        'action': API_PATH + 'segment_' + $id
                    }
                    httpServices.getRequest(API_URL, params).then(function (response) {
                        if (response.status == 200 && !helperFactory.isEmpty(response.data)) {
                            scope.segmentName = response.data.segmentName;
                        }
                    }).catch(function (error) {
                        scope.errorMsgLogin = 'Server error.';
                    });
                }
            }

            /**
             * @method get Industry by id
             */
            clientHelper.getIndustryNameById = function (scope, httpServices, helperFactory) {
                scope.getIndustryById = function ($id) {
                    var params = {
                        'action': API_PATH + 'industry_' + $id
                    }
                    httpServices.getRequest(API_URL, params).then(function (response) {
                        if (response.status == 200 && !helperFactory.isEmpty(response.data)) {
                            scope.industryName = response.data.industryName;
                        }
                    }).catch(function (error) {
                        scope.errorMsgLogin = 'Server error.';
                    });
                }
            }

            /**
             * @method getStates by country
             */
            clientHelper.getRegionByCountryIdData = function (scope, httpServices, helperFactory) {
                scope.getRegionByCountryId = function ($id) {
                    scope.countryRegionData = null;
                    var params = {
                        'action': API_PATH + 'country_' + $id,
                        'page': 0,
                        'size': 200,
                    }
                    httpServices.getRequest(API_URL, params).then(function (response) {
                        if (response.status == 200 && !helperFactory.isEmpty(response.data)) {
                            scope.countryRegionData = response.data.states;
                            scope.isdCode = response.data.code;
                        }
                    }).catch(function (error) {
                        scope.errorMsgLogin = 'Server error.';
                    });
                }
            }


            clientHelper.updateCLientData = function (scope, helperFactory, httpServices, params) {
                httpServices.postMediaRequest(API_URL + "/media/put", params).then(function (data) {
                    if (data.status == 200 && data.data != null) {
                        helperFactory.successMessage(data.message);
                    } else {
                        helperFactory.errorMessage(data.message);
                        scope.errorMsgLogin = '';
                    }
                }).catch(function (error) {
                    scope.errorMsgLogin = 'Server error.';
                });
            }

            clientHelper.fetchClientData = function (scope, httpServices, API_URL, params, helperFactory) {
                httpServices.getRequest(API_URL, params).then(function (response) {
                    if (response.status == 200 && !helperFactory.isEmpty(response.data)) {
                        scope.clientData = response.data;
                        console.log("Client data", scope.clientData)
                        localstorage.set('activeClientUsers', scope.clientData.noOfUsers);
                        localstorage.set('activeClientBrands', scope.clientData.noOfBrands);
                        /**Edited by anjani to set competitor values */
                        if (scope.clientData.competitiorsDefinitions.length > 0) {
                            angular.forEach(scope.clientData.competitiorsDefinitions, function (val, key) {
                                var keys = [];
                                angular.forEach(val.keywords, function (v, k) {
                                    keys.push({ 'text': v });
                                })
                                var editHandles = {};
                                angular.forEach(val.handles, function (hand, hk) {
                                    var hnds = [];
                                    angular.forEach(hand, function (h, h_k) {
                                        hnds.push({'text':h});
                                    });
                                    editHandles[hk] = hnds;
                                });
                                val.handle = editHandles;
                                val.keyword = keys;
                            })
                        }
                        if (scope.editMode) {
                            scope.segmentsData = scope.getSegments(scope.clientData.industry.id);
                            scope.subSegmentsData = scope.getSubSegments(scope.clientData.segment.id);
                        }
                        scope.clientData.status = 1;

                        if (response.data.profileImageUrl != null) {
                            scope.clientImage = response.data.profileImageUrl;
                        }
                        scope.clientData.startDateString = helperFactory.formatDate(scope.clientData.subscriptionStartDate, 'monthName')
                        scope.clientData.endDateString = helperFactory.formatDate(scope.clientData.subscriptionEndDate, 'monthName')

                        scope.clientData.startDateString = helperFactory.formatDate(scope.clientData.subscriptionStartDate, 'monthName');
                        scope.clientData.endDateString = helperFactory.formatDate(scope.clientData.subscriptionEndDate, 'monthName');
                    } else {
                        scope.errorMsgLogin = '';
                    }
                }).catch(function (error) {
                    scope.errorMsgLogin = 'Server error.';
                });
            }
            /**
            * @method get client's usersData
            */
            clientHelper.getClientUsersData = function ($scope) {
                var action = API_PATH + 'user_client_' + $scope.viewClient;
                var params = {
                    'action': action,
                    'q': 'status:1',
                    'page': 0,
                    'size': 200
                };

                httpServices.getRequest(API_URL, params).then(function (response) {
                    if (response.status == 200) {
                        $scope.cuData = response.data;
                        angular.forEach($scope.cuData, function (usr) {
                            $scope.usersForTeam.push({ 'id': usr.id, 'label': usr.fullName + ' ('+usr.email+')' });
                        })
                    } else if (response.status == 200 && helperFactory.isEmpty($scope.cuData)) {
                        $scope.cuData = null;
                    } else {
                    }
                }).catch(function (error) {
                    $scope.errorMsgLogin = 'Server error.';
                });
            }
            /**
             * @method get client's ApproversData
             */
            clientHelper.getApproversData = function ($scope) {
                var action = API_PATH + "user_approver_" + $scope.viewClient;
                var params = {
                    'action': action,
                    'page': 0,
                    'q': 'status:1',
                    'size': 200,
                };

                httpServices.getRequest(API_URL, params).then(function (response) {
                    if (response.status == 200) {
                        $scope.approverData = response.data;
                        angular.forEach($scope.approverData, function (usr) {
                            $scope.approversForTeam.push({ 'id': usr.id, 'label': usr.fullName + ' ('+usr.email+')' });
                        })
                    } else if (response.status == 200 && helperFactory.isEmpty($scope.approverData)) {
                        $scope.approverData = null;
                    } else {
                    }
                }).catch(function (error) {
                    $scope.errorMsgLogin = 'Server error.';
                });
            }
            /**
             * @method saveBrand
             */
            clientHelper.saveBrand = function (scope, httpServices, helperFactory, Upload, state, brand = false) {
                if (brand.file && brand.file != undefined && brand.file != null) {
                    Upload.upload({
                        url: API_URL + '/image',
                        data: {
                            file: brand.file
                        }
                    }).then(function (resp) {
                        if (resp.data.status == 200) {
                            var formData = {
                                'name': brand.name,
                                'clientName': scope.clientBrand.label,
                                "status": 1,
                                "createdBy": helperFactory.getLoggedInUserId(),
                                "updatedBy": helperFactory.getLoggedInUserId()
                            };

                            if (userHelper.isAdmin()) {
                                formData.clientId = scope.selectedClient[0].id;
                            } else {
                                formData.clientId = helperFactory.getLoggedInUserClientId();
                            }
                            var params = {
                                'action': API_PATH + "brand",
                                'rawBody': formData,
                                'rawBodyKey': 'brand',
                                'fileKey': 'logo',
                                "file": resp.data.upload_file_name
                            };

                            httpServices.postMediaRequest(API_URL + '/media', params).then(function (data) {
                                if (data.status == 200 && !helperFactory.isEmpty(data.data)) {
                                    sessionStorage.viewClient = data.data.clientId;
                                    helperFactory.successMessage(data.message);
                                    state.go('viewClient');
                                } else {
                                    helperFactory.errorMessage(data.message);
                                }
                            }).catch(function (error) {
                                scope.errorMsgLogin = 'Server error.';
                            });
                        }
                    });
                } else {
                    var formData = {
                        'name': brand.name,
                        'clientName': scope.clientBrand.label,
                        'clientId': scope.clientBrand.id,
                        "status": 1,
                        "createdBy": helperFactory.getLoggedInUserId(),
                        "updatedBy": helperFactory.getLoggedInUserId()
                    };
                    if (userHelper.isAdmin()) {
                        formData.clientId = scope.selectedClient[0].id;
                    } else {
                        formData.clientId = helperFactory.getLoggedInUserClientId();
                    }
                    var params = {
                        'action': API_PATH + "brand",
                        'rawBody': formData,
                        'rawBodyKey': 'brand',
                        'fileKey': 'logo',
                        'file': null
                    };

                    httpServices.postMediaRequest(API_URL + '/media', params).then(function (data) {
                        if (data.status == 200 && !helperFactory.isEmpty(data.data)) {
                            sessionStorage.viewClient = data.data.clientId;
                            helperFactory.successMessage(data.message);
                            state.go('viewClient');
                        } else {
                            helperFactory.errorMessage(data.message);
                        }
                    }).catch(function (error) {
                        scope.errorMsgLogin = 'Server error.';
                    });
                }
            }

            /**
             * @method save saveBrandData 
             */
            clientHelper.saveBrandData = function (params, scope, helperFactory, httpServices) {
                httpServices.postMediaRequest(API_URL + '/media', params).then(function (data) {
                    if (data.status == 200 && !helperFactory.isEmpty(data.data)) {
                        scope.getBrandsById(scope.viewClient);
                        jQuery('#addClientBox').val('');
                        jQuery('#brandImage').val('');
                        scope.editClientBrand.logo = null;
                        scope.editClientBrand.name = null;
                        jQuery('#addClientBox').parent().removeClass('has-error');
                        jQuery('#addClientBox').parent().find('.validationMessage').remove();
                        helperFactory.successMessage(data.message);
                    } else {
                        helperFactory.errorMessage(data.message);
                    }
                }).catch(function (error) {
                    scope.errorMsgLogin = 'Server error.';
                });
            }
            clientHelper.saveHandler = function (params, scope, helperFactory, httpServices) {
                var platformId = '58fdde2990b3add139db1ef2';
                var action = API_PATH + 'social-handler';
                var userData = {
                    'action': action,
                    'myparam': params
                };

                var dataToSend = [{
                    clientId: scope.viewClient,
                    brandId: null,
                    handler: 'twitter',
                    status: 1,
                    socialPlatform: {
                        id: platformId
                    },
                    accessToken: {
                        accessKey: userData.myparam.accessToken,
                        accessSecret: userData.myparam.accessTokenSecret,
                        userId: userData.myparam.results.user_id,
                        profileImage: userData.myparam.image,
                        fullName: userData.myparam.fullName,
                        screen_name: userData.myparam.results.screen_name,
                        x_auth_expires: userData.myparam.results.x_auth_expires,
                        generatedAt: helperFactory.getCurrentTimeStamp()
                    },
                    platformId: platformId,
                    createdBy: helperFactory.getLoggedInUserId(),
                }
                ];
                var _param = {
                    'action': action,
                    'myparam': dataToSend
                };


                httpServices.postRequest(API_URL, _param).then(function (data) {
                    if (data.status == 200) {
                        helperFactory.successMessage(data.message);
                    } else {
                        helperFactory.errorMessage(data.message);
                    }
                }).catch(function (error) {
                    scope.errorMsgLogin = 'Server error.';
                });
            }

            /* click on user tab fetch user for this client */
            clientHelper.getHandlesByClientId = function ($scope, helperFactory, httpServices) {
                $scope.noContent = '';
                var action = API_PATH + 'social-handler_client_' + $scope.viewClient;
                var params = {
                    'action': action,
                    'q': 'status:1',
                    'page': 0,
                    'size': 20
                };
                httpServices.getRequest(API_URL, params).then(function (response) {
                    if (response.status == 200) {
                        $scope.clientHandleData = response.data;
                        $scope.facebookHandle = [];
                        $scope.twitterHandle = [];
                        if (!helperFactory.isEmpty($scope.clientHandleData)) {
                            angular.forEach($scope.clientHandleData, function (handle) {
                                try {
                                    switch (handle.socialPlatform.name.toLowerCase()) {
                                        case 'facebook':
                                            $scope.facebookHandle.push(handle);
                                            break;
                                        case 'twitter':
                                            $scope.twitterHandle.push(handle);
                                            break;
                                    }
                                } catch (err) {
                                }
                            })
                        }
                    } else if (response.status == 200 && helperFactory.isEmpty($scope.clientHandleData)) {
                        $scope.clientHandleData = null;
                        $scope.noHandle = 'No Data Found';
                    } else {
                        $scope.errorMsgLogin = '';
                    }
                }).catch(function (error) {
                    $scope.errorMsgLogin = 'Server error.';
                });
            }
            /**
             * @method get team by clientId
             */
            clientHelper.getTeamByClientId = function ($scope) {
                if (typeof $scope.viewClient != 'undefined') {
                    var action = API_PATH + "team_client_" + $scope.viewClient;
                    var params = {
                        'action': action,
                        'page': 0,
                        'size': 10,
                        'q': 'status:1,2',
                        'sort': 'createdDate' + ',' + 'desc'
                    };
                    httpServices.getRequest(API_URL, params).then(function (data) {
                        if (data.status == 200 && !helperFactory.isEmpty(data)) {
                           
                            $scope.teamListData = data.data;
                        } else {
                            $scope.teamListData = null;
                        }
                    }).catch(function (error) {
                        $scope.errorMsgLogin = 'Server error.';
                    });
                }
            }

            /**
            * @method initFB_App 
            */
            clientHelper.initFB_App = function ($scope) {

                window.fbAsyncInit = function () {
                    FB.init({
                        appId: CLIENT_ID,
                        cookie: true,
                        xfbml: true,
                        version: 'v2.9'
                    });
                    FB.AppEvents.logPageView();
                };

                (function (d, s, id) {
                    var js, fjs = d.getElementsByTagName(s)[0];
                    if (d.getElementById(id)) return;
                    js = d.createElement(s); js.id = id;
                    js.src = "//connect.facebook.net/en_GB/sdk.js";
                    fjs.parentNode.insertBefore(js, fjs);
                }(document, 'script', 'facebook-jssdk'));
            }


            /**
             * @method saveFacebookHandlers
             * @author Anjani Gupta
             * @date 12th June 2017
             */

            clientHelper.saveFacebookHandlers = function (scope, helperFactory, httpServices) {

                var pltfrmObj = localstorage.getObject('platformObj');
                var platformTitle = null;
                var platformId = null;
                var pageListData = scope.selectedFBHandlers;
                var userAccessToken = scope.accessToken;
                var loginResponse = scope.loginResponse;

                angular.forEach(pltfrmObj, function (platform) {
                    if (platform.name.toLowerCase() == 'facebook') {
                        platformTitle = platform.name.toLowerCase();
                        platformId = platform.id;
                    }
                });

                if (platformId != null && pageListData.length > 0) {

                    var dataToSend = [];
                    angular.forEach(pageListData, function (page, index) {
                        clientHelper.refreshPageToken(scope, page, pageListData.length, index, dataToSend, userAccessToken, platformId, loginResponse);
                    });


                } else {
                    alert("Platform required to add handlers.");
                }
            }


            clientHelper.refreshPageToken = function (scope, page, pageListLength, index, dataToSend, userAccessToken, platformId, loginResponse) {
                var client_id = CLIENT_ID;
                var client_secret = CLIENT_SECRET;
                var grant_type = "fb_exchange_token";
                var fb_exchange_token = page.access_token;

                $http({
                    method: "GET",
                    url: "https://graph.facebook.com/oauth/access_token?client_id=" + client_id + "&client_secret=" + client_secret + "&grant_type=fb_exchange_token&fb_exchange_token=" + fb_exchange_token,
                }).then(function mySuccess(res) {

                    var pageObj = {
                        clientId: scope.viewClient,
                        brandId: null,
                        handler: page.id,
                        status: 1,
                        socialPlatform: {
                            id: platformId
                        },
                        accessToken: {
                            "userId": loginResponse.authResponse.userID,
                            "accessToken": userAccessToken,
                            "pageAccessToken": res.data.access_token,
                            "pageId": page.id,
                            "fullName": page.name,
                            "profileImage": page.picture.data.url,
                            "screen_name": page.name
                        },
                        platformId: platformId,
                        createdBy: helperFactory.getLoggedInUserId(),
                    };
                    dataToSend.push(pageObj);

                    if (index == pageListLength - 1) {
                        var action = API_PATH + 'social-handler';
                        var _param = {
                            'action': action,
                            'myparam': dataToSend
                        };
                        httpServices.postRequest(API_URL, _param).then(function (data) {
                            if (data.status == 200) {
                                $('#pageListModel').modal('hide');
                                scope.getHandles();
                                helperFactory.successMessage(data.message);
                            } else {
                                helperFactory.errorMessage(data.message);
                            }
                        }).catch(function (error) {
                            scope.errorMsgLogin = 'Server error.';
                        });
                    }

                });
            }
            return clientHelper;
        });
});

