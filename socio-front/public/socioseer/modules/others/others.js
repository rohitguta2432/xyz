'use strict';
define([
	'angular',
	'angularRoute'
], function (angular) {
	angular.module('socioApp.others', ['ui.router'])
		.config(['$stateProvider', function ($stateProvider) {
			$stateProvider.state('myProfile', {
				url: '/myProfile',
				templateUrl: 'modules/others/views/myprofile.html',
				controller: 'profileController'
			}).state('notification', {
				url: '/notification',
				templateUrl: 'modules/others/views/notification.html',
				controller: 'notificationController'
			}).state('404', {
				url: '/404',
				templateUrl: 'modules/others/views/404.html',
				controller: 'noPageFoundController'
			})
		}])
		.controller('profileController', function ($rootScope, Upload, $timeout, $scope, $location, localstorage, helperFactory, httpServices, $state, formValidator, menuFactory) {
			if (!helperFactory.isLoggedIn()) {
				$state.go('login');
				return false;
			}
			$scope.currentUserId = localstorage.get('userId');
			$scope.$emit('menuItem', menuFactory.getMenuItems($scope));
			$scope.$emit('pageTitle', "My Profile");
			var action = API_PATH + "user_manage_profile_" + $scope.currentUserId;
			var params = {
				'action': action
			};

			httpServices.getRequest(API_URL, params).then(function (data) {
				if (data.status == 200) {
					$scope.userData = data.data;
					$scope.$emit('userProfileImage', data.data.profileImageName);
					if ($scope.userData.profileImageName) {
						$scope.imageFileSrc = $scope.userData.profileImageName;
					} else {
						$scope.imageFileSrc = $scope.imageUrl + 'dummy-profile.jpg';
					}

				} else {
					$scope.errorMsgLogin = '';
					$scope.imageFileSrc = $scope.imageUrl + 'dummy-profile.jpg';
				}

			}).catch(function (error) {
				$scope.errorMsgLogin = 'Server error.';

			});
			$scope.openFileExp = function () {
				$('#profileImageId').click();
			}
			$scope.updateImage = function () {
				if (typeof $scope.profileImage != 'undefined' && $scope.profileImage != null) {
					if (helperFactory.getImageMessages($scope.profileImage)) {
						$scope.imageFileSrc = $scope.profileImage.$ngfBlobUrl;
					} else {
						$scope.profileImage = null;
					}
				}

			}

			$scope.updateUserProfile = function (myProfileForm) {

				if (myProfileForm.$valid) {

					/*remove security group**/
					$scope.userData.securityGroups = null;

					var fileName = null;
					var action = API_PATH + "user_manage_profile_" + helperFactory.getLoggedInUserId()



					if ($scope.profileImage) {
						fileName = $scope.profileImage.name;

						if ($scope.password != undefined) {
							$scope.userData.password = $scope.password;
						} else {
							$scope.userData.password = "";
						}

						if ($scope.rePassword != undefined) {
							$scope.userData.rePassword = $scope.rePassword;
						} else {
							$scope.userData.rePassword = "";
						}
						Upload.upload({
							url: API_URL + '/image',
							data: {
								file: $scope.profileImage
							}
						}).then(function (resp) {
							if (resp.data.error_code === 0) {
								var params = {
									'action': action,
									'rawBody': $scope.userData,
									'rawBodyKey': 'user',
									'fileKey': 'logo',
									"file": resp.data.upload_file_name
								};

								httpServices.postMediaRequest(API_URL + '/media/put', params).then(function (data) {
									if (data.status == 200) {

										localstorage.set('userProfileImage', data.data.profileImageName);
										$scope.$emit('userProfileImage', data.data.profileImageName);

										localstorage.set('currentUserName', data.data.firstName + " " + data.data.lastName);
										$scope.$emit('currentUserName', data.data.firstName + " " + data.data.lastName);

										localstorage.set('currentUserRole', data.data.securityGroups[0].name);
										$scope.$emit('currentUserRole', data.data.securityGroups[0].name);

										$scope.successMsg = "Profile updated successfully";
										helperFactory.successMessage($scope.successMsg);
									} else {
										$scope.errorMsg = 'Error in saving profile.';
										helperFactory.errorMessage($scope.errorMsg);
									}
									$rootScope.isLoading = false;
								}).catch(function (error) {
									$scope.errorMsg = 'Server error.';
									helperFactory.errorMessage($scope.errorMsg);

								});
							} else {

							}
						}, function (resp) {

						}, function (evt) {

						});
					} else {

						if ($scope.password != undefined) {
							$scope.userData.password = $scope.password;
						} else {
							$scope.userData.password = "";
						}

						if ($scope.rePassword != undefined) {
							$scope.userData.rePassword = $scope.rePassword;
						} else {
							$scope.userData.rePassword = "";
						}

						var params = {
							'action': action,
							'rawBody': $scope.userData,
							'rawBodyKey': 'user',
							'fileKey': 'logo',
							'file': null
						};

						httpServices.postMediaRequest(API_URL + '/media/put', params).then(function (data) {
							if (data.status == 200) {
								$scope.currentUserProfileImage = data.data.profileImageName;
								localstorage.set('userProfileImage', data.data.profileImageName);

								localstorage.set('currentUserName', data.data.firstName + " " + data.data.lastName);
								$scope.$emit('currentUserName', data.data.firstName + " " + data.data.lastName);

								localstorage.set('currentUserRole', data.data.securityGroups[0].name);
								$scope.$emit('currentUserRole', data.data.securityGroups[0].name);

								$state.go('myProfile');
								$scope.successMsg = "Profile updated successfully";
								helperFactory.successMessage($scope.successMsg);
							} else {
								$scope.errorMsg = 'Error in saving profile.';
								helperFactory.errorMessage($scope.errorMsg);
							}

						}).catch(function (error) {
							$scope.errorMsg = 'Server error.';
							helperFactory.errorMessage($scope.errorMsg);

						});
					}
				}
			}

			$scope.imgError = function (image) {

			}

			$scope.formValidator = formValidator;
		})
		.controller('notificationController', function (Upload, $timeout, $scope, $location, localstorage, helperFactory, httpServices, $state, formValidator, menuFactory) {
			if (!helperFactory.isLoggedIn()) {
				$state.go('login');
				return false;
			}
			$scope.$emit('pageTitle', "Notifications");
			$scope.$emit('menuItem', menuFactory.getMenuItems($scope));
			$scope.notificationMenu = function (page) {
				var params = {
					'action': API_PATH + "notification_get_user_" + localstorage.get('userId'),
					'page': 0,
					'size': 10,
					'sort': 'createdDate,desc',
				};
				httpServices.getRequest(API_URL, params).then(function (data) {
					if (data.status == 200 && !helperFactory.isEmpty(data.data)) {
						$scope.errorNotification = '';
						$scope.noteData = data.data;
					} else {
						$scope.errorNotification = 'No notification found';
					}
				}).catch(function (error) {
					$scope.errorNotification = 'Error while getting notifications.';
				});
			}
			$scope.notificationClickEvent = function (notification) {
				if (notification.status != 17) {
					notification.status = 17;
					var noteUpParams = {
						'action': API_PATH + "notification_" + notification.id,
						'rawBody': notification,
					};
					httpServices.putRequest(API_URL + '/put', noteUpParams).then(function (upData) {
						if (upData.status == 200 /*&& !helperFactory.isEmpty(upData.data)*/ ) {
							$state.go('tasks')
							helperFactory.successMessage(upData.message);
							$scope.success = true;
						} else {
							helperFactory.errorMessage(upData.message);
							$scope.success = false;
						}
					}).catch(function (error) {
						$scope.draftSuccessMsg = "Error in updating tsak.";
						helperFactory.errorMessage($scope.draftSuccessMsg);
						$scope.success = false;
					});
				}

				switch (notification.notificationType.toLowerCase()) {
					case 'task':
						$state.go('tasks');
						break;
					case 'schedule':
						$state.go('scheduled')
						break;
					case 'event':
						$state.go('scheduled')
						break;
					case 'due_date':
						$state.go('tasks')
						break;
					case 'matrix':
						$state.go('published')
						break;

				}
			}
			$scope.notificationMenu(0)
		}).controller('noPageFoundController', function (Upload, $timeout, $scope, $location, localstorage, helperFactory, httpServices, $state, formValidator, menuFactory) {
			if (!helperFactory.isLoggedIn()) {
				$state.go('login');
				return false;
			}
			$scope.$emit('pageTitle', "No Page Found");
			$scope.$emit('menuItem', menuFactory.getMenuItems($scope));
			
		});

});