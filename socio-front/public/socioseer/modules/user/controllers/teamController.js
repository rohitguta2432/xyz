/**
 * @author Gaurav Sirauthiya
 */
define([
	'angular',
	'angularRoute'
], function (angular, angularRoute) {
	angular.module('socioApp.user.teamController', [])
		.controller('teamListingController', function ($rootScope, $scope, $location, localstorage, helperFactory, $state, httpServices, pagination, userHelper, $timeout, outreachHelper, rolesHelper, menuFactory) {
			if (!helperFactory.isLoggedIn()) {
				$state.go('login');
				return false;
			}
			var x = (rolesHelper.canView('FETCH_TEAMS_BY_CLIENT') || rolesHelper.canView('FETCH_ALL_TEAM')) && rolesHelper.canEdit('MANAGE_TEAM');
			if (!x) {
				$state.go('summary');
			}
			$scope.canCreateTeam = rolesHelper.canCreate('MANAGE_TEAM') && rolesHelper.canView('FETCH_ALL_APPROVERS_BY_CLIENT') && rolesHelper.canView('GET_USER_BY_CLIENT');
			$scope.canEditTeam = rolesHelper.canEdit('MANAGE_TEAM') && rolesHelper.canView('FETCH_ALL_APPROVERS_BY_CLIENT') && rolesHelper.canView('GET_USER_BY_CLIENT') && rolesHelper.canView('MANAGE_TEAM');
			$scope.canDeleteTeam = rolesHelper.canDelete('DELETE_TEAM_BY_ID');
			$scope.canChangeTeamStatus = rolesHelper.canEdit('UPDATE_TEAM_STATUS_BY_ID');
			$scope.canViewTeam = rolesHelper.canView('MANAGE_TEAM');
			$scope.$emit('menuItem', menuFactory.getMenuItems($scope));
			$scope.$emit('pageTitle', "Teams Listing");
			$scope.send = function (newValue) {
				sessionStorage.currentTeamID = newValue;
			}

			$scope.sorting = {
				attribute: 'createdDate',
				direction: 'desc'
			};

			$scope.dir = 'desc';
			$scope.teamName = {
				attribute: 'name',
				dir: 'desc'
			}
			$scope.sortBy = function (sortingData) {
				var _dir = (sortingData.dir == 'desc') ? 'desc' : 'asc';
				$scope.sorting = {
					attribute: sortingData.attribute,
					direction: _dir
				}
				$scope.getTeamView(0);
				sortingData.dir = (sortingData.dir == 'desc') ? 'asc' : 'desc';
			}

			$scope.deleteRecord = function (data) {
				$scope.recordData = data;
			}

			$scope.deleteActionData = function (selectedTeamValue) {
				if (selectedTeamValue) {

					var formData = {};
					var params = {
						'action': API_PATH + "team_delete_" + selectedTeamValue.id + "_" + helperFactory.getLoggedInUserId(),
						'myparam': formData
					};
					httpServices.deleteRequest(API_URL + '/delete', params).then(function (data) {
						if (data.status == 200) {
							helperFactory.successMessage(data.message);
							$scope.getTeamView(0);
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

			$scope.enableTeamData = function (selectedTeamValue, setStatus) {
				var status;
				if (!setStatus) {
					status = "_2_";
				} else {
					status = "_1_";
				}
				var formData = {};
				var params = {
					'action': API_PATH + "team_status_" + selectedTeamValue.id + status +
						selectedTeamValue.clientId,
					'myparam': formData
				};
				httpServices.postRequest(API_URL + '/put', params).then(function (data) {
					if (data.status == 200) {
						helperFactory.successMessage(data.message);
					} else {
						helperFactory.errorMessage(data.message);
					}
				}).catch(function (error) {
					$scope.errorMsg = 'Server error.';
					helperFactory.errorMessage($scope.errorMsg);
				});
			}

			$scope.dx = [];
			if (userHelper.isAdmin()) {
				userHelper.getAllTeams($scope, 'all');
				$scope.clientShow = true;
				$scope.adminClientDropdown = true;
				outreachHelper.getClient($scope, httpServices, helperFactory, localstorage);
				$scope.selectedClient = [];
				$scope.extraSettings = SINGLE_CLIENT_DROPDOWN;
			} else {
				userHelper.getAllTeams($scope);
			}
			$scope.getTeamView(0);
			$scope.searchTeam = function ($event) {
				if ($event.keyCode == 13 && $scope.searchKey != null) {
					$scope.getTeamView(0);
				}
				if ($event.keyCode == 8) {
					$scope.getTeamView(0);
				}

			}
			$scope.getPagedData = function (page) {
				if (page < $scope.dx.length && page >= 0) {
					this.getTeamView(page);
				}
			}

			$scope.selectedClientId = null;
			$scope.changeClient = function (data) {
				$scope.clientShow = false;
				userHelper.getAllTeams($scope, 'all', data.id);
				$scope.getTeamView(0);
			}
			/*On unchecked client*/
			$scope.onDeselectClient = function (data) {
				$scope.clientShow = true;
				userHelper.getAllTeams($scope, 'all');
				$scope.getTeamView(0);
			}
			/*On unchecked client*/


		}).controller('createTeamController', function ($scope, $location, localstorage, helperFactory, $state, httpServices, $timeout, formValidator, securityGroups, userHelper, menuFactory) {
			if (!helperFactory.isLoggedIn()) {
				$state.go('login');
				return false;
			}
			$scope.selectedUsers = [];
			$scope.selectedApprover = [];
			$scope.extraSettings = SINGLE_CLIENT_DROPDOWN;
			$scope.extraMultiSettings = MULTIPLE_DROPDOWN_SETTING;
			$scope.isUserDisabled = true;
			$scope.isApproverDisabled = true;

			$scope.obj = {};
			$scope.$emit('menuItem', menuFactory.getMenuItems($scope));
			$scope.$emit('pageTitle', "Create Team");
			var action = API_PATH + "team";
			/*$scope.isAdmin = false; */
			if (userHelper.isAdmin()) {
				$scope.isAdmin = 1;
				$scope.selectedClient = [];
				/*$scope.check = function () {
					if ($scope.obj.teamClient && !helperFactory.isEmpty($scope.selectedUsers)) {
						$scope.selectedUsers = [];
						$scope.teamCreatedBy = null;
					}
				}*/

				var adminAction = API_PATH + "client_all";
				$scope.page = 0;
				$scope.per_page = 100;
				$scope.indexer = eval($scope.page * $scope.per_page);
				var header = localstorage.get('authToken');
				var params = {
					'action': adminAction,
					'page': $scope.page,
					'size': $scope.per_page,
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
							clientObj.industry = val.industry;
							clientObj.segment = val.segment;
							$scope.clientOpt.push(clientObj);
						});
					} else {
						$scope.errorMsgLogin = '';
					}
				}).catch(function (error) {
					$scope.errorMsgLogin = 'Server error.';
				});
			} else {
				$scope.clientId = localstorage.get('clientId');
				$scope.clientName = localstorage.get('clientName');
				loadUser();
			}

			function loadUser() {
				
				var actionClientUser = API_PATH + "user_client_" + $scope.clientId;
				var params = {
					'action': actionClientUser,
					'q': 'status:1'
				};

				httpServices.getRequest(API_URL, params).then(function (data) {
					$scope.userOpt = [];
					if (data.status == 200 && !helperFactory.isEmpty(data.data)) {
						console.log(data.data)
						loadApprover();
						angular.forEach(data.data, function (val) {
							var userObj = {};
							userObj.id = val.id;
							var xxx = val.fullName + ' ('+val.email+') ';
							userObj.label = xxx ;
							$scope.userOpt.push(userObj);
						});
					}
				});

			}

			function loadApprover() {
				var approverUrl = API_PATH + "user_approver_" + $scope.clientId;
				var params = {
					'action': approverUrl,
					'q': 'status:1'
				};

				httpServices.getRequest(API_URL, params).then(function (data) {
					$scope.appOpt = [];
					if (data.status == 200 && !helperFactory.isEmpty(data.data)) {
						angular.forEach(data.data, function (val) {
							var appObj = {};
							appObj.id = val.id;
							appObj.label = val.fullName + ' ('+val.email+') ';
							$scope.appOpt.push(appObj);
						});
						$scope.isUserDisabled = false;
						$scope.isApproverDisabled = false;
					}
				});
			}

			$scope.changeClient = function () {
				$scope.clientId = $scope.selectedClient[0].id;
				$scope.clientName = $scope.selectedClient[0].label;
				$scope.selectedClientError = false;
				loadUser();
			}
			$scope.deselectClient = function () {
				$scope.selectedClientError = false;
				$scope.selectedUsers = [];
				$scope.selectedApprover = [];
				$scope.isUserDisabled = true;
				$scope.isApproverDisabled = true;
			}
			$scope.changeUser = function () {
				$scope.selectedUserError = false;
			}
			$scope.changeApprover = function () {
				$scope.selectedAppError = false;
			}

			$scope.createNewTeam = function (createTeamForm) {
				if (createTeamForm.$valid && validateTeamForm()) {

					var userArr = [];
					angular.forEach($scope.selectedUsers, function (user) {
						userArr.push(user.id);
					})
					var formData = {
						'name': $scope.teamName,
						'clientId': $scope.clientId,
						'clientName': $scope.clientName,
						'usersList': userArr,
						'createdBy': localstorage.get('userId'),
						'contentApproversList': [$scope.selectedApprover[0].id],
						'status': 1

					};
					var params = {
						'action': action,
						'myparam': formData
					};
					httpServices.postRequest(API_URL, params).then(function (data) {
						if (data.status == 200) {
							helperFactory.successMessage(data.message);
							$state.go('teamListing');
						} else {
							helperFactory.errorMessage(data.message);
						}
					}).catch(function (error) {
						$scope.errorMsg = 'Server error.';
						helperFactory.errorMessage($scope.errorMsg);
					});
				}

			}

			function validateTeamForm() {

				if (userHelper.isAdmin()) {
					if ($scope.selectedClient.length > 0) {
						$scope.selectedClientError = false;
					} else {
						$scope.selectedClientError = true;
					}
				} else {
					$scope.selectedClientError = false;
				}

				if ($scope.selectedUsers.length > 0) {
					$scope.selectedUserError = false;
				} else {
					$scope.selectedUserError = true;
				}

				if ($scope.selectedApprover.length > 0) {
					$scope.selectedAppError = false;
				} else {
					$scope.selectedAppError = true;
				}

				if (!$scope.selectedClientError && !$scope.selectedUserError && !$scope.selectedAppError) {
					return true;
				} else {
					return false;
				}

			}

			$scope.formValidator = formValidator;


		})
		.controller('editTeamController', function ($scope, $location, localstorage, helperFactory, $state, httpServices, $stateParams, $timeout, formValidator, securityGroups, userHelper, rolesHelper, menuFactory) {
			if (!helperFactory.isLoggedIn()) {
				$state.go('login');
				return false;
			}
			if (typeof sessionStorage.currentTeamID == 'undefined' || sessionStorage.currentTeamID == '' || sessionStorage.currentTeamID == 'undefined') {
				$state.go('teamListing');
				return false;
			}
			$scope.$emit('menuItem', menuFactory.getMenuItems($scope));
			$scope.$emit('pageTitle', "Edit Team");

			$scope.selectedApprover = [];
			$scope.selectedUsers = [];
			$scope.extraMultiSettings = MULTIPLE_DROPDOWN_SETTING;
			$scope.extraSettings = SINGLE_CLIENT_DROPDOWN;
			$scope.isUserDisabled = false;
			$scope.isApproverDisabled = false;
			$scope.canEditTeam = rolesHelper.canEdit('MANAGE_TEAM') && rolesHelper.canView('FETCH_ALL_APPROVERS_BY_CLIENT') && rolesHelper.canView('GET_USER_BY_CLIENT') && rolesHelper.canView('MANAGE_TEAM');
			if (!$scope.canEditTeam) {
				$state.go('summary');
			}
			var header = localstorage.get('authToken');
			$scope.obj = {};

			var action = API_PATH + "team";

			/**
			 * fetch team data
			 */
			function getTeamData() {
				var action = API_PATH + "team_" + sessionStorage.currentTeamID;
				var params = {
					'action': action,
				};
				httpServices.getRequest(API_URL, params).then(function (data) {
					if (data.status == 200 && !helperFactory.isEmpty(data.data)) {
						$scope.teamData = data.data;
						$scope.teamName = $scope.teamData.name;
						$scope.clientId = $scope.teamData.clientId;
						if (userHelper.isAdmin()) {
							getClientData($scope.teamData);
						}

						loadUser($scope.teamData);

					} else {
						$scope.errorMsgLogin = '';
					}
				}).catch(function (error) {
					$scope.errorMsgLogin = 'Server error.';
				});
			}

			/**
			 * fetch client data
			 */
			function getClientData(teamData) {
				var adminAction = API_PATH + "client_all";
				$scope.page = 0;
				$scope.per_page = 100;
				$scope.indexer = eval($scope.page * $scope.per_page);
				var header = localstorage.get('authToken');
				var params = {
					'action': adminAction,
					'page': $scope.page,
					'size': $scope.per_page,
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
							clientObj.industry = val.industry;
							clientObj.segment = val.segment;
							$scope.clientOpt.push(clientObj);
						});
						angular.forEach($scope.clientOpt, function (client, index) {
							if (client.id == teamData.clientId) {
								$scope.selectedClient.push($scope.clientOpt[index]);
							}
						});
					} else {
						$scope.errorMsgLogin = '';
					}
				}).catch(function (error) {
					$scope.errorMsgLogin = 'Server error.';
				});
			}

			/**
			 * fetch user data by client
			 */
			function loadUser(teamData) {
				var actionClientUser = API_PATH + "user_client_" + teamData.clientId;
				var params = {
					'action': actionClientUser,
					'q': 'status:1'
				};

				httpServices.getRequest(API_URL, params).then(function (data) {
					$scope.userOpt = [];
					if (data.status == 200 && !helperFactory.isEmpty(data.data)) {

						angular.forEach(data.data, function (val) {
							val.label = val.fullName + ' ('+val.email+') ';
							$scope.userOpt.push(val);
							angular.forEach(teamData.users, function (user, index) {
								if (user.id == val.id) {
									$scope.selectedUsers.push(val);
								}
							});
						});

						loadApprover(teamData);
					} else {
						$scope.isUserDisabled = true;
					}
				});

			}

			/**
			 * fetch approver data by client
			 */
			function loadApprover(teamData) {
				var approverUrl = API_PATH + "user_approver_" + teamData.clientId;
				var params = {
					'action': approverUrl,
					'q': 'status:1'
				};

				httpServices.getRequest(API_URL, params).then(function (data) {
					$scope.appOpt = [];
					if (data.status == 200 && !helperFactory.isEmpty(data.data)) {
						angular.forEach(data.data, function (val) {
							var appObj = {};
							appObj.id = val.id;
							appObj.label = val.fullName + ' ('+val.email+') ';
							$scope.appOpt.push(appObj);
						});

						angular.forEach($scope.appOpt, function (user, index) {
							angular.forEach(teamData.contentApprovers, function (app, ind) {
								if (user.id == app.id) {
									$scope.selectedApprover.push($scope.appOpt[index]);
								}
							});
						});
					} else {
						$scope.isApproverDisabled = true;
					}
				});
			}

			getTeamData();

			if (userHelper.isAdmin()) {
				$scope.isAdmin = 1;
				$scope.selectedClient = [];
			} else {
				$scope.clientId = helperFactory.getLoggedInUserClientId();
				if (typeof $scope.teamData != 'undefined') {
					loadUser($scope.teamData);
				}
			}

			$scope.updateTeam = function (editTeamForm) {
				if (editTeamForm.$valid && validateTeamForm()) {
					var userArr = [];
					var approverArr = [];
					angular.forEach($scope.selectedUsers, function (user) {
						userArr.push(user.id);
					})
					angular.forEach($scope.selectedApprover, function (_approver) {
						approverArr.push(_approver.id);
					})

					var formData = {
						'name': $scope.teamData.name,
						'clientId': $scope.clientId,
						'usersList': userArr,
						'createdBy': localstorage.get('userId'),
						'contentApproversList': approverArr,
						'status': 1

					};

					var params = {
						'action': API_PATH + "team_" + sessionStorage.currentTeamID,
						'rawBody': formData
					};

					httpServices.postRequest(API_URL + '/put', params).then(function (data) {
						if (data.status == 200) {
							helperFactory.successMessage(data.message);
							$state.go('viewTeam');
						} else {
							helperFactory.errorMessage(data.message);
						}
					}).catch(function (error) {
						$scope.errorMsg = 'Server error.';
						helperFactory.errorMessage($scope.errorMsg);
					});


				} else {
					$scope.formError = "Your form is not valid";
				}
			}

			function validateTeamForm() {

				if (userHelper.isAdmin()) {
					if ($scope.selectedClient.length > 0) {
						$scope.selectedClientError = false;
					} else {
						$scope.selectedClientError = true;
					}
				} else {
					$scope.selectedClientError = false;
				}

				if ($scope.selectedUsers.length > 0) {
					$scope.selectedUserError = false;
				} else {
					$scope.selectedUserError = true;
				}

				if ($scope.selectedApprover.length > 0) {
					$scope.selectedAppError = false;
				} else {
					$scope.selectedAppError = true;
				}

				if (!$scope.selectedClientError && !$scope.selectedUserError && !$scope.selectedAppError) {
					return true;
				} else {
					return false;
				}

			}

			$scope.changeClient = function () {
				$scope.teamData.clientId = $scope.selectedClient[0].id;
				$scope.teamData.clientName = $scope.selectedClient[0].label;
				$scope.selectedClientError = false;
				$scope.selectedUsers = [];
				$scope.selectedApprover = [];
				$scope.teamData.users = [];
				$scope.teamData.contentApprovers = [];
				loadUser($scope.teamData);
			}
			$scope.deselectClient = function () {
				$scope.selectedClientError = false;
				$scope.selectedUsers = [];
				$scope.selectedApprover = [];
				$scope.isUserDisabled = true;
				$scope.isApproverDisabled = true;
			}
			$scope.changeUser = function () {
				$scope.selectedUserError = false;
			}
			$scope.changeApprover = function () {
				$scope.selectedAppError = false;
			}

			$scope.formValidator = formValidator;

		})
		.controller('viewTeamController', function ($scope, $location, localstorage, helperFactory, $state, httpServices, $stateParams, $rootScope, userHelper, rolesHelper, menuFactory) {
			if (!helperFactory.isLoggedIn()) {
				$state.go('login');
				return false;
			}


			if (typeof sessionStorage.currentTeamID == 'undefined' || sessionStorage.currentTeamID == '' || sessionStorage.currentTeamID == 'undefined') {
				$state.go('teamListing');
				return false;
			}

			$scope.canViewTeam = rolesHelper.canView('MANAGE_TEAM');
			$scope.canEditTeam = rolesHelper.canEdit('MANAGE_TEAM') && rolesHelper.canView('FETCH_ALL_APPROVERS_BY_CLIENT') && rolesHelper.canView('GET_USER_BY_CLIENT');
			if (!$scope.canViewTeam) {
				$state.go('summary');
			}

			$scope.obj = {};
			if (userHelper.isAdmin()) {
				$scope.isAdmin = true;
				var adminAction = API_PATH + "client_all";
				$scope.page = 0;
				$scope.per_page = 100;
				$scope.indexer = eval($scope.page * $scope.per_page);
				var header = localstorage.get('authToken');
				var params = {
					'action': adminAction,
					'page': $scope.page,
					'size': $scope.per_page,
					'q': 'status:1'
				};

				httpServices.getRequest(API_URL, params).then(function (data) {
					if (data.status == 200 && !helperFactory.isEmpty(data)) {
						$scope.clientData = data.data;

					} else {
						$scope.errorMsgLogin = '';
					}
				}).catch(function (error) {
					$scope.errorMsgLogin = 'Server error.';
				});
			}
			if (typeof sessionStorage.currentTeamID == 'undefined' && sessionStorage.currentTeamID == '') {
				$state.go('teamListing');
				return false;
			}
			$scope.$emit('menuItem', menuFactory.getMenuItems($scope));
			$scope.$emit('pageTitle', "View Team");
			var action = API_PATH + "team_" + sessionStorage.currentTeamID;
			var header = localstorage.get('authToken');
			var params = {
				'action': action
			};
			$scope.selectedUserIDs = {};
			httpServices.getRequest(API_URL, params).then(function (data) {

				if (data.status == 200 && !helperFactory.isEmpty(data.data)) {
					$scope.teamData = data.data;
					$scope.teamName = $scope.teamData.name;
					$scope.obj.teamClient = {
						'id': $scope.teamData.clientId
					};
					$scope.selectedUsers = $scope.teamData.users;
					$scope.contentApproversList = $scope.teamData.contentApprovers;

					for (var key in $scope.teamData.users) {
						$scope.selectedUserIDs[key] = $scope.teamData.users[key];
					}
					for (var firstKey in $scope.teamData.contentApprovers) break;
					$scope.teamCreatedBy = {
						'id': firstKey,
						'fullName': $scope.teamData.contentApprovers[firstKey]
					};
				} else {
					$scope.errorMsgLogin = '';
				}
			}).catch(function (error) {
				$scope.errorMsgLogin = 'Server error.';
			});

		});
})