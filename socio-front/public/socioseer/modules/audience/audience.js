'use strict';
define([
	'angular',
	'angularRoute',
	'audienceHelper'
], function (angular) {
	angular.module('socioApp.audience', ['ui.router', 'socioApp.audience.audienceHelper'])
		.config(['$stateProvider', function ($stateProvider) {
			$stateProvider.state('createAudience', {
				url: '/createAudience',
				templateUrl: 'modules/audience/views/createAudience.html',
				controller: 'audienceListController',
			}).state("viewAudience", {
				url: '/viewAudience',
				templateUrl: 'modules/audience/views/viewAudience.html',
				controller: 'viewAudienceController',
			}).state("audienceList", {
				url: '/audienceList',
				templateUrl: 'modules/audience/views/audienceList.html',
				controller: 'audienceListController',
			});
		}])
		.controller('audienceListController', function ($scope, $location, localstorage, helperFactory, $state, httpServices, Upload, formValidator, clientHelper, $timeout, audienceHelper, userHelper, menuFactory) {
			if (!helperFactory.isLoggedIn()) {
				$state.go('login');
				return false;
			}
			$scope.$emit('menuItem', menuFactory.getMenuItems($scope)); 
			$scope.$emit('pageTitle', "Audience List");
			$scope.$emit('getHeader', true);
			$scope.$emit('getFooter', true);
			/**
			 * @method Fetch Audience 
			 */
			$scope.isAdmin = false;
			if (userHelper.isAdmin()) {
				$scope.isAdmin = true;
				audienceHelper.fetchAudience($scope, 'all');
			} else {
				audienceHelper.fetchAudience($scope, 'all');
			}
			$scope.sorting = {
				attribute: 'createdDate',
				direction: 'desc'
			};
			$scope.dir = 'desc';
			$scope.audienceNameSort = {
				attribute: 'name',
				dir: 'desc'
			};
			$scope.platformSort = {
				attribute: 'platform',
				dir: 'desc'
			};
			$scope.updatedDateSort = {
				attribute: 'updatedDate',
				dir: 'desc'
			};
			$scope.typeSort = {
				attribute: 'type',
				dir: 'desc'
			};
			$scope.sortBy = function (sortingData) {
				var _dir = (sortingData.dir == 'desc') ? 'desc' : 'asc';
				$scope.sorting = {
					attribute: sortingData.attribute,
					direction: _dir
				}
				$scope.getAudienceView(0);
				sortingData.dir = (sortingData.dir == 'desc') ? 'asc' : 'desc';
			}

			$scope.getAudienceView(0);
			$scope.searchAudience = function ($event) {
				if ($event.keyCode == 13 && $scope.searchKey != null) {
					$scope.getAudienceView(0);
				}
				if ($event.keyCode == 8) {
					$scope.getAudienceView(0);
				}

			}
			$scope.getPagedData = function (page) {
				if (page < $scope.dx.length && page >= 0) {
					this.getAudienceView(page);
				}
			}

		})
		.controller('viewAudienceController', function ($scope, $location, localstorage, helperFactory, $state, menuFactory) {
			if (!helperFactory.isLoggedIn()) {
				$state.go('login');
				return false;
			}
			$scope.$emit('menuItem', menuFactory.getMenuItems($scope));
			$scope.$emit('pageTitle', "View Audience");
			$scope.$emit('getHeader', true);
			$scope.$emit('getFooter', true);
		});
});







