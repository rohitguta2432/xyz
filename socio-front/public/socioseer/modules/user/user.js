'use strict';
define([
	'angular',
	'angularRoute',
	'userHelper',
	'teamController',
	'roleController'
], function (angular) {
	angular.module('socioApp.user', ['ui.router', 'socioApp.user.userHelper', 'socioApp.user.teamController', 'socioApp.user.roleController'])
		.config(['$stateProvider', function ($stateProvider) {
			$stateProvider.state('login', {
				url: '/login',
				templateUrl: 'modules/user/views/login.html',
				controller: 'loginController'
			}).state("createRole", {
				url: '/createRole',
				templateUrl: 'modules/user/views/createRole.html',
				controller: 'createRoleController',
			}).state("editRole", {
				url: '/editRole',
				templateUrl: 'modules/user/views/editRole.html',
				controller: 'editRoleController',
			}).state("createTeam", {
				url: '/createTeam',
				templateUrl: 'modules/user/views/createTeam.html',
				controller: 'createTeamController',
			}).state("roleListing", {
				url: '/roleListing',
				templateUrl: 'modules/user/views/roleListing.html',
				controller: 'roleListingController',
			}).state("viewRoles", {
				url: '/viewRoles',
				templateUrl: 'modules/user/views/viewRoles.html',
				controller: 'viewRoleController',
			}).state("teamListing", {
				url: '/teamListing',
				templateUrl: 'modules/user/views/teamListing.html',
				controller: 'teamListingController',
			}).state("editTeam", {
				url: '/editTeam',
				templateUrl: 'modules/user/views/editTeam.html',
				controller: 'editTeamController',
			}).state("viewTeam", {
				url: '/viewTeam',
				params: {
					teamData: null
				},
				templateUrl: 'modules/user/views/viewTeam.html',
				controller: 'viewTeamController',
			}).state("userListing", {
				url: '/userListing',
				templateUrl: 'modules/user/views/userListing.html',
				controller: 'userListingController',
			}).state("addUser", {
				url: '/addUser',
				templateUrl: 'modules/user/views/addUser.html',
				controller: 'addUserController',
			}).state("editUser", {
				url: '/editUser',
				templateUrl: 'modules/user/views/userEditProfile.html',
				controller: 'editUserController',
			}).state("viewUser", {
				url: '/viewUser',
				templateUrl: 'modules/user/views/viewUser.html',
				controller: 'viewUserController',
			}).state("reset-password/:token", {
				url: '/reset-password/:token',
				templateUrl: 'modules/user/views/resetPassword.html',
				controller: 'resetPasswordController',
			})
		}])
		.controller('loginController', function ($rootScope, $scope, $location, localstorage, helperFactory, httpServices, $state, userHelper, formValidator, rolesHelper, menuFactory, $window, $timeout) {

			/*if (navigator.userAgent.toLowerCase().indexOf("android") > -1) {
				$timeout(function () {
					window.open("market://details?id=com.uk.recharge.kwikpay", "_system");
				}, 100);
			}*/

			$scope.email;
			$scope.password;
			$scope.isChecked = false;
			jQuery('body').addClass('full-width');
			var url = 'summary';
			if (helperFactory.isLoggedIn()) {
				$state.go(url);
				return false;
			}
			$scope.formValidator = formValidator;
			$scope.$emit('pageTitle', "Login");
			$scope.$emit('getHeader', false);
			$scope.$emit('getSidebar', false);
			$scope.$emit('getFooter', true);
			$scope.$emit('titleSection', false);

			$scope.rememberMe = function (isChecked) {
				$scope.isChecked = isChecked;
			}

			if (localstorage.get('rememberMe') == 'true') {
				$scope.email = localstorage.get('LoginUser');
				$scope.password = localstorage.get('password');
				$scope.isChecked = localstorage.get('rememberMe');
				$scope.remember = true;
			}

			$scope.validateUser = function (email, password) {


				$rootScope.isLoading = true;
				if (typeof email != 'undefined' && typeof password != 'undefined') {
					var formData = {
						'email': email,
						'password': password
					};
					var userData = {
						'action': 'api_auth',
						'myparam': formData
					};
					httpServices.postRequest(API_URL, userData).then(function (dataAuth) {

						if (dataAuth.status == 200) {
							$scope.errorMsgLogin = '';

							localstorage.set('LoginUser', email);
							localstorage.set('authToken', dataAuth.data.authToken);
							localstorage.set('userId', dataAuth.data.userId);
							var actionUser = API_PATH + "user_login_" + dataAuth.data.userId;
							var params = {
								'action': actionUser
							};

							httpServices.getRequest(API_URL, params).then(function (data) {
								if (data.status == 200 && !helperFactory.isEmpty(data.data)) {
									localstorage.set('userRolePermissions', JSON.stringify(data.data.securityGroups[0].roles));
									localstorage.set('rememberMe', $scope.isChecked);
									localstorage.set('logged_in', true);
									localstorage.set('clientId', data.data.clientId);
									localstorage.set('clientName', data.data.clientName);
									$scope.currentUserProfileImage = data.data.profileImageName;
									localstorage.set('userProfileImage', data.data.profileImageName);
									$scope.$emit('userProfileImage', data.data.profileImageName);
									localstorage.set('currentUserName', data.data.firstName + " " + data.data.lastName);
									$scope.$emit('currentUserName', data.data.firstName + " " + data.data.lastName);
									if (data.data.securityGroups[0].name.toLowerCase() == 'administrator') {
										localstorage.set('userAccessLevel', 'super_admin');
										$scope.isAdministrator = true;
									} else if (data.data.securityGroups[0].name.toLowerCase() == 'approver') {
										localstorage.set('userAccessLevel', 'approver');
									} else if (data.data.securityGroups[0].name.toLowerCase() == 'client_admin') {
										localstorage.set('userAccessLevel', 'client_admin');
									} else {
										localstorage.set('userAccessLevel', 'site_user');
									}
									if (rolesHelper.canCreate('MANAGE_CLIENT')) {
										$scope.$emit('isAdministrator', true);
									} else {
										$scope.$emit('isAdministrator', false);
									}
									if (rolesHelper.canView('GET_CLIENT_BY_CLIENT_ID') && data.data.securityGroups[0].name.toLowerCase() == 'client_admin') {
										$scope.$emit('canShowClient', true);
									} else {
										$scope.$emit('canShowClient', false);
									}

									var canPost = rolesHelper.canCreate('MANAGE_POST') && rolesHelper.canView('GET_BRAND_FOR_CLIENT') && rolesHelper.canView('GET_CAMPAIGN_BY_CLIENT') && rolesHelper.canView('GET_SOCIAL_HANDLER_BY_CLIENT_PLATFORM_ID') && rolesHelper.canView('MANAGE_CAMPAIGN');
									$scope.$emit('canComposePost', canPost);

									if (data.data.securityGroups[0].name.toLowerCase() != 'administrator') {
										var clientAction = API_PATH + "client_login_" + data.data.clientId + '_client';
										var params = {
											'action': clientAction
										};
										httpServices.getRequest(API_URL, params).then(function (response) {
											if (response.status == 200 && !helperFactory.isEmpty(response.data)) {
												localstorage.setObject('userClientData', response.data);
											}
										}).catch(function (error) {
										});
									}
									$scope.administrator = localstorage.get('isAdmin');
									localstorage.set('currentUserRole', data.data.securityGroups[0].name);
									$scope.$emit('currentUserRole', data.data.securityGroups[0].name);
									$scope.state = $state;
									userHelper.getAllPlatforms($scope.state);

								} else {
									$scope.errorMsgLogin = '';
								}
								$rootScope.isLoading = false;
							}).catch(function (error) {
								$scope.errorMsgLogin = 'Server error.';
								$rootScope.isLoading = false;
							});

						} else if (dataAuth.status == 401) {
							$rootScope.isLoading = false;
							$scope.errorMsgLogin = dataAuth.message;
						} else {
							$scope.errorMsgLogin = 'Invalid credentials.';
							$rootScope.isLoading = false;
						}
					}).catch(function (error) {
						$scope.errorMsgLogin = 'Server error.';
						$rootScope.isLoading = false;
					});
				} else {
					$rootScope.isLoading = false;
					$scope.errorMsgLogin = 'Invalid credentials.';
				}
			}


			/**
			 * @method Forgot Password
			 */
			$scope.forgotPassword = function (formName) {
				if (!formName.$valid) {
					return false;
				}

				var forgotAction = "api_auth_forgot_password";
				var _email = {
					'email': $scope.forgotEmail
				};
				var __params = {
					'action': forgotAction,
					'myparam': _email
				};
				httpServices.postRequestWithoutHeader(API_URL, __params).then(function (data) {
					if (data.status == 200 && !helperFactory.isEmpty(data)) {
						helperFactory.successMessage("Please check your email to reset your password.");
						jQuery('button.close').click();
					} else {
						helperFactory.errorMessage(data.message);
					}
				}).catch(function (error) {
					$scope.errMsgForgot = 'Some error occurred.';
				});
			}


			$scope.removeError = function () {
				$scope.errorMsgLogin = '';
			}

		})
		.controller('userListingController', function ($scope, $location, localstorage, helperFactory, $timeout, $state, httpServices, pagination, userHelper, outreachHelper, rolesHelper, menuFactory) {
			if (!helperFactory.isLoggedIn()) {
				$state.go('login');
				return false;
			}
			var x = rolesHelper.canView('GET_USER_BY_CLIENT');
			if (!x) {
				$state.go('summary');
			}

			$scope.currentUser = helperFactory.getLoggedInUserId();
			$scope.canCreateUser = rolesHelper.canCreate('MANAGE_USER') && rolesHelper.canView('FETCH_ALL_SECURITY_GROUP');
			$scope.canEditUser = rolesHelper.canEdit('MANAGE_USER') && rolesHelper.canView('MANAGE_USER') && rolesHelper.canView('FETCH_ALL_SECURITY_GROUP');
			$scope.canChangeStatus = rolesHelper.canEdit('UPDATE_USER_STATUS_BY_ID');
			$scope.canDeleteUser = rolesHelper.canDelete('DELETE_USER_BY_ID');
			$scope.canViewUser = rolesHelper.canView('MANAGE_USER');
			$scope.$emit('pageTitle', "Users Listing");
			$scope.$emit('menuItem', menuFactory.getMenuItems($scope));
			var userID = localstorage.get('userId');
			$scope.sorting = {
				attribute: 'createdDate',
				direction: 'desc'
			};
			$scope.dir = 'desc';
			/**
			 * @method sorting
			 */
			$scope.sortUserName = {
				attribute: 'fullName',
				dir: 'desc'
			}
			$scope.sortEmail = {
				attribute: 'email',
				dir: 'desc'
			}
			$scope.sortclientName = {
				attribute: 'clientName',
				dir: 'desc'
			}
			$scope.sortRole = {
				attribute: 'securityGroups[0].name',
				dir: 'desc'
			}
			$scope.configScroll = SCROLL_CONFIG;
			$scope.sortBy = function (sortingData) {
				var _dir = (sortingData.dir == 'desc') ? 'desc' : 'asc';
				$scope.sorting = {
					attribute: sortingData.attribute,
					direction: _dir
				}
				$scope.getUserView(0);
				sortingData.dir = (sortingData.dir == 'desc') ? 'asc' : 'desc';
			}
			$scope.actionUserData = function (selectedUserValue, action) {
				sessionStorage.currentUserValue = JSON.stringify(selectedUserValue);
			}
			$scope.deleteRecord = function (data) {
				$scope.recordData = data;
			}
			$scope.deleteActionData = function (selectedUserValue) {
				if (selectedUserValue) {
					var formData = {};
					var params = {
						'action': API_PATH + "user_delete_" + selectedUserValue.id + "_" + userID,
						'rawBody': formData,
						'rawBodyKey': ''
					};
					httpServices.deleteRequest(API_URL + '/delete', params).then(function (data) {
						if (data.status == 200) {
							helperFactory.successMessage(data.message);
							$scope.getUserView(0);
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
			$scope.enableUserData = function (selectedUserValue, setStatus) {
				var status;
				if (!setStatus) {
					status = "_2_";
				} else {
					status = "_1_";
				}
				var formData = {};
				var params = {
					'action': API_PATH + "user_status_" + selectedUserValue.id + status +
					selectedUserValue.clientId,
					'myparam': formData
				};
				httpServices.postRequest(API_URL + '/put', params).then(function (data) {
					if (data.status == 200) {
						helperFactory.successMessage(data.message);
					} else {
						helperFactory.errorMessage("Error while updating.");
					}
				}).catch(function (error) {
					$scope.errorMsgLogin = 'Server error.';
				});
			}

			$scope.dx = [];
			if (userHelper.isAdmin()) {
				userHelper.getAllUsers($scope, 'all');
				$scope.clientShow = true;
				$scope.adminClientDropdown = true;
				outreachHelper.getClient($scope, httpServices, helperFactory, localstorage);
				$scope.selectedClient = [];
				$scope.extraSettings = SINGLE_CLIENT_DROPDOWN;
			} else {
				userHelper.getAllUsers($scope);
			}
			$scope.getUserView(0);
			$scope.searchUsers = function ($event) {

				if ($event.keyCode == 13 && $scope.searchKey != null) {
					$scope.getUserView(0);
				}
				if ($event.keyCode == 8) {
					$scope.getUserView(0);
				}

			}
			$scope.getPagedData = function (page) {
				if (page < $scope.dx.length && page >= 0) {
					this.getUserView(page);
				}
			}

			$scope.selectedClientId = null;
			$scope.changeClient = function (data) {
				$scope.clientShow = false;
				userHelper.getAllUsers($scope, 'all', data.id);
				$scope.getUserView(0);
			}
			/*On unchecked client*/
			$scope.onDeselectClient = function (data) {
				$scope.clientShow = true;
				userHelper.getAllUsers($scope, 'all');
				$scope.getUserView(0);
			}
			/*On unchecked client*/

		})
		.controller('addUserController', function (Upload, $window, $scope, $http, $location, localstorage, helperFactory, $state, httpServices, $timeout, securityGroups, formValidator, userHelper, menuFactory) {
			if (!helperFactory.isLoggedIn()) {
				$state.go('login');
				return false;
			}
			$scope.files = [];
			$scope.selectedRole = [];
			$scope.$on("seletedFile", function (event, args) {
				$scope.$apply(function () {
					$scope.files.push(args.file);
				});
			});

			$scope.$emit('menuItem', menuFactory.getMenuItems($scope));
			$scope.$emit('pageTitle', "Create User");




			$scope.opeFileManager = function () {
				jQuery('#userPic').click();
			}
			$scope.imageMessage = '(image should not be greater than 1600x1200 px and max 2MB)';
			$scope.changeMySrc = function () {
				if (typeof $scope.file != 'undefined' && $scope.file != null) {
					if (helperFactory.getImageMessages($scope.file)) {
						$scope.clientImage = $scope.file.$ngfBlobUrl;
					} else {
						$scope.clientImage = null;
					}
				}
			}

			var action = API_PATH + "user";

			var _actionSecurity = API_PATH + "security-group_fetchAllActive";
			if (userHelper.isAdmin()) {
				_actionSecurity = API_PATH + "security-group_fetchAllActive";
			}

			var paramsRole = {
				'action': _actionSecurity,
				'q': 'status:1'
			};

			httpServices.getRequest(API_URL, paramsRole).then(function (data) {
				$scope.roleOpt = [];
				if (data.status == 200 && data.data && data.data.length > 0) {
					$scope.existRoles = data.data;
					angular.forEach(data.data, function (val) {
						var roleObj = {};
						roleObj.id = val.id;
						roleObj.label = val.name;
						roleObj.roles = val.roles;
						$scope.roleOpt.push(roleObj);
					});
				} else {
					$scope.errorMsgLogin = '';
				}
			}).catch(function (error) {
				$scope.errorMsgLogin = 'Server error.';
			});

			var timeOut;

			var adminAction = API_PATH + "client_all";
			var header = localstorage.get('authToken');
			var params = {
				'action': adminAction,
				'page': 0,
				'size': 100,
				'q': 'status:1'
			};
			$scope.extraSettings = SINGLE_CLIENT_DROPDOWN;
			if (userHelper.isAdmin()) {
				$scope.isAdmin = true;
				$scope.selectedClient = [];
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
			}else{
				var $clientId = helperFactory.getLoggedInUserClientId();
				getClientUsers($clientId);
			}

			$scope.clientAdmin = false;
			$scope.clientUser = {};
			$scope.obj = {};

			$scope.actionURL = API_PATH + "roles";

			$scope.updateRole = function () {
				$scope.actionURL = API_PATH + "security-group_" + $scope.selectedRole[0].id;
				$scope.assignedData = $scope.selectedRole[0].roles;
				$scope.flagInitialiseCheck = true;
				securityGroups.getAllRolesPermissions($scope);
			}
			
			$scope.clientUsersData = null;
			
			$scope.changeClientForUser = function () {
				$scope.selectedClientError = false;
				console.log($scope.selectedClient[0].id);
				/*Desc: fetch users by client to validate user add limit*/
				
				getClientUsers($scope.selectedClient[0].id);
			}

			$scope.rolesHeader = false;

			$scope.changeRoleForUser = function () {
				$scope.updateRole();
				$scope.selectedRoleError = false;
				$scope.rolesHeader = true;
			}

			$scope.deselectRoleForUser = function () {
				$scope.rolesHeader = false;
			}

			$scope.createNewUser = function (addUserForm) {
				console.log($scope.clientUsersData);
				var userLimit = localstorage.get('selectedClientUsers');
				
				if($scope.clientUsersData!=null){
					var userAdded = $scope.clientUsersData.length;
				}else{
					var userAdded = 0;
				}
				
				
				
				if(userAdded<userLimit){
					
							var $clientId = helperFactory.getLoggedInUserClientId();
							var $clientName;
							if (typeof localstorage.get('userClientData') != 'undefined') {
								$clientName = JSON.parse(localstorage.get('userClientData')).clientName;
							}
							if (userHelper.isAdmin()) {
								if ($scope.selectedClient.length > 0) {
									$clientId = $scope.selectedClient[0].id;
									$clientName = $scope.selectedClient[0].label;
									$scope.selectedClientError = false;
								} else {
									$scope.selectedClientError = true;
								}
							} else {
								$scope.selectedClientError = false;
							}
							if ($scope.selectedRole.length > 0) {
								$scope.selectedRoleError = false;
							} else {
								$scope.selectedRoleError = true;
							}

							if (addUserForm.$valid && !$scope.selectedClientError && !$scope.selectedRoleError) {


								$scope.user.status = 1;
								var modelData = $scope.user;
								var createRolePermissions = [];
								angular.forEach($scope.existRoleData, function (value) {
									var tmpRole = {};
									tmpRole.id = value.id;
									tmpRole.name = value.name;
									tmpRole.displayName = value.displayName;
									var roleArray = []
									angular.forEach(value.role_permissions, function (roleValue) {
										if (roleValue.status === 1) {
											roleArray.push(roleValue.name);
										}
									});
									if (roleArray.length > 0) {
										tmpRole.permissions = roleArray;
										createRolePermissions.push(tmpRole);
									}
								});
								modelData.createdBy = localstorage.get('userId');
								modelData.updatedBy = localstorage.get('userId');

								modelData.clientId = $clientId;
								modelData.clientName = $clientName;

								modelData.securityGroups = [{
									"id": $scope.selectedRole[0].id,
									"name": $scope.selectedRole[0].label,
									"clientId": localstorage.get('clientId'),
									"createdBy": localstorage.get('userId'),
									"roles": createRolePermissions,
									"createdDate": 2152,
									"updatedDate": 11231,
									"status": 1
								}];
								modelData.profileImageName = '';
								modelData.hashedProfileImageName = '';
								modelData.status = 1;
								var fileName = null;

								var userFinalData = [modelData];

								if ($scope.file) {
									fileName = $scope.file.name;
									Upload.upload({
										url: API_URL + '/image',
										data: {
											file: $scope.file
										}
									}).then(function (resp) {
										if (resp.data.error_code === 0) {
											var params = {
												'action': action,
												'rawBody': userFinalData,
												'rawBodyKey': 'user',
												'fileKey': 'logo',
												"file": resp.data.upload_file_name
											};
											httpServices.postMediaRequest(API_URL + '/media', params).then(function (data) {
												if (data.status == 200) {
													helperFactory.successMessage(data.message);
													$state.go('userListing');
												} else {
													helperFactory.errorMessage(data.message);
												}
											}).catch(function (error) {
												$scope.errorMsg = 'Server error.';
												helperFactory.errorMessage($scope.errorMsg);
											});
										} else { }
									}, function (resp) {

									}, function (evt) { });
								} else {
									var params = {
										'action': action,
										'rawBody': userFinalData,
										'rawBodyKey': 'user',
										'fileKey': 'logo',
										'file': null
									};

									httpServices.postMediaRequest(API_URL + '/media', params).then(function (data) {
										if (data.status == 200) {
											helperFactory.successMessage(data.message);
											$state.go('userListing');
										} else {
											helperFactory.errorMessage(data.message);
										}
									}).catch(function (error) {
										$scope.errorMsgLogin = 'Server error.';
										helperFactory.errorMessage($scope.errorMsgLogin);
									});
								}

							}
					
				}else{
					
					alert("You can not add more than "+userLimit+ " user for the selected client.");
					
				}
					
					


			}
			/**Form Validation Rules **/
			$scope.formValidator = formValidator;

			$scope.clientListValidator = function (inptVal) {
				var userArr = [];

				for (var key in $scope.clientUser) {
					userArr.push(key);
				}
				return formValidator.listValidator(userArr.length);
			}
			
			
			function getClientUsers(clientId){
				var action = API_PATH + "client_login_" + clientId + '_client';
				var header = localstorage.get('authToken');
				var params = {
					'action': action
				};
				httpServices.getRequest(API_URL, params).then(function (response) {
                    if (response.status == 200 && !helperFactory.isEmpty(response.data)) {
                        $scope.clientData = response.data;
                        localstorage.set('selectedClientUsers', $scope.clientData.noOfUsers);
						
						var action = API_PATH + 'user_client_' + clientId;
						var params = {
							'action': action,
							'q': 'status:1,2',
							'page': 0,
							'size': 9
						};

						httpServices.getRequest(API_URL, params).then(function (response) {
							if (response.status == 200) {
								$scope.clientUsersData = response.data;
							} else if (response.status == 200 && helperFactory.isEmpty($scope.clientUsersData)) {
								$scope.clientUsersData = null;
								$scope.noContent = 'No users assigned to this client';
							} else {
								$scope.errorMsgLogin = '';
							}
						}).catch(function (error) {
							$scope.errorMsgLogin = 'Server error.';
						});
					}else{
						localstorage.set('selectedClientUsers', 0);
					}
				});
			}

		})
		.controller('viewUserController', function ($scope, $http, $location, localstorage, helperFactory, $state, httpServices, $timeout, rolesHelper, menuFactory) {
			if (!helperFactory.isLoggedIn()) {
				$state.go('login');
				return false;
			}

			$scope.canEditUser = rolesHelper.canEdit('MANAGE_USER') && rolesHelper.canView('MANAGE_USER');
			if (typeof sessionStorage.currentUserValue == 'undefined') {
				$state.go('userListing');
			} else {
				var tmpUser = JSON.parse(sessionStorage.currentUserValue);
			}



			var action = API_PATH + "user_" + tmpUser.id;
			var params = {
				'action': action
			};
			$scope.$emit('menuItem', menuFactory.getMenuItems($scope));
			httpServices.getRequest(API_URL, params).then(function (response) {
				if (response.status == 200 && !helperFactory.isEmpty(response.data)) {
					$scope.currentUserValue = response.data;
					if ($scope.currentUserValue.profileImageName != undefined && $scope.currentUserValue.profileImageName != "") {
						$scope.userProfileImg = $scope.currentUserValue.profileImageName;
					} else {
						$scope.userProfileImg = $scope.imageUrl + "dummy-profile.jpg";
					}
					$scope.updateImage = function () {
						if ($scope.userProfileFile) {
							var reader = new FileReader();
							reader.onload = function (e) {
								$scope.$apply(function () {
									$scope.userProfileImg = reader.result;
								});
							}
							reader.readAsDataURL($scope.userProfileFile);
						}
					}
					$scope.$emit('pageTitle', "View User");
					if ($scope.currentUserValue.securityGroups[0] != null) {
						for (var i = 0; i < $scope.currentUserValue.securityGroups[0].roles.length; i++) {
							$scope.rolePermissions = [{
								name: "POST"
							}, {
								name: "GET"
							}, {
								name: "PUT"
							}, {
								name: "DELETE"
							}];
							var c = 0;
							for (var j = 0; j < $scope.rolePermissions.length; j++) {
								var permsn = $scope.currentUserValue.securityGroups[0].roles[i].permissions;
								if (permsn.indexOf($scope.rolePermissions[j].name) != -1) {
									$scope.rolePermissions[j].status = 1;
									c++;
								} else {
									$scope.rolePermissions[j].status = 0;
								}
							}
							if (c == $scope.rolePermissions.length) {
								$scope.currentUserValue.securityGroups[0].roles[i].checkAll = 1;
							} else {
								$scope.currentUserValue.securityGroups[0].roles[i].checkAll = 0;
							}

							$scope.currentUserValue.securityGroups[0].roles[i].role_permissions = $scope.rolePermissions;
						}
					}
					var action = API_PATH + "roles";
					var header = localstorage.get('authToken');
					var params = {
						'action': action,
						'pageNo': 0,
						'pageSize': 10,
						'sortingOrder': 'DESC',
						'fieldName': 'bajaj'
					};
					$scope.editRoleView = function () {
						$state.go('editRole');
					}
					$scope.configScroll = SCROLL_CONFIG;
				}
			});

		})
		.controller('editUserController', function (Upload, $scope, $http, $location, localstorage, helperFactory, $state, httpServices, $timeout, formValidator, securityGroups, userHelper, rolesHelper, menuFactory) {
			if (!helperFactory.isLoggedIn()) {
				$state.go('login');
				return false;
			}
			$scope.canEditUser = rolesHelper.canEdit('MANAGE_USER') && rolesHelper.canView('MANAGE_USER');
			if (!$scope.canEditUser) {
				$state.go('summary');
			}
			if (typeof sessionStorage.currentUserValue == 'undefined') {
				$state.go('userListing');
			} else {
				var tmpUser = JSON.parse(sessionStorage.currentUserValue);
			}
			$scope.currentUserValue = null;
			$scope.selectedClient = [];
			$scope.selectedRole = [];
			$scope.extraSettings = SINGLE_CLIENT_DROPDOWN;
			$scope.rolesHeader = true;

			$scope.configScroll = SCROLL_CONFIG;
			$scope.roleSelected = {};

			var action = API_PATH + "user_" + tmpUser.id;
			var params = {
				'action': action
			};
			$scope.$emit('menuItem', menuFactory.getMenuItems($scope));
			$scope.$emit('pageTitle', "User Edit Profile");
			httpServices.getRequest(API_URL, params).then(function (response) {
				if (response.status == 200 && !helperFactory.isEmpty(response.data)) {
					$scope.currentUserValue = response.data;
					$scope.currentUserValue.rePassword = $scope.currentUserValue.password;
					var paramsRole = {
						'action': API_PATH + "security-group_fetchAllActive",
						'q': 'status:1'
					};

					var adminAction = API_PATH + "client_all";
					var params = {
						'action': adminAction,
						'page': 0,
						'size': 100,
						'q': 'status:1'
					};

					//**fetch all client if admin */
					if (userHelper.isAdmin()) {
						$scope.obj = {};
						$scope.isAdmin = true;
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

									if (val.id == $scope.currentUserValue.clientId) {
										$scope.selectedClient.push(clientObj);
									}


								});
							} else {
								$scope.errorMsgLogin = '';
							}
						}).catch(function (error) {
							$scope.errorMsgLogin = 'Server error.';
						});

						$scope.obj.newUserClientName = {
							'id': $scope.currentUserValue.clientId
						};
					}

					//**fetch security group all */
					httpServices.getRequest(API_URL, paramsRole).then(function (data) {
						$scope.roleOpt = [];
						if (data.status == 200 && data.data && data.data.length > 0) {
							$scope.existRoles = data.data;
							var keepGoing = true;
							angular.forEach($scope.existRoles, function (val) {
								val.label = val.name;
								if (keepGoing) {
									if ($scope.currentUserValue.securityGroups != null && $scope.currentUserValue.securityGroups[0] != null) {
										if (val.id == $scope.currentUserValue.securityGroups[0].id) {
											$scope.selectedRole.push(val);
											$scope.actionURL = API_PATH + "security-group_" + $scope.currentUserValue.securityGroups[0].id;
											$scope.assignedData = $scope.currentUserValue.securityGroups[0].roles;
											$scope.isEditInit = "true";
											/*$scope.roleSelected.name = $scope.currentUserValue.securityGroups[0].name;*/
											securityGroups.getAllRolesPermissions($scope);
											keepGoing = false;
										}
									} else {
										$scope.assignedData = null;
									}
								}

							});
						} else {
							$scope.errorMsgLogin = '';
						}
					}).catch(function (error) {
						$scope.errorMsgLogin = 'Server error.';
					});

					$scope.openImageBrowse = function () {
						jQuery('#profile-img').click();
					}



					if ($scope.currentUserValue.profileImageName != undefined && $scope.currentUserValue.profileImageName != "") {
						$scope.userProfileImg = $scope.currentUserValue.profileImageName;
					} else {
						$scope.userProfileImg = $scope.imageUrl + "dummy-profile.jpg";
					}

					$scope.flagInitialiseCheck = true;

					$scope.updateImage = function () {
						if ($scope.userProfileFile) {
							var reader = new FileReader();
							reader.onload = function (e) {
								$scope.$apply(function () {
									$scope.userProfileImg = reader.result;
								});
							}
							reader.readAsDataURL($scope.userProfileFile);
						}
					}

					$scope.updateUserProfile = function (editUserForm) {
						$scope.currentUserValue.status = 1;
						if ($scope.password != undefined) {
							$scope.currentUserValue.password = $scope.password;
						} else {
							$scope.currentUserValue.password = "";
						}
						if ($scope.rePassword != undefined) {
							$scope.currentUserValue.rePassword = $scope.rePassword;
						} else {
							$scope.currentUserValue.rePassword = "";
						}
						if (userHelper.isAdmin()) {
							if ($scope.selectedClient.length > 0) {
								$scope.selectedClientError = false;
							} else {
								$scope.selectedClientError = true;
							}
						} else {
							$scope.selectedClientError = false;
						}

						if ($scope.selectedRole.length > 0) {
							$scope.selectedRoleError = false;
						} else {
							$scope.selectedRoleError = true;
						}

						if (editUserForm.$valid && !$scope.selectedClientError && !$scope.selectedRoleError) {
							var fileName = null;
							var action = API_PATH + "user_" + $scope.currentUserValue.id;

							var createRolePermissions = [];
							angular.forEach($scope.existRoleData, function (value) {
								var tmpRole = {};
								tmpRole.id = value.id;
								tmpRole.name = value.name;
								tmpRole.displayName = value.displayName;
								var roleArray = []
								angular.forEach(value.role_permissions, function (roleValue) {
									if (roleValue.status === 1) {
										roleArray.push(roleValue.name);
									}
								});
								if (roleArray.length > 0) {
									tmpRole.permissions = roleArray;
									createRolePermissions.push(tmpRole);
								}
							});
							$timeout(function userUpdate() {
								delete $scope.selectedRole[0].label;
								$scope.currentUserValue.securityGroups = [$scope.selectedRole[0]];
								$scope.currentUserValue.securityGroups[0].roles = createRolePermissions;
								$scope.currentUserValue.updatedBy = localstorage.get('userId');
								if (userHelper.isAdmin()) {
									$scope.currentUserValue.clientId = $scope.currentUserValue.clientId;
									$scope.currentUserValue.clientName = $scope.currentUserValue.clientName;
								} else {
									$scope.currentUserValue.clientId = localstorage.get('clientId');
									$scope.currentUserValue.clientName = localstorage.get('clientName');
								}



								if (typeof $scope.userProfileFile != 'undefined' && $scope.userProfileFile != null) {
									fileName = $scope.userProfileFile.name;

									Upload.upload({
										url: API_URL + '/image',
										data: {
											file: $scope.userProfileFile
										}
									}).then(function (resp) {
										if (resp.data.error_code === 0) {
											var params = {
												'action': action,
												'rawBody': $scope.currentUserValue,
												'rawBodyKey': 'user',
												'fileKey': 'logo',
												"file": resp.data.upload_file_name
											};
											httpServices.postMediaRequest(API_URL + '/media/put', params).then(function (data) {
												if (data.status == 200) {
													helperFactory.successMessage(data.message);
													$state.go('viewUser');
												} else {
													helperFactory.errorMessage(data.message);
												}
											}).catch(function (error) {
												$scope.errorMsgLogin = 'Server error.';
												helperFactory.errorMessage($scope.errorMsgLogin);
											});
										} else { }
									}, function (resp) { }, function (evt) { });
								} else {
									var params = {
										'action': action,
										'rawBody': $scope.currentUserValue,
										'rawBodyKey': 'user',
										'fileKey': 'logo',
										'file': null
									};
									/**
									 * @method update user data
									 */
									httpServices.postMediaRequest(API_URL + '/media/put', params).then(function (data) {
										if (data.status == 200) {
											sessionStorage.currentUserValue = JSON.stringify(data.data);
											helperFactory.successMessage(data.message);
											$state.go('viewUser');
										} else {
											helperFactory.errorMessage(data.message);
										}
									}).catch(function (error) {
										$scope.errorMsg = 'Server error.';
										helperFactory.errorMessage($scope.errorMsg);
									});
								}
							}, 500);
						}
					}

					$scope.formValidator = formValidator;
				}
			});

			$scope.changeRoleForUser = function () {
				$scope.selectedRoleError = false;
				$scope.existRoleData = [];
				$scope.isEditInit = null;
				$scope.actionURL = API_PATH + "security-group_" + $scope.selectedRole[0].id;
				$scope.assignedData = $scope.selectedRole[0].roles;
				securityGroups.getAllRolesPermissions($scope);
			}

			$scope.deselectRoleForUser = function () {
				$scope.existRoleData = [];
			}

			$scope.changeClientForUser = function () {

				$scope.selectedClientError = false;
				$scope.currentUserValue.clientId = $scope.selectedClient[0].id;
				$scope.currentUserValue.clientName = $scope.selectedClient[0].label;
			}

		})
		.controller('resetPasswordController', function ($rootScope, $scope, $location, localstorage, helperFactory, httpServices, $state, userHelper, menuFactory, formValidator) {
			$scope.$emit('menuItem', menuFactory.getMenuItems($scope));
			var url = window.location.href;
			var token = url.split("/").pop();
			$scope.expiredLinkMsgStatus = false;


			$scope.isValidLink = function () {
				var resetAction = "api_auth_validatetoken_" + token;
				var formData = {};

				var __params = {
					'action': resetAction,
					'myparam': formData
				};
				httpServices.postRequestWithoutHeader(API_URL, __params).then(function (data) {
					if (data.status == 200 && !helperFactory.isEmpty(data)) {
						if (!data.data) {
							$scope.expiredLinkMsgStatus = true;
							$scope.expiredLinkMsg = "Password reset link has been expired.";
						} else {
							$scope.pwdReset = true;
						}
					} else {
						helperFactory.errorMessage(data.message);
					}
				}).catch(function (error) {
					$scope.errMsgForgot = 'Some error occurred.';
				});
			}
			$scope.isValidLink();


			/**
			 * @method Reset Password
			 */
			$scope.formValidator = formValidator;
			$scope.resetPassword = function (formName, password, rpassword) {
				if (formName.$valid) {
					var resetAction = "api_auth_reset_password";
					var formData = {
						'password': password,
						'confirmPassword': rpassword,
						'token': token
					};

					var __params = {
						'action': resetAction,
						'myparam': formData
					};
					httpServices.postRequestWithoutHeader(API_URL, __params).then(function (data) {
						if (data.status == 200 && !helperFactory.isEmpty(data)) {
							helperFactory.successMessage(data.message);
							jQuery('button.close').click();
							$scope.successMsg = data.message;
							$scope.pwdReset = false;
						} else {
							helperFactory.errorMessage(data.message);
						}
					}).catch(function (error) {
						$scope.errMsgForgot = 'Some error occurred.';
					});
				}
			}
		});

});