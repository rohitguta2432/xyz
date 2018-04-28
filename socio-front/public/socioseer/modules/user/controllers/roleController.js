/**
 * @author Gaurav Sirauthiya
 */
define([
	'angular',
	'angularRoute'
], function (angular, angularRoute) {
	angular.module('socioApp.user.roleController', []).controller('roleListingController', function ($scope, $location, localstorage, helperFactory, $state, httpServices, pagination, $timeout, rolesHelper, menuFactory) {
		if (!helperFactory.isLoggedIn()) {
			$state.go('login');
			return false;
		}
		if (!rolesHelper.canView('MANAGE_ROLE')) {
			$state.go('summary');
		}
		$scope.$emit('menuItem', menuFactory.getMenuItems($scope));
		$scope.$emit('pageTitle', "Roles Listing");
		var userID = localstorage.get('userId');
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
			$scope.getRoleView(0);
			$scope.dir = (dir == 'desc') ? 'asc' : 'desc';
		}

		$scope.actionRoleData = function (selectedRoleValue, action) {
			sessionStorage.currentRoleValue = JSON.stringify(selectedRoleValue);
		}

		$scope.deleteRecord = function (data) {
			$scope.recordData = data;

		}
		$scope.deleteActionData = function (selectedRoleValue) {
			if (selectedRoleValue) {
				var formData = {};
				var params = {
					'action': API_PATH + "security-group_status_" + selectedRoleValue.id + "_3_" + userID,
					'rawBody': formData
				};

				httpServices.putRequest(API_URL + '/put', params).then(function (data) {
					if (data.status == 200) {
						helperFactory.successMessage(data.message);
						$scope.getRoleView(0);
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

		$scope.enableRoleData = function (selectedRoleValue, setStatus) {

			var status;
			if (!setStatus) {
				status = "_2_";
			} else {
				status = "_1_";
			}

			var formData = {};
			var params = {
				'action': API_PATH + "security-group_status_" + selectedRoleValue.id + status + userID,
				'rawBody': formData
			};

			httpServices.putRequest(API_URL + '/put', params).then(function (data) {
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

		var action = API_PATH + "security-group_fetchAllActive";

		$scope.dx = [];

		$scope.getRoleView = function (page) {
			$scope.page = page;
			var params = {
				'action': action,
				'page': page,
				'size': 10,
				'q': 'status:1,2',
				'sort': $scope.sorting.attribute + ',' + $scope.sorting.direction,
			};
			if ($scope.searchKey != undefined && $scope.searchKey != null) {
				params.q += ';name:' + $scope.searchKey + '~true'
			} else {
				$scope.searchKey = null;
			}
			httpServices.getRequest(API_URL, params).then(function (data) {
				if (data.status == 200 && data.data && data.data.length > 0) {
					$scope.viewRoleData = data.data;
				} else {
					$scope.viewRoleData = null;
				}
				$scope.totalRecords = data.count;
				pagination.setPagination($scope);
			}).catch(function (error) {
				$scope.errorMsgLogin = 'Server error.';
			});
		}

		$scope.getRoleView(0);

		$scope.getPagedData = function (page) {
			if (page < $scope.dx.length && page >= 0) {
				this.getRoleView(page);
			}
		}


	})
		.controller('createRoleController', function ($scope, $location, localstorage, helperFactory, $state, httpServices, securityGroups, formValidator, menuFactory) {
			if (!helperFactory.isLoggedIn()) {
				$state.go('login');
				return false;
			}
			$scope.$emit('menuItem', menuFactory.getMenuItems($scope));
			$scope.$emit('pageTitle', "Create Role");
			$scope.actionURL = API_PATH + "roles_all";
			$scope.existRoleData = null;
			$scope.flagInitialiseCheck = false;
			securityGroups.getAllRolesPermissions($scope, true, true);
			$scope.createNewRole = function (createRoleForm) {
				if (createRoleForm.$valid) {
					var createRolePermissions = [];
					angular.forEach($scope.existRoleData, function (value) {
						var tmpRole = {};
						tmpRole._id = value.id;
						tmpRole.name = value.name;
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
					var secAction = API_PATH + "security-group_";
					var formData = {
						'name': $scope.createRoleName,
						'clientId': localstorage.get('clientId'),
						'roles': createRolePermissions,
						"createdBy": localstorage.get('userId'),
						'status': 1
					};
					var params = {
						'action': secAction,
						'myparam': formData
					};
					httpServices.postRequest(API_URL, params).then(function (data) {
						if (data.status == 200 && data.data && data.data != null) {
							helperFactory.successMessage(data.message);
							$state.go('roleListing');
						} else {
							helperFactory.errorMessage(data.message);
						}
					}).catch(function (error) {
						$scope.errorMsg = 'Server error.';
						helperFactory.errorMessage($scope.errorMsg);
					});
				} else {
				}
			}

			/**Form Validation Rules **/
			$scope.formValidator = formValidator;

		})
		.controller('editRoleController', function ($scope, $location, localstorage, helperFactory, $state, httpServices, securityGroups, formValidator, menuFactory) {
			$scope.editRolesFlag = true;
			if (!helperFactory.isLoggedIn()) {
				$state.go('login');
				return false;
			}

			var tmpRole = JSON.parse(sessionStorage.currentRoleValue);
			if (typeof tmpRole.id == 'undefined' && tmpRole.id == '') {
				$state.go('roleListing');
				return false;
			}

			$scope.roleApproverView = tmpRole;
			$scope.$emit('menuItem', menuFactory.getMenuItems($scope));
			$scope.$emit('pageTitle', "Edit Role");
			var header = localstorage.get('authToken');

			$scope.actionURL = API_PATH + "security-group_" + $scope.roleApproverView.id;

			$scope.existRoleData = null;
			$scope.flagInitialiseCheck = true;
			securityGroups.getAllRolesPermissions($scope);

			$scope.updateExistRole = function (editRoleForm) {
				if (editRoleForm.$valid) {
					var createRolePermissions = [];
					angular.forEach($scope.existRoleData, function (value) {
						var tmpRole = {};
						tmpRole._id = value.id;
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
					var secAction = API_PATH + "security-group_" + $scope.roleApproverView.id;
					var formData = {
						'name': $scope.roleApproverView.name,
						'clientId': localstorage.get('clientId'),
						'roles': createRolePermissions,
						"createdBy": localstorage.get('userId'),
						'status': 1
					};

					var params = {
						'action': secAction,
						'rawBody': formData
					};
					httpServices.putRequest(API_URL + "/put", params).then(function (data) {
						if (data.status == 200 && data.data && data.data != null) {
							helperFactory.successMessage(data.message);
							sessionStorage.currentRoleValue = JSON.stringify(data.data);
							$state.go('viewRoles');
						} else {
							helperFactory.errorMessage(data.message);
						}
					}).catch(function (error) {
						$scope.errorMsg = 'Server error.';
						helperFactory.errorMessage($scope.errorMsg);
					});
				} else {

				}
			}

			/**Form Validation Rules **/
			$scope.formValidator = formValidator;

		})
		.controller('viewRoleController', function ($scope, $location, localstorage, helperFactory, $state, httpServices, securityGroups, menuFactory) {
			if (!helperFactory.isLoggedIn()) {
				$state.go('login');
				return false;
			}
			var tmpRole = JSON.parse(sessionStorage.currentRoleValue);
			if (typeof tmpRole.id == 'undefined' && tmpRole.id == '') {
				$state.go('roleListing');
				return false;
			}
			$scope.roleApproverView = tmpRole;
			$scope.$emit('menuItem', menuFactory.getMenuItems($scope));
			$scope.$emit('pageTitle', "View Role");

			var action = API_PATH + "roles";
			var header = localstorage.get('authToken');
			var params = {
				'action': action,
				'pageNo': 0,
				'pageSize': 10,
				'sortingOrder': 'DESC',
			};
			$scope.viewMode = "true"
			$scope.actionURL = API_PATH + "security-group_" + $scope.roleApproverView.id;
			$scope.existRoleData = null;
			$scope.flagInitialiseCheck = true;
			securityGroups.getAllRolesPermissions($scope, true);
			$scope.editRoleView = function () {
				$state.go('editRole');
			}
		});


});