/**
 * @author Gaurav Sirauthiya
 */
define([
    'angular',
    'angularRoute'
], function (angular, angularRoute) {

    angular.module('socioApp.outreach.outreachHelper', [])
        .factory('outreachHelper', function (localstorage, httpServices, helperFactory, userHelper, pagination, $timeout) {
            var outreachHelper = {};
            /**
            * @method validate budget list
            * @param budget object, $scope
            */
            outreachHelper.validateBudgetList = function (scope, data) {
                if (data.length > 0) {

                    var c1 = 0, c2 = 0, c3 = 0, c4 = 0, c5 = 0, n = 0;
                    angular.forEach(data, function (val, key) {
                        if (!val.platform) {
                            var k = key + 1;
                            scope['errorPlt' + k] = true;
                            c1++;
                        }

                        if (scope.editMode) {
                            if (!val.duration) {
                                var k = key + 1;
                                scope['errorDur' + k] = true;
                                c2++;
                            }
                        } else {
                            if (!val.durability) {
                                var k = key + 1;
                                scope['errorDur' + k] = true;
                                c2++;
                            }
                        }

                        if (!val.budget) {
                            var k = key + 1;
                            scope['errorBud' + k] = true;
                            c3++;
                        }


                        if (!val.startDate) {
                            var k = key + 1;
                            scope['errorSDate' + k] = true;
                            c4++;
                        }
                        if (!val.endDate) {
                            var k = key + 1;
                            scope['errorEDate' + k] = true;
                            c5++;
                        }

                    });

                    if (c1 == 0 && c2 == 0 && c3 == 0 && c4 == 0 && c5 == 0) {
                        scope.addBudgetError = "";
                        return true;
                    } else {

                        scope.addBudgetError = "Please fill all the required fields.";
                        return false;
                    }

                } else {
                    scope.addPlatfromWarning = true;
                    scope.addBudgetError = "Please add budget.";
                    return false;
                }
            }

            /**
            * @method get all client
            * @param scope,httpServices 
            */
            outreachHelper.getClient = function (scope, httpServices, helperFactory, localstorage) {
                var action = API_PATH + "client_all";
                var params = {
                    'action': action,
                    'page': 0,
                    'size': 10000,
                    'q': 'status:1'
                };
                httpServices.getRequest(API_URL, params).then(function (data) {
                    if (data.status == 200 && !helperFactory.isEmpty(data)) {
                        scope.clientData = data.data;
                        var clientList = {};
                        scope.clientOpt = [];

                        clientList.clientData = data.data;

                        angular.forEach(data.data, function (val) {
                            var clientObj = {};
                            clientObj.id = val.id;
                            clientObj.label = val.clientName;
                            clientObj.competitiorsDefinitions = val.competitiorsDefinitions;
                            clientObj.industry = val.industry;
                            clientObj.segment = val.segment;
                            clientObj.woeid = val.woeid;
                            scope.clientOpt.push(clientObj);
                        });

                        if (scope.showSelectedClient) {
                            if (scope.clientOpt.length > 0) {
                                scope.selectedClient.push(scope.clientOpt[0]);
                                scope.clientId = scope.clientOpt[0].id;
                            }
                        }

                        if (localstorage.get('editPostByClientId') && localstorage.get('isPostEdit') && localstorage.get("isPostEdit") == 'true') {

                            var selectedClientId = localstorage.get('editPostByClientId');
                            angular.forEach(data.data, function (val) {
                                if (selectedClientId == val.id) {
                                    clientList.selectedClient = val;
                                }

                            });


                        } else {
                            clientList.selectedClient = "";
                        }

                        scope.clientListingData = clientList;


                    } else {
                        scope.clientData = null;
                    }

                }).catch(function (error) {
                });
            }

            outreachHelper.getCampaignByClient = function (scope, httpServices, localstorage) {

                var action = API_PATH + "campaign_client_" + scope.clientId;
                var params = {
                    'action': action,
                    'q': 'status:1'
                };

                var campaignList = {};
                httpServices.getRequest(API_URL, params).then(function (data) {
                    if (data.status == 200 && data.count > 0) {
                        scope.campaignData = data.data;

                        var campaignList = {};
                        campaignList.campaignData = data.data;
                        if (localstorage.get('editPostByClientId') && localstorage.get('isPostEdit') && localstorage.get("isPostEdit") == 'true') {
                            angular.forEach(data.data, function (val) {
                                if (scope.campaignId == val.id) {
                                    campaignList.selectedCampaign = val;
                                    outreachHelper.setMediaChannels(scope, campaignList.selectedCampaign);
                                }
                            });

                        } else {
                            campaignList.selectedCampaign = "";
                        }
                    } else {
                        scope.campaignData = [];
                    }
                    scope.campaignListingData = campaignList;
                }).catch(function (error) {
                    scope.errorMsgLogin = 'Server error.';
                });
            }

            outreachHelper.getHandlers = function (scope, httpServices, localstorage) {
                var handlerParams = {
                    'action': API_PATH + "social-handler_client_" + scope.clientId
                }
                scope.handlerPost = null;
                scope.selectAllHandle = false;
                httpServices.getRequest(API_URL, handlerParams).then(function (data) {
                    if (data.status == 200 && data.data && data.data.length > 0) {
                        scope.handlerPost = data.data;
                        angular.forEach(scope.handlerPost, function (handler) {
                            handler.select = false;
                        })

                        if (localstorage.get("isPostEdit") && localstorage.get("isPostEdit") == 'true') {
                            var c = 0;
                            angular.forEach(scope.handlerPost, function (handler) {
                                angular.forEach(scope.editableSocialHandlers, function (hand) {
                                    if (handler.id == hand.id) {
                                        handler.select = true;
                                        c++;
                                    }
                                })
                            })
                            if (c == scope.handlerPost.length) {
                                scope.selectAllHandle = true;
                            }
                            outreachHelper.updateDropdownHandler(scope);
                        }

                    } else {
                        scope.errorMsgLogin = '';
                    }
                }).catch(function (error) {
                    scope.errorMsgLogin = 'Server error.';
                });
            }

            outreachHelper.handleFromSocialClient = function ($scope, initHandle = false) {
                $scope.handlerPost = [];
                $scope.selectedHandle = [];
                if (!helperFactory.isEmpty($scope.selectedClientId) && !helperFactory.isEmpty($scope.selectedSocial)) {
                    var selectedPlatformLength = $scope.selectedSocial.length;
                    angular.forEach($scope.selectedSocial, function (optSelect, keyIndex) {
                        var handlerParams = {};
                        handlerParams.action = API_PATH + "social-handler_client_" + $scope.selectedClientId + '_' + optSelect.id;
                        httpServices.getRequest(API_URL, handlerParams).then(function (data) {
                            if (data.status == 200) {
                                angular.forEach(data.data, function (handlerData) {
                                    handlerData.label = handlerData.accessToken.screen_name;
                                    $scope.handlerPost.push(handlerData);
                                })
                                if (initHandle && selectedPlatformLength == keyIndex + 1) {
                                    $timeout(function initHandle() {
                                        angular.forEach($scope.campaignViewdata.handles, function (aud) {
                                            var keepGoing = true;
                                            angular.forEach($scope.handlerPost, function (audOpt) {
                                                if (keepGoing) {
                                                    if (aud.id == audOpt.id) {
                                                        keepGoing = false;
                                                        $scope.selectedHandle.push(audOpt);
                                                    }
                                                }
                                            })
                                        })
                                    }, 1000);

                                }

                            } else {
                                $scope.errorMsgLogin = '';
                            }
                        }).catch(function (error) {
                            $scope.errorMsgLogin = 'Server error.';
                        });
                    })
                }
            }


            outreachHelper.fetchClientBrands = function ($scope, clientId, initBrand = false) {
                var brandParams = {
                    'action': API_PATH + "brand_client_" + clientId,
                };
                httpServices.getRequest(API_URL, brandParams).then(function (data) {
                    if (data.status == 200 && data.data.length > 0) {
                        $scope.brandPost = data.data;
                        var brandLength = $scope.brandPost.length;
                        angular.forEach($scope.brandPost, function (brand, keyIndex) {
                            brand.label = brand.name;
                            if (brandLength == keyIndex + 1 && initBrand) {
                                angular.forEach(initBrand, function (soc, keyIndex) {
                                    var keepGoing = true;
                                    angular.forEach($scope.brandPost, function (socOpt) {
                                        if (keepGoing) {
                                            if (soc.id == socOpt.id) {
                                                keepGoing = false;
                                                $scope.selectedBrand.push(socOpt);
                                            }
                                        }
                                    })
                                })
                            }
                        })
                    } else {
                        $scope.errorMsgLogin = '';
                    }
                }).catch(function (error) {
                    $scope.errorMsgLogin = 'Server error.';
                });
            }

            outreachHelper.fetchPostMetrics = function ($scope, initMetric = false) {
                var metricParams = {
                    'action': API_PATH + "postMetrics_all"
                };
                httpServices.getRequest(API_URL, metricParams).then(function (data) {
                    if (data.status == 200 && !helperFactory.isEmpty(data.data)) {
                        $scope.postMetricsList = data.data;
                        angular.forEach($scope.postMetricsList, function (pm) {
                            pm.selected = false;
                            pm.levelSelect = pm.level[0];
                        })
                        if (initMetric) {
                            outreachHelper.initPostMetrics($scope);
                        }
                    } else {
                        $scope.errorMsgLogin = '';
                    }
                }).catch(function (error) {
                    $scope.errorMsgLogin = 'Server error.';
                });
                $scope.makePostMetricsModel = function () {
                    $scope.noteTriggerData = [];
                    angular.forEach($scope.postMetricsList, function (pm) {
                        $scope.noteTriggerData.push({
                            'clientId': $scope.selectedClientId,
                            "id": pm.id,
                            "name": pm.name,
                            "unit": pm.unit,
                            "level": [pm.levelSelect],
                            "isNotify": pm.selected,
                            "createdBy": localstorage.get('userId')
                        })
                    })
                }

            }
            outreachHelper.initPostMetrics = function ($scope) {
                angular.forEach($scope.postMetricsList, function (pmList, listIndex) {
                    angular.forEach($scope.campaignViewdata.postMetrics, function (pmCmp, cmpIndex) {
                        if (pmList.id == pmCmp.id) {
                            pmList.selected = pmCmp.isNotify;
                            pmList.levelSelect = pmCmp.level[0];
                        }
                    })
                })
            }

            outreachHelper.urlShortener = function (scope, httpServices) {

                scope.srtnBtnTxt = "Wait..";
                var shortingURL = 'https://api-ssl.bitly.com/v3/shorten?access_token=d04650aa89aa68f9ff369b3bc500a7bc597ebc88&longUrl=' + scope.shortenURL;
                var params = {};
                httpServices.getRequest(shortingURL, params).then(function (data) {
                    scope.shortenURL = data.data.url;
                    if (scope.tinymceModel != undefined) {
                        scope.tinymceModel += " " + data.data.url;
                    } else {
                        scope.tinymceModel = data.data.url;
                    }
                    scope.srtnBtnTxt = "Shorten";
                }).catch(function (error) {
                    scope.srtnBtnTxt = "Shorten";
                });

            }

            outreachHelper.getAllAudience = function (scope, httpServices) {

                var paramAud = {
                    'action': API_PATH + "audience-types_all"
                };
                httpServices.getRequest(API_URL, paramAud).then(function (data) {
                    if (data.status == 200 && data.data && data.data.length > 0) {
                        scope.allAud = data.data;
                    } else {
                        scope.errorMsgLogin = '';
                    }
                }).catch(function (error) {
                    scope.errorMsgLogin = 'Server error.';
                });

            }

            outreachHelper.isPostEdit = function () {
                if (typeof localstorage.get("isPostEdit") != 'undefined' && localstorage.get("isPostEdit") == 'true') {
                    return true;
                }
            }
            /**
            ** Get camapign by campaign Id
            */
            outreachHelper.getCampignData = function (scope, securityGroups, isViewCampaign, timeout) {
                if (scope.campaignId) {
                    var params = {
                        'action': API_PATH + "campaign_" + scope.campaignId
                    };
                    httpServices.getRequest(API_URL, params).then(function (data) {
                        if (data.status == 200 && data.data) {
                            scope.campaignViewdata = data.data;
                            scope.selectedClientId = data.data.clientId;
                            scope.campaignViewdata.startDate = helperFactory.formatUTCDate(scope.campaignViewdata.startDate, 'monthName');
                            scope.campaignViewdata.endDate = helperFactory.formatUTCDate(scope.campaignViewdata.endDate, 'monthName');
                            angular.forEach(scope.campaignViewdata.postMetrics, function (pm) {
                                pm.noOfBrands = pm.level
                            })
                            if (isViewCampaign) {
                                outreachHelper.getAllCurrency(scope, scope.campaignViewdata.budgetList);
                                scope.uniqueIcons = outreachHelper.uniqueFilter(scope.campaignViewdata.platformList, 'name');
                                selectedCity = scope.campaignViewdata.location.city;
                                outreachHelper.getTeamByClientId(scope, scope.campaignViewdata.clientId, true);
                                outreachHelper.getAllCountry(scope, scope.campaignViewdata.location);
                                securityGroups.selectAudienceAction(scope, true);
                                securityGroups.socialPlatformAction(scope, scope.campaignViewdata.platformList, outreachHelper);
                                outreachHelper.fetchClientBrands(scope, scope.selectedClientId, scope.campaignViewdata.brands);
                                outreachHelper.fetchPostMetrics(scope, true);
                                $timeout(function asynCall() {
                                    securityGroups.budgetListAction(scope, true);
                                    scope.addNewListPlatform(true);
                                }, 1000);
                            }


                        }
                    }).catch(function (error) {
                        scope.errorMsg = 'Server error.';
                    });
                }

            }

            /**Get all currency*/
            outreachHelper.getAllCurrency = function (scope, init = false) {
                var currencyParams = {
                    'action': API_PATH + "currency_all",
                    'size': 500
                };

                httpServices.getRequest(API_URL, currencyParams).then(function (data) {
                    if (data.status == 200 && data.data.length > 0) {
                        scope.currencyList = data.data;
                        angular.forEach(scope.currencyList, function (currency) {
                            currency.label = currency.name + ' (' + currency.symbol + ')';
                        });
                        if (init && init.length > 0) {
                            scope.campaignViewdata.duration = ["Weekly", "Monthly"];
                            var currSymbolAll = "";
                            var keepGoing = true;

                            angular.forEach(scope.campaignViewdata.budgetList, function (budget, keyIndex) {
                                if (keepGoing) {
                                    angular.forEach(scope.currencyList, function (currency) {
                                        if (budget.currency === currency.name) {
                                            /*scope.cm.currencymodel = currency;*/
                                            scope.selectedCurrency.push(currency);
                                            budget.symbol = currency.symbol;
                                            keepGoing = false;
                                            currSymbolAll = currency.symbol;
                                        }
                                    });
                                } else {
                                    budget.symbol = currSymbolAll;
                                }
                                budget.startDate = helperFactory.formatUTCDate(budget.startDate, 'monthName');
                                budget.endDate = helperFactory.formatUTCDate(budget.endDate, 'monthName');

                                angular.forEach(scope.campaignViewdata.platformList, function (platform) {
                                    if (platform.id == budget.platformId) {
                                        budget.platform = platform;
                                    }
                                });
                            });

                        } else {
                        }
                    }
                }).catch(function (error) {
                    scope.errorMsg = 'Server error.';
                });

            }

            outreachHelper.updateCountryAndState = function (scope) {

                scope.changeCountry = function () {
                    scope.selectedState = [];
                    scope.stateList = scope.selectedCountry[0].states;
                    helperFactory.updateByLabelList(scope.stateList, 'name');
                }
                scope.onDeselectCountry = function () {
                    scope.selectedState = [];
                }
            }
            outreachHelper.updateSocialPlatform = function (scope) {
                /*On checked client*/
                scope.changeSocial = function (data) {
                    outreachHelper.handleFromSocialClient(scope);
                    scope.updatePlatformAdd();
                    scope.mediaChannelErrorFlag = false;
                }
                /*On checked client*/
                /*On unchecked client*/
                scope.onDeselectSocial = function (data) {
                    outreachHelper.handleFromSocialClient(scope);
                    scope.updatePlatformAdd();
                }
                /*On unchecked client*/
            }
            outreachHelper.updateBrandDropdown = function (scope) {
                scope.changeBrand = function (data) {
                    scope.selectedBrandsErrorFlag = false;
                }
                scope.onDeselectBrand = function (data) {
                }
            }
            outreachHelper.updateHandleDropdown = function (scope) {
                scope.changeHandle = function (data) {
                    scope.selectedHandlersErrorFlag = false;
                }
                scope.onDeselectHandle = function (data) {
                }
            }
            outreachHelper.updateTeamDropdown = function (scope) {
                scope.changeTeam = function (data) {
                    scope.selectedTeamErrorFlag = false;
                }
                scope.onDeselectTeam = function (data) {
                }
            }

            /**Get team by client id*/
            outreachHelper.getTeamByClientId = function (scope, clientId, init = false) {
                var action = API_PATH + "team_client_" + clientId;
                var teamParams = {
                    'action': action,
                    'q': 'status:1'
                };

                httpServices.getRequest(API_URL, teamParams).then(function (data) {
                    if (data.status == 200 && data.data && data.data.length > 0) {
                        scope.allTeams = data.data;
                        var keepGoing = true;
                        angular.forEach(scope.allTeams, function (team) {
                            team.label = team.name;
                            if (init && keepGoing && team.id == scope.campaignViewdata.team.id) {
                                scope.selectedTeam.push(team);
                                keepGoing = false;
                            }
                        })
                    } else {
                        scope.errorMsg = '';
                    }
                }).catch(function (error) {
                    scope.errorMsg = 'Server error.';
                });
            }

            /****Get all country*****/
            outreachHelper.getAllCountry = function (scope, init = false) {
                var countryParams = {
                    'action': API_PATH + "country_all",
                    'size': 500
                };

                httpServices.getRequest(API_URL, countryParams).then(function (data) {
                    if (data.status == 200 && data.data.length > 0) {
                        scope.countryList = data.data;
                        var keepGoing = true;
                        angular.forEach(scope.countryList, function (cl) {
                            cl.label = cl.name;
                            if (init && keepGoing) {
                                if (cl.name === init.country) {
                                    scope.selectedCountry.push(cl);
                                    /*outreachHelper.updateStates(scope);*/
                                    scope.stateList = cl.states;
                                    angular.forEach(scope.stateList, function (state) {
                                        state.label = state.name;
                                        if (state.name === init.region) {
                                            scope.selectedState.push(state);
                                        }
                                    })
                                    keepGoing = false;
                                }
                            }
                        })
                    }
                }).catch(function (error) {
                    scope.errorMsg = 'Server error.';
                });

            }

            /****Get brands by client id*****/
            outreachHelper.getBrandByClientId = function (scope) {
                var brandParams = {
                    'action': API_PATH + "brand_client_" + scope.clientId,
                };
                httpServices.getRequest(API_URL, brandParams).then(function (data) {
                    if (data.status == 200 && !helperFactory.isEmpty(data.data)) {
                        scope.brandList = data.data;
                        if (localstorage.get('editPostByClientId') && localstorage.get('isPostEdit') && localstorage.get("isPostEdit") == 'true') {

                            angular.forEach(data.data, function (val) {
                                if (scope.brandIdEdit == val.id) {
                                    scope.selectedBrand = val;
                                }
                            });

                        }
                    } else {
                        scope.brandList = "";
                    }
                }).catch(function (error) {
                    $scope.errorMsgLogin = 'Server error.';
                });
            }


            /*outreachHelper.updateStates = function (scope) {
                for (var i = 0; i < scope.countryList.length; i++) {
                    if (scope.countryList[i].name == scope.updatedCountry.name) {
                        scope.testStates = scope.countryList[i].states;
                        break;
                    }
                }
            }*/

            /**uniqueFilter*/

            outreachHelper.uniqueFilter = function (collection, keyname) {
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

            /**get content view*/

            outreachHelper.getContentView = function ($scope) {
                /* $scope.page = page;*/
                $scope.per_page = 10;
                var action = API_PATH + "content_client_" + $scope.clientId;
                if (userHelper.isAdmin()) {
                    action = API_PATH + "content_all";
                }
                var params = {
                    'action': action,
                    'page': $scope.page,
                    'size': 10,
                    'sort': 'createdDate,desc',
                    'q': 'status:1,2'
                };

                httpServices.getRequest(API_URL, params).then(function (data) {
                    if (data.status == 200) {
                        $scope.countValue = data.count;
                        if (!helperFactory.isEmpty(data.data)) {
                            $scope.contentData = data.data;
                        } else {
                            $scope.contentDataMsg = "No content found";
                        }

                    } else {
                        $scope.contentDataMsg = "No content found";
                    }
                    $scope.totalRecords = data.count;
                    pagination.setPagination($scope);
                }).catch(function (error) {
                    $scope.errorMsgLogin = 'Server error.';
                });
            }

            /**get media view*/

            outreachHelper.getMediaView = function ($scope) {

                var actionMedia = API_PATH + "media" + "_" + $scope.clientId;
                /*if (userHelper.isAdmin()) {
                     alert($scope.clientId)
                    actionMedia = API_PATH + "media" + "_all";
                }*/
                if ($scope.mediaType.toLowerCase() == "video") {
                    var paramsMedia = {
                        'action': actionMedia,
                        'page': $scope.page,
                        'size': 10,
                        'sort': 'createdDate,desc',
                        'q': 'status:1,2;mediaType:VIDEO'
                    };
                } else {
                    var paramsMedia = {
                        'action': actionMedia,
                        'page': $scope.page,
                        'size': 10,
                        'sort': 'createdDate,desc',
                        'q': 'status:1,2;mediaType:IMAGE'
                    };
                }


                httpServices.getRequest(API_URL, paramsMedia).then(function (data) {
                    if (data.status == 200) {
                        $scope.countValue = data.count;
                        $scope.mediaData = data.data;
                        if (typeof $scope.selectedMedia != 'undefined') {
                            var temp = [];
                            angular.forEach($scope.selectedMedia, function (sel, ind) {
                                temp.push(sel.id);
                            });
                            $scope.finalMediaData = [];
                            angular.forEach($scope.mediaData, function (selm, indm) {

                                if (selm.mediaType == 'IMAGE') {
                                    helperFactory.isMediaExist(selm.url).then(function (res) {
                                        if (res) {
                                            if (temp.indexOf(selm.id) >= 0) {
                                                selm.select = true;
                                            } else {
                                                selm.select = false;
                                            }
                                            $scope.finalMediaData.push(selm);
                                        }
                                    });
                                } else {
                                    $scope.finalMediaData.push(selm);
                                }
                            });
                        }
                        $scope.totalRecords = data.count;
                        pagination.setPagination($scope);
                    } else {
                        $scope.errorMsg = '';
                    }
                }).catch(function (error) {
                    $scope.errorMsg = 'Server error.';
                });
            }

            return outreachHelper;
        }).filter('cut', function () {
            return function (value, wordwise, max, tail) {
                if (!value) return '';

                max = parseInt(max, 10);
                if (!max) return value;
                if (value.length <= max) return value;

                value = value.substr(0, max);
                if (wordwise) {
                    var lastspace = value.lastIndexOf(' ');
                    if (lastspace !== -1) {
                        if (value.charAt(lastspace - 1) === '.' || value.charAt(lastspace - 1) === ',') {
                            lastspace = lastspace - 1;
                        }
                        value = value.substr(0, lastspace);
                    }
                }

                return value + (tail || ' …');
            };
        });
});

