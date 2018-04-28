/**
 * @author Gaurav Sirauthiya
 */
define([
    'angular',
    'jquery',
    'angularRoute'
], function (angular, angularRoute) {
    angular.module('socioApp.outreach.eventController', []).controller('eventController', function ($scope, $location, localstorage, helperFactory, $state, httpServices, pagination, userHelper, $timeout, socialHelper, clientHelper, $stateParams, menuFactory, outreachHelper, securityGroups) {
        if (!helperFactory.isLoggedIn()) {
            $state.go('login');
            return false;
        }
        $scope.addLocalTimeStamp = -((new Date()).getTimezoneOffset() * 60 * 1000);
        
        $scope.hf = helperFactory;
        $scope.$emit('pageTitle', "Events");
        $scope.$emit('menuItem', menuFactory.getMenuItems($scope));
        jQuery('body').removeClass('full-width');
        $scope.$emit('getHeader', true);
        $scope.$emit('getSidebar', true);
        $scope.$emit('getFooter', true);
        $scope.$emit('titleSection', true);
        $scope.selectedClientFilter = [];
        $scope.dx = [];
        $scope.page = 0;

        $scope.getPagedData = function (page) {
            if (page < $scope.dx.length && page >= 0) {
                $scope.page = page; 'edit event data is clientInd: ',
                    $scope.getEventList(page);
            }
        }

        $scope.getEventList = function (page) {
            $scope.page = page;
            $scope.per_page = 10;
            $scope.indexer = eval($scope.page * $scope.per_page);
            $scope.paginationData = {};
            var eParam = {
                'action': API_PATH + "event_all",
                'page': page,
                'q': 'status:1',
                'size': 10
            }
            /** check for state param filter */
            if ($stateParams.startDate != null && $stateParams.endDate != null) {
                eParam.q = 'status:1;startDate:' + $stateParams.startDate + ',gte,' + $stateParams.endDate + ',lte!true';
            }
            if (!userHelper.isAdmin()) {
                eParam.q += ';clientId:' + $scope.selectedClientId;
            } else {
                if ($scope.selectedClientFilter.length > 0) {
                    eParam.q += ';clientId:' + $scope.selectedClientFilter[0].id;
                }
            }
            /** check for search filter */
            if ($scope.searchKey != undefined && $scope.searchKey != null) {
                eParam.q += ';eventName:' + $scope.searchKey + '~true';
            } else {
                $scope.searchKey = null;
            }
            httpServices.getRequest(API_URL, eParam).then(function (data) {
                $scope.eventData = [];
                if (data.status == 200 && !helperFactory.isEmpty(data.data)) {
                    $scope.eventData = data.data;
                    angular.forEach($scope.eventData, function(eve){
                        eve.startDate += addLocalTimeStamp;
                    })
                    $scope.totalRecords = data.count;
                    pagination.setPagination($scope);
                } else { }

            }).catch(function (error) {
                $scope.errorMsgLogin = 'Server error.';
            });
        }

        if (userHelper.isAdmin()) {
            outreachHelper.getClient($scope, httpServices, helperFactory, localstorage);
            $scope.selectedClient = [];
            $scope.extraSettings = SINGLE_CLIENT_DROPDOWN;
            $scope.adminClientDropdown = true;
        } else {
            $scope.selectedClientId = localstorage.get('clientId');
            $scope.adminClientDropdown = false;
            $scope.selectedClientErrorFlag = false;
        }
        $scope.getEventList(0);
        $scope.searchEvents = function ($event) {

            if ($event.keyCode == 13 && $scope.searchKey != null) {
                $scope.getEventList(0);
            }
            if ($event.keyCode == 8) {
                $scope.getEventList(0);
            }
        }
        /**
         * edit/update event
         */
        $scope.editEvent = function (event) {
            if (userHelper.isAdmin()) {
                $scope.selectedClient = [];
                $scope.selectedClientErrorFlag = false;
                var clientId = -1;
                var arrLen = $scope.clientOpt.length;
                angular.forEach($scope.clientOpt, function (jsonObj, keyObj) {
                    if (jsonObj.id === event.clientId) {
                        clientInd = keyObj;
                    }
                    if (arrLen === keyObj + 1) {
                        if (clientInd > -1) {
                            $scope.selectedClientId = $scope.clientOpt[clientInd].id;
                            $scope.selectedClient.push($scope.clientOpt[clientInd]);
                        }
                    }
                })

            }
            $scope.editEventData = event;
            var date = new Date(event.startDate);
            $scope.editEventData.startDate = date.getDate() + " " + helperFactory.getMonthName(date.getMonth(), true) + "," + date.getFullYear();
        }

        $scope.updateEvent = function (formName) {
            if (helperFactory.isEmpty($scope.selectedClientId)) {
                $scope.selectedClientErrorFlag = true;
                return false;
            }

            var content = document.getElementById('editEveDesc').value;
            /* if (helperFactory.isEmpty($scope.editEventData.startDate) || helperFactory.isEmpty($scope.editEventData.eventName) || content.length < 1) {
                return false;
            } */

            if (formName.$valid && !$scope.selectedClientErrorFlag) {
                $scope.editEventData.startDate = helperFactory.getUTCTimeStamp($scope.editEventData.startDate);
                $scope.editEventData.clientId = $scope.selectedClientId;
                var params = {
                    'action': API_PATH + "event_" + $scope.editEventData.id,
                    'rawBody': $scope.editEventData
                };
                httpServices.putRequest(API_URL + '/put', params).then(function (data) {
                    if (data.status == 200) {
                        $scope.eventSuccessMsg = "Event updated successfully.";
                        helperFactory.successMessage($scope.eventSuccessMsg);
                        $scope.success = true;
                        $('#editEvent').modal('hide');
                        $scope.getEventList(0);
                    } else {
                        helperFactory.errorMessage(data.message);
                        $scope.success = false;
                    }
                }).catch(function (error) {
                    $scope.errorMsgLogin = 'Server error.';
                    helperFactory.errorMessage($scope.errorMsgLogin);
                    $scope.success = false;
                });
            }

        }
        /**
         * delete event
         */
        $scope.deleteRecord = function (event) {
            $scope.recordData = event;
        }
        $scope.deleteActionData = function (selectedEventValue) {
            if (selectedEventValue) {
                var params = {
                    'action': API_PATH + "event_delete_" + selectedEventValue.id + "_" + localstorage.get('userId'),
                    'rawBody': {},
                    'rawBodyKey': ''
                };
                httpServices.deleteRequest(API_URL + '/delete', params).then(function (data) {
                    if (data.status == 200) {
                        helperFactory.successMessage(data.message);
                        $scope.getEventList(0);
                        jQuery('.btn-cancel').click();
                    } else {
                        helperFactory.errorMessage(data.message);
                    }
                }).catch(function (error) {
                    $scope.errorMsg = 'Server error.';
                    helperFactory.errorMessage($scope.errorMsg);
                });

            }


        }

        /**
         *  function for change client
         */
        $scope.changeClient = function (data) {
            $scope.selectedClientId = data.id;
            $scope.selectedClientErrorFlag = false;
        }
        /*On unchecked client*/
        $scope.onDeselectClient = function (data) {
            $scope.selectedClientId = null;
            $scope.selectedClientErrorFlag = true;
        }
        /*On unchecked client*/
        /**
         *  function for change client
         */
        $scope.changeEvent = function (data) {
            $scope.getEventList(0);
        }
        /*On unchecked client*/
        $scope.onDeselectEvent = function (data) {
            $scope.getEventList(0);
        }
        /**
         *  function for create an event
         */
        $scope.createEvent = function (eventForm) {
            console.log(eventForm.$valid);

            var content = document.getElementById('eveDesc').value;
            if (helperFactory.isEmpty($scope.selectedClientId)) {
                $scope.selectedClientErrorFlag = true;
                return false;
            }
            /* if (helperFactory.isEmpty($scope.eventDate)) {
                $scope.dateError = true;
                return false;
            } else if (helperFactory.isEmpty($scope.eventName)) {
                $scope.eventNameError = true;
                return false;
            } */
            var eventParams = {
                'action': API_PATH + "event",
                'myparam': {
                    'eventName': $scope.eventName,
                    'description': $scope.eventDesc,
                    'status': 1,
                    'startDate': helperFactory.getUTCTimeStamp($scope.eventDate),
                    'endDate': helperFactory.getUTCTimeStamp($scope.eventDate),
                    'createdBy': localstorage.get('userId'),
                    'createdDate': helperFactory.getUTCTimeStamp(new Date()),
                    'clientId': $scope.selectedClientId
                },

            };
            if (eventForm.$valid && !$scope.selectedClientErrorFlag) {
                httpServices.postRequest(API_URL, eventParams).then(function (data) {
                    if (data.status == 200) {
                        $scope.eventSuccessMsg = "Event: " + data.data.eventName + " created successfully.";
                        helperFactory.successMessage($scope.eventSuccessMsg);
                        $scope.success = true;
                        $('#add').modal('hide');
                        $scope.getEventList(0);
                        $scope.eventName = null;
                        $scope.eventDesc = null;
                        $scope.eventDate = null;
                    } else {
                        $scope.eventErrorMsg = "Error in composing post.";
                        helperFactory.errorMessage($scope.eventErrorMsg);
                        $scope.success = false;
                    }
                    eventForm.reset();
                }).catch(function (error) {
                    $scope.errorMsgLogin = 'Server error.';
                    helperFactory.errorMessage($scope.errorMsgLogin);
                    $scope.success = false;
                });
            }


        }
    });
});