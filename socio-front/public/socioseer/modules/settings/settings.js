'use strict';
define([
	'angular',
	'angularRoute',
	'settingsHelper'
], function (angular) {
	angular.module('socioApp.settings', ['ui.router', 'socioApp.audience.settingsHelper'])
		.config(['$stateProvider', function ($stateProvider) {
			$stateProvider.state('setupMetrics', {
				url: '/setupMetrics',
				templateUrl: 'modules/settings/views/setupMetrics.html',
				controller: 'setupMetricsListController',
			}).state('setupReminders', {
				url: '/setupReminders',
				templateUrl: 'modules/settings/views/setupReminders.html',
				controller: 'settingsController',
			});
		}])
		.controller('setupMetricsListController', function ($scope, $location, localstorage, helperFactory, $state, httpServices, Upload, formValidator, clientHelper, $timeout, settingsHelper, userHelper, menuFactory) {
			if (!helperFactory.isLoggedIn()) {
				$state.go('login');
				return false;
			}
			$scope.$emit('menuItem', menuFactory.getMenuItems($scope));
			$scope.$emit('pageTitle', "Settings");
			$scope.$emit('getHeader', true);
			$scope.$emit('getFooter', true);
			/**
			 * @method Fetch Post Matrix
			 */
			$scope.isAdmin = false;
			if (userHelper.isAdmin()) {
				$scope.isAdmin = true;
				settingsHelper.fetchPostMatrix($scope, 'all');
			} else {
				settingsHelper.fetchPostMatrix($scope);
			}
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
				$scope.getPostMatrixView(0);
				$scope.dir = (dir == 'desc') ? 'asc' : 'desc';
			}

			$scope.getPostMatrixView(0);
		});
});