/**
	@Name: httpServices
	@Type: Services
	@Author: Anjani Kr Gupta
	@Date: 23rd-Mar-2017
*/

'use strict';
define([
	'angular',
	'angularRoute'
], function (angular, angularRoute) {


	angular.module('socioApp.services', [])
		.service('httpServices', function ($http, $q, localstorage, $rootScope) {
			var httpService = {};

			httpService.postRequest = function (_url, _data) {
				$rootScope.isLoading = true;
				var deferred = $q.defer();
				$http({
					method: 'POST',
					url: _url,
					data: _data,
					headers: getHeaders(_data),
					cache: false,
				}).then(function (data, status, headers, config) {
					deferred.resolve(data.data);
					$rootScope.isLoading = false;
				},
					function myError(data, status, headers, config) {
						deferred.reject(data.data);
						$rootScope.isLoading = false;
					});
				return deferred.promise;
			}
			httpService.postRequestWithoutHeader = function (_url, _data = false) {
				$rootScope.isLoading = true;
				var deferred = $q.defer();
				$http({
					method: 'POST',
					url: _url,
					data: _data,
					cache: false,
				}).then(function (data, status, headers, config) {
					deferred.resolve(data.data);
					$rootScope.isLoading = false;
				},
					function myError(data, status, headers, config) {
						deferred.reject(data.data);
						$rootScope.isLoading = false;
					});
				return deferred.promise;
			}

			httpService.postMediaRequest = function (_url, _data) {
				var deferred = $q.defer();
				$rootScope.isLoading = true;
				$http({
					method: 'POST',
					url: _url,
					data: _data,
					headers: getHeaders(_data),
					cache: false,
				}).then(function (data, status, headers, config) {
					deferred.resolve(data.data);
					$rootScope.isLoading = false;
				}, function myError(data, status, headers, config) {
					deferred.reject(data.data);
					$rootScope.isLoading = false;
				});
				return deferred.promise;
			}

			/**
			 * @method twitter post
			 */

			httpService.twitterPostRequest = function (_url, _data = false) {

				var deferred = $q.defer();
				$rootScope.isLoading = true;
				$http({
					method: 'POST',
					url: _url,
					data: _data,
					cache: false,
				}).then(function (data, status, headers, config) {
					deferred.resolve(data.data);
					$rootScope.isLoading = false;
				}, function myError(data, status, headers, config) {
					deferred.reject(data.data);
					$rootScope.isLoading = false;
				});
				return deferred.promise;
			}


			httpService.twitterAccessPostRequest = function (_url, _data) {
				var deferred = $q.defer();
				$rootScope.isLoading = true;
				$http({
					method: 'POST',
					url: _url,
					data: { 'data': _data.data },
					cache: false,
				}).then(function (data, status, headers, config) {
					deferred.resolve(data.data);
					$rootScope.isLoading = false;
				}, function myError(data, status, headers, config) {
					deferred.reject(data.data);
					$rootScope.isLoading = false;
				});
				return deferred.promise;
			}
			/**
			 * @method gettwitterGetTrends
			 */
			httpService.twitterGetTrends = function (_url, params = false) {
				var deferred = $q.defer();
				$rootScope.isLoading = true;
				$http({
					method: 'GET',
					url: _url,
					params: params,
					cache: false,
				}).then(function (data, status, headers, config) {
					deferred.resolve(data.data);
					$rootScope.isLoading = false;
				}, function myError(data, status, headers, config) {
					deferred.reject(data.data);
					$rootScope.isLoading = false;
				});
				return deferred.promise;
			}

			httpService.getRequest = function (_url, params = false) {
				var deferred = $q.defer();
				$rootScope.isLoading = true;
				$http({
					method: 'GET',
					url: _url,
					params: params,
					headers: getHeaders(params),
					cache: false,

				}).then(function (data, status, headers, config) {
					deferred.resolve(data.data);
					$rootScope.isLoading = false;
				}, function myError(data, status, headers, config) {
					deferred.reject(data.data);
					$rootScope.isLoading = false;
				});
				return deferred.promise;
			}
			httpService.getRequestWithoutHeader = function (_url, params = false) {
				var deferred = $q.defer();
				$rootScope.isLoading = true;
				$http({
					method: 'GET',
					url: _url,
					params: params,
					cache: false,

				}).then(function (data, status, headers, config) {
					deferred.resolve(data.data);
					$rootScope.isLoading = false;
				}, function myError(data, status, headers, config) {
					deferred.reject(data.data);
					$rootScope.isLoading = false;
				});
				return deferred.promise;
			}


			httpService.deleteRequest = function (_url, params) {
				var deferred = $q.defer();
				$rootScope.isLoading = true;
				$http({
					method: 'POST',
					url: _url,
					data: params,
					headers: getHeaders(params),
					cache: false,
				}).then(function (data, status, headers, config) {
					deferred.resolve(data.data);
					$rootScope.isLoading = false;
				}, function myError(data, status, headers, config) {
					deferred.reject(data.data);
					$rootScope.isLoading = false;
				});
				return deferred.promise;
			}

			httpService.putRequest = function (_url, _data) {
				var deferred = $q.defer();
				$rootScope.isLoading = true;
				$http({
					method: 'POST',
					url: _url,
					data: _data,
					headers: getHeaders(_data),
					cache: false,
				}).then(function (data, status, headers, config) {
					deferred.resolve(data.data);
					$rootScope.isLoading = false;
				}, function myError(data, status, headers, config) {
					deferred.reject(data.data);
					$rootScope.isLoading = false;
				});
				return deferred.promise;
			}

			return httpService;
		});
});


function getHeaders(_data) {
	var headerSent;
	if (_data.action === "api_auth") {
		headerSent = {
			'Content-Type': 'application/json'
		};
	} else {
		headerSent = {
			'Content-Type': 'application/json',
			'X-AUTH-HEADER': localStorage.getItem('authToken')
		};

	}
	return headerSent;
}