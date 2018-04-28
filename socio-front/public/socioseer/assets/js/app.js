/**
@Name: socioApp
@Type: Main module
@author: Gaurav Sirauthiya, Anjani Gupta, Parag Vyas
@since: 23rd-Mar-2017
@version 1.0.0
*/
'use strict';
define([
	'angular',
	'angularRoute',
	'constant',
	'helper',
	'jquery',
	'jqueryUI',
	'bootstrap',
	'pace',
	'validator',
	'modules/user/user',
	'modules/audience/audience',
	'modules/content/content',
	'modules/outreach/outreach',
	'modules/client/client',
	'modules/performance/performance',
	'modules/settings/settings',
	'modules/others/others',
	'services',
	'storage',
	'fileUpload',
	'fileUploadShim',
	'clipboard',
	'ngclipboard',
	'ngAuth',
	'ngSanitize',
	'datetimepickerTemplate',
	'datetimepicker',
	'tagInputs',
	'ngAnimateJs',
	'ngVerticalMenu',
	'ngImageGallery',
	'moment',
	'calender',
	'fullcalendar',
	'gcal',
	'loader',
	'angularBootstrapLightbox',
	'uiBootstrap',
	'ngMultiSelect',
	'angularMultiSelect',
	'userHelper',
	'rolesHelper',
	'mailhuScrollBar',
	'srcollbar'
], function (angular, angularRoute) {
	return angular.module('socioApp', [
		'ui.router',
		'720kb.datepicker',
		'socioApp.services',
		'socioApp.helperFactory',
		'socioApp.localStorageFactory',
		'socioApp.user',
		'socioApp.user.rolesHelper',
		'socioApp.audience',
		'socioApp.content',
		'socioApp.outreach',
		'socioApp.client',
		'socioApp.performance',
		'socioApp.settings',
		'socioApp.others',
		'ngFileUpload',
		'angularValidator',
		'ngSanitize',
		'ngclipboard',
		'ui.bootstrap',
		'ngTagsInput',
		'ngAnimate',
		'angularVerticalMenu',
		'thatisuday.ng-image-gallery',
		'ui.calendar',
		'angular-loading-bar',
		'bootstrapLightbox',
		'btorfs.multiselect',
		'angularjs-dropdown-multiselect',
		'ngScrollbars'

	])
		.config(['$locationProvider', '$stateProvider', '$urlRouterProvider', 'LightboxProvider', function ($locationProvider, $stateProvider, $urlRouterProvider, LightboxProvider) {
			/*set a custom template*/
			LightboxProvider.templateUrl = 'includes/lightbox.html';
			$urlRouterProvider.otherwise('/login');
			// use the HTML5 History API
			//$locationProvider.html5Mode(true);
		}])
		.controller('mainController', function ($q, $timeout, $rootScope, securityGroups, $scope, helperFactory, localstorage, $state, $window, userHelper, menuFactory, httpServices, outreachHelper, rolesHelper) {

			Object.defineProperty(console, '_commandLineAPI', {
				get: function () {
					throw 'Nooo!'
				}
			})

			$rootScope.$on('$stateChangeSuccess',
				function (event, toState, toParams, fromState, fromParams) {
					$state.current = toState;

					if ($state.current.name == 'reset-password/:token') {
						$rootScope.isFogotPwdView = true;
					} else {
						$rootScope.isFogotPwdView = false;
					}
				}
			)
			$scope.scrollConfig = BODY_SCROLL_CONFIG;
			$scope.init = function () {
				$scope.loaderArray = LOADER_ARRAY;
			}
			$scope.imageUrl = BASE_URL + 'assets/images/';
			$scope.defaultImage = $scope.imageUrl + 'dummy-logo.jpg';


			$scope.currentUserProfileImage = localstorage.get('userProfileImage');
			$scope.composePost = function () {
				localstorage.set("isPostEdit", false);
				$state.go('composePost');
			}
			/**
			 * jQuery functions
			 * @author Gaurav Sirauthiya
			 */
			jQuery(document).bind().on('click', 'body', function () {
				jQuery('#calendarDiv').removeClass('opened');
				jQuery('.dropdown-multiselect').removeClass('dropup');
				jQuery("#dateRange").hide();
			});
			jQuery(document).bind().on('click', '#calendarDiv,#dateRange', function (e) {
				e.stopPropagation();
			});
			jQuery(document).on("click", ".dropdown-toggle", function (e) {
				if (jQuery(document).find('.dropdown-multiselect').length) {
					e.stopPropagation();
					var target = jQuery(this).closest('.dropdown-multiselect')
					var $ul = target.find('.dropdown-menu');
					var $button = jQuery(this);
					var ulOffset = $ul.offset();
					if ($ul.length) {
						var spaceUp = (ulOffset.top - $button.height() - $ul.height()) - jQuery(window).scrollTop();
						var spaceDown = jQuery(window).scrollTop() + jQuery(window).height() - (ulOffset.top + $ul.height());
						if (spaceDown < 0 && (spaceUp >= 0 || spaceUp > spaceDown) && !target.hasClass('open')) {
							target.addClass("dropup");
						} else {
							target.removeClass("dropup");
						}
					}
				}
			});
			jQuery(document).on('focus', 'input[type="number"],.numberonly', function (e) {
				var myInput = e.target;
				myInput.onpaste = function (e) {
					e.preventDefault();
				}
			});
			jQuery(document).on('keypress', 'input[type="number"],.numberonly', function (evt) {
				evt = (evt) ? evt : window.event;
				var charCode = (evt.which) ? evt.which : evt.keyCode;
				if (charCode > 31 && (charCode < 48 || charCode > 57)) {
					return false;
				}
				return true;
			})
			jQuery(document).on('click', '#openCalender', function (e) {
				e.preventDefault();
				e.stopPropagation();
				jQuery('#calendarDiv').toggleClass('opened');
			});
			jQuery(document).on('click', '#campaignPreview', function (e) {
				e.stopPropagation();
			});
			jQuery(document).on('click', '#calenderIcon', function (e) {
				e.stopPropagation();
				jQuery("#dateRange").toggle();
			});

			$scope.minimizeMenu = function () {
				$("body").toggleClass("mini-navbar");
				this.SmoothlyMenu();
			}
			$scope.notificationMenu = function () {
				var params = {
					'action': API_PATH + "notification_get_user_" + localstorage.get('userId') + '_notification',
					'page': 0,
					'size': 5,
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
				var unsetParam = {
					'action': API_PATH + "notification_user_" + localstorage.get('userId')
				}
				httpServices.putRequest(API_URL + '/put', unsetParam).then(function (data) {
					if (data.status == 200 && data.data) {
						$scope.errorNotification = '';
						$scope.noteCount = 0;
					} else { }
				}).catch(function (error) { });
			}
			$scope.SmoothlyMenu = function () {
				if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
					$('#side-menu').hide();
					setTimeout(
						function () {
							$('#side-menu').fadeIn(500);
						}, 100);
				} else if ($('body').hasClass('fixed-sidebar')) {
					setTimeout(
						function () {
							$('#side-menu').fadeIn(500);
						}, 300);
				} else {
					$('#side-menu').removeAttr('style');
				}
			}

			$scope.logout = function () {
				localstorage.set('logged_in', false);
				$window.localStorage.clear();
				$state.go('login');
			}
			/* can compose post */
			$scope.canComposePost = rolesHelper.canCreate('MANAGE_POST') && rolesHelper.canView('GET_BRAND_FOR_CLIENT') && rolesHelper.canView('GET_CAMPAIGN_BY_CLIENT') && rolesHelper.canView('GET_SOCIAL_HANDLER_BY_CLIENT_PLATFORM_ID') && rolesHelper.canView('MANAGE_CAMPAIGN');

			$scope.$on('canComposePost', function (event, data) {
				$scope.canComposePost = data;
			})

			/*Set user data*/
			$scope.$on('userProfileImage', function (event, data) {
				$scope.currentUserProfileImage = data;
			});
			menuFactory.getMenuItems($scope);
			$scope.$on('menuItem', function (event, data) {
				menuFactory.getMenuItems($scope);
			});

			$scope.canShowClient = rolesHelper.canView('GET_CLIENT_BY_CLIENT_ID') && userHelper.isClientAdmin();
			if (userHelper.isAdmin()) {
				$scope.isAdministrator = true;
			}
			$scope.$on('canShowClient', function (event, data) {
				$scope.canShowClient = data;
			});
			$scope.$on('isAdministrator', function (event, data) {
				$scope.isAdministrator = data;
			});

			$scope.currentUserName = localstorage.get('currentUserName');

			$scope.$on('currentUserName', function (event, data) {
				$scope.currentUserName = data;
			});

			$scope.currentUserRole = localstorage.get('currentUserRole');

			$scope.$on('currentUserRole', function (event, data) {
				$scope.currentUserRole = data;
			});

			$scope.setClientIdFor = function () {
				sessionStorage.viewClient = localstorage.get('clientId');
			}
			$scope.mediaUrl = API_URL + '/uploads/?file=';
			$scope.header = 'includes/header.html';
			$scope.sidebar = 'includes/sidebar.html';
			$scope.footer = 'includes/footer.html';
			$scope.titlesection = 'includes/title-section.html';
			$scope.rolePermissionsView = 'includes/rolePermissions.html';
			$scope.popUpModal = 'includes/modal.html';
			$scope.title = 'SocioSeer';
			$scope.includeHeader = true;
			$scope.includeSidebar = true;
			$scope.includeFooter = true;
			$scope.$on('pageTitle', function (event, data) {
				$scope.title = data;
			});
			$scope.$on('getHeader', function (event, data) {
				$scope.includeHeader = data;
				if ($scope.includeHeader && $scope.includeHeader == true) {
					$scope.header = 'includes/header.html';
				} else {
					$scope.header = '';
				}
			});
			$scope.$on('getSidebar', function (event, data) {
				$scope.includeSidebar = data;
				if ($scope.includeSidebar && $scope.includeSidebar == true) {
					$scope.sidebar = 'includes/sidebar.html';
				} else {
					$scope.sidebar = '';
				}
			});
			$scope.$on('titleSection', function (event, data) {
				$scope.titlesection = data;
				if ($scope.titlesection && $scope.titlesection == true) {
					$scope.titlesection = 'includes/title-section.html';
				} else {
					$scope.titlesection = '';
				}
			});
			$scope.$on('getFooter', function (event, data) {
				$scope.includeFooter = data;
				if ($scope.includeFooter && $scope.includeFooter == true) {
					$scope.footer = 'includes/footer.html';
				} else {
					$scope.footer = '';
				}
			});

			var noteCountParams = {
				'action': API_PATH + "notification_count_" + localstorage.get('userId'),
			}
			if (!helperFactory.isLoggedIn()) {
				$state.go('login');
				return false;
			}
			httpServices.getRequest(API_URL, noteCountParams).then(function (data) {
				if (data.status == 200 && data.data != undefined) {
					$scope.noteCount = data.data;
				} else {
					$scope.noteCount = 0;
				}
			}).catch(function (error) {
				$scope.errorMsgNoteCount = 'Server error.';
			});

		});
});