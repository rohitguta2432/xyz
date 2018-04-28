define([
    'angular',
    'angularRoute',
    'rolesHelper'
], function (angular, angularRoute) {
    angular.module('socioApp.user.userHelper', [])
        .factory('userHelper', function (localstorage, httpServices, helperFactory, pagination, rolesHelper) {
            var userHelper = {};
            /**
             * @method check user is administrator
             */
            userHelper.isAdmin = function () {
                if (typeof localstorage.get('userAccessLevel') != 'undefined' && localstorage.get('userAccessLevel') == 'super_admin') {
                    return true;
                } else {
                    return false;
                }
            }
            /**
             * @method check user is client admin
             */
            userHelper.isClientAdmin = function () {
                if (typeof localstorage.get('userAccessLevel') != 'undefined' && localstorage.get('userAccessLevel').toLowerCase() === 'client_admin') {
                    return true;
                } else {
                    return false;
                }
            }

            userHelper.isContentAppover = function () {
                if (rolesHelper.canEdit('CONTENT_APPROVER') && !userHelper.isAdmin()) {
                    return true;
                } else {
                    return false;
                }
            }

            /**
            * @method Fetch user listing based on role
            */
            userHelper.getAllUsers = function (scope, all = false, clientId = false) {
                scope.getUserView = function (page) {
                    scope.page = page;
                    var action;
                    if (all) {
                        if (clientId) {
                            action = API_PATH + "user_client_" + clientId;
                        } else {
                            action = API_PATH + "user_all";
                        }
                    } else {
                        action = API_PATH + 'user_client_' + helperFactory.getLoggedInUserClientId();
                    }
                    var params = {
                        'action': action,
                        'q': 'status:1,2',
                        'page': page,
                        'size': 10,
                        'sort': scope.sorting.attribute + ',' + scope.sorting.direction,
                    };

                    if (scope.searchKey != undefined && scope.searchKey != null) {
                        params.q += ';fullName:' + scope.searchKey + '~true';
                    } else {
                        scope.searchKey = null;
                    }

                    httpServices.getRequest(API_URL, params).then(function (data) {
                        if (data.status == 200 && data.data && data.data.length > 0) {
                            scope.userData = data.data;
                        } else {
                            scope.userData = null;
                        }
                        scope.totalRecords = data.count;
                        pagination.setPagination(scope);
                    }).catch(function (error) {
                        scope.errorMsgLogin = 'Server error.';
                    });
                }
            }
            userHelper.getUserRole = function () {
                var $role = ['administrator', 'client_admin', 'user'];
            }
            /**
             * @method fetch all clients
             */
            userHelper.fetchClientForTeam = function ($scope) {
                var adminAction = API_PATH + "client_all";
                $scope.indexer = eval($scope.page * $scope.per_page);
                var header = localstorage.get('authToken');
                var params = {
                    'action': adminAction,
                    'page': 0,
                    'size': 2000,
                    'q': 'status:1'
                };

                httpServices.getRequest(API_URL, params).then(function (data) {
                    $scope.clientOpt = [];
                    if (data.status == 200 && !helperFactory.isEmpty(data)) {
                        $scope.clientData = data.data;
                        angular.forEach(data.data, function (val) {
                            var clientObj = {};
                            clientObj.id = val.id;
                            clientObj.label = val.clientName;
                            clientObj.competitiorsDefinitions = val.competitiorsDefinitions;
                            $scope.clientOpt.push(clientObj);
                        });
                    } else {
                        $scope.errorMsgLogin = '';
                    }
                }).catch(function (error) {
                    $scope.errorMsgLogin = 'Server error.';
                });
            }
            /**
            * @method Fetch team listing
            */
            userHelper.getAllTeams = function (scope, all = false, clientId = false, performanceTeamClient = false) {
                scope.getTeamView = function (page) {
                    var action;
                    if (all) {
                        if (clientId) {
                            action = API_PATH + "team_client_" + clientId;
                        } else {
                            action = API_PATH + "team_all";
                        }
                    } else {
                        action = API_PATH + "team_client_" + localstorage.get('clientId')
                    }
                    if (performanceTeamClient) {
                        action = API_PATH + "team_client_" + performanceTeamClient
                    }
                    scope.page = page;
                    scope.per_page = 10;
                    var params = {
                        'action': action,
                        'page': page,
                        'size': scope.per_page,
                        'q': 'status:1,2',
                        'sort': scope.sorting.attribute + ',' + scope.sorting.direction
                    };

                    if (scope.searchKey != undefined && scope.searchKey != null) {
                        params.q += ';name:' + scope.searchKey + '~true'
                    } else {
                        scope.searchKey = null;
                    }

                    httpServices.getRequest(API_URL, params).then(function (data) {
                        if (data.status == 200 && !helperFactory.isEmpty(data)) {
                            scope.teamListData = data.data;
                            if (performanceTeamClient) {
                                scope.showPerformance();
                            }
                        } else {
                            scope.teamListData = null;
                        }
                        scope.totalRecords = data.count;
                        pagination.setPagination(scope);
                    }).catch(function (error) {
                        scope.errorMsgLogin = 'Server error.';
                    });

                }
            }


            userHelper.getAllPlatforms = function ($state) {
                var _params = {
                    'action': API_PATH + "social-platforms_all"
                }
                httpServices.getRequest(API_URL, _params).then(function (data) {
                    if (data.status == 200 && !helperFactory.isEmpty(data.data)) {
                        localstorage.setObject('platformObj', data.data);
                        $state.go('summary');
                    }
                });
            }

            userHelper.checkTokenValidity = function ($scope) {
               
               
                var _params = {
                    'action': API_PATH + "notification_fb_token_expiration_" + localstorage.get('userId')
                }
                httpServices.getRequest(API_URL, _params).then(function (data) {
                    
                    if (data.status == 200 && !helperFactory.isEmpty(data.data)) {
                        $scope.validityData = data.data;
                        //load modal
                        jQuery('#validityModal').modal();
                    }
                });
            }

            return userHelper;
        });
});