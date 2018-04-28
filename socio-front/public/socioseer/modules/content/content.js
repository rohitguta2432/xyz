'use strict';
define([
	'angular',
	'angularRoute',
	'outreachHelper',
	'userHelper',
	'jquery',
	'contentHelper'
], function (angular) {
	angular.module('socioApp.content', ['ui.router', 'socioApp.outreach.outreachHelper', 'socioApp.user.userHelper', 'thatisuday.ng-image-gallery', 'socioApp.content.contentHelper'])
		.config(['$stateProvider', function ($stateProvider) {
			$stateProvider.state('suggestions', {
				url: '/suggestions',
				templateUrl: 'modules/content/views/suggestions.html',
				controller: 'contentController',
			}).state("contentLibrary", {
				url: '/contentLibrary',
				templateUrl: 'modules/content/views/contentLibrary.html',
				controller: 'contentLibraryController',
			});
		}])
		.config(['ngImageGalleryOptsProvider', function (ngImageGalleryOptsProvider) {
			ngImageGalleryOptsProvider.setOpts({
				thumbnails: true,
				thumbSize: 80,
				inline: false,
				bubbles: true,
				bubbleSize: 20,
				imgBubbles: false,
				bgClose: false,
				piracy: false,
				imgAnim: 'fadeup',
			});
		}])
		.controller('contentController', function (Upload, $scope, $location, localstorage, helperFactory, $state, httpServices, youTubeThumb, formValidator, pagination, outreachHelper, userHelper, $timeout, socialHelper, contentHelper, clientHelper, menuFactory) {
			$scope.$emit('menuItem', menuFactory.getMenuItems($scope));
			$scope.$emit('pageTitle', "Suggestions");
			$scope.$emit('getHeader', true);
			$scope.$emit('getFooter', true);
			/**Check user logged in*/
			if (!helperFactory.isLoggedIn()) {
				$state.go('login');
				return false;
			}
			$scope.extraSettings = SINGLE_CLIENT_DROPDOWN;
			$scope.selectedClient = [];
			$scope.clientComptitors = null;
			if (userHelper.isAdmin()) {
				$scope.adminClientDropdown = true;
			} else {
				$scope.adminClientDropdown = false;
			}
			$scope.changeClientContent = function (data) {
				$scope.clientComptitors = data.competitiorsDefinitions;
			}
			$scope.onDeselectClient = function (data) {
				$scope.clientComptitors = null;
			}
			$scope.popupContent = '';
			$scope.setDataToEditor = function (value) {
				$scope.popupContent = value;
			}
			$scope.tf = {};
			/* get industries */
			clientHelper.getIndustriesData($scope, httpServices, helperFactory);

			/**
			 * @method set filters for trending tweets on change of dropdowns
			 * @param industry Id
			 * @return allSegments object
			 */
			$scope.setTweetsFilter = function (industryId = false) {
				if (industryId) {
					$scope.getSegments(industryId);
				}
				var filterData = $scope.tf;
				var str = '';
				if (typeof filterData.industryFilter != 'undefined' && filterData.industryFilter != null) {
					str += filterData.industryFilter.industryName
				}
				if (typeof filterData.segmentFilter != 'undefined' && filterData.segmentFilter != null) {
					str += ' OR ' + filterData.segmentFilter.segmentName
				}
				if (typeof filterData.compFilter != 'undefined' && filterData.compFilter != null) {
					str += ' OR ' + filterData.compFilter.handles
				}
				var _queryParams = str.replace(/^( OR )/, "");
				/**
				 * get filtered tweets from socialHelper
				 */
				socialHelper.getFilteredTweets($scope, 6, _queryParams);
			}
			/**
			 * @method Get Segments by Industry Id
			 * @param industry Id
			 * @return allSegments object
			 */
			$scope.getSegments = function ($val) {
				var params = {
					'action': API_PATH + 'segment_industry_' + $val
				}
				httpServices.getRequest(API_URL, params).then(function (response) {
					if (response.status == 200) {
						$scope.allSegments = response.data;
					}
				}).catch(function (error) {

				});
			}
			socialHelper.getTrendingTweets($scope, 50);
			$scope.copiedData = null;
			$scope.formValidator = formValidator;
			jQuery('.dropdown-menu.stop-dropdown').on('click', function (e) {
				e.stopPropagation();
			})
			$scope.searchContent = function ($event) {
				if ($event.keyCode == 13 && $scope.searchKey != null) {
					$scope.popularTweetsData = null;
					var params = {
						q: $scope.searchKey,
						lang: 'en',
						result_type: 'popular',
						count: 20
					};
					httpServices.twitterGetTrends(API_URL + '/twitter/trendingPost', params).then(function (data) {
						if (data.status == 200 && !helperFactory.isEmpty(data)) {
							$scope.popularTweetsData = data.data.statuses;
						}
					}).catch(function (error) {

					});
				}
				if ($event.keyCode == 8) {
					var params = {
						q: $scope.searchKey,
						lang: 'en',
						result_type: 'popular',
						count: 50
					}
					httpServices.twitterGetTrends(API_URL + '/twitter/trendingPost', params).then(function (data) {
						if (data.status == 200 && !helperFactory.isEmpty(data)) {
							$scope.popularTweetsData = data.data.statuses;

						}
					}).catch(function (error) {

					});
				}
				if ($scope.searchKey == null) {
					socialHelper.getTrendingTweets($scope, 50);
				}

			}

			contentHelper.saveContentData($scope);


		})
		.controller('contentLibraryController', function ($scope, $location, localstorage, helperFactory, $state, httpServices, youTubeThumb, formValidator, pagination, outreachHelper, userHelper, $timeout, contentHelper, menuFactory) {
			$scope.addLocalTimeStamp = -((new Date()).getTimezoneOffset() * 60 * 1000);
			$scope.$emit('menuItem', menuFactory.getMenuItems($scope));
			$scope.$emit('pageTitle', "Content Library");
			$scope.$emit('getHeader', true);
			$scope.$emit('getFooter', true);
			$scope.helperFactory = helperFactory;
			$scope.fileLimitError = "";
			$scope.filesData = [];
			$scope.fileObjectData = [];
			$scope.formModal = 'addContent';
			$scope.mediaForm = false;
			$scope.contentForm = true;
			$scope.dx = [];
			$scope.contentLib = true;
			$scope.tab = "content";


			/**Check user logged in*/
			if (!helperFactory.isLoggedIn()) {
				$state.go('login');
				return false;
			}

			/*Toggle content and media**/
			$scope.selectedTab = function (tab) {
				$scope.tab = tab;
				$scope.page = 0;
				if (tab == 'media') {
					$scope.filesData = [];
					$scope.mediaForm = true;
					$scope.contentForm = false;
					$scope.formModal = 'addMedia';
					contentHelper.getMediaView($scope);
				} else {
					$scope.filesData = [];
					$scope.mediaForm = false;
					$scope.contentForm = true;
					$scope.formModal = 'addContent';
					contentHelper.getContentView($scope);
				}
			}
			$scope.selectedTab('content');

			/*Pagination*/
			$scope.getPagedData = function (page) {
				$scope.page = page;
				if (page < $scope.dx.length && page >= 0) {
					if ($scope.contentForm) {
						contentHelper.getContentView($scope);
					} else {
						contentHelper.getMediaView($scope);
					}
				}
			}

			/*Search content*/
			$scope.searchCLients = function ($event) {
				$scope.page = 0;
				if ($event.keyCode == 13 && $scope.searchKey != null) {
					if ($scope.tab == "content") {
						contentHelper.getContentView($scope);
					} else {
						contentHelper.getMediaView($scope);
					}
				}
				if ($event.keyCode == 8) {
					if ($scope.tab == "content") {
						contentHelper.getContentView($scope);
					} else {
						contentHelper.getMediaView($scope);
					}
				}
			}

			/**Delete content Modal**/
			$scope.deleteRecord = function (data) {
				$scope.recordData = data;
				$('#delete').modal('show');
			}

			/*Delete content by id*/
			$scope.deleteActionData = function (selectedUserValue) {
				if (selectedUserValue.type == 'image' || selectedUserValue.type == 'video') {
					if (selectedUserValue) {
						var userID = localstorage.get('userId');
						var formData = {};
						var params = {
							'action': API_PATH + "media_delete_" + selectedUserValue.id + "_" + userID,
							'rawBody': formData,
							'rawBodyKey': ''
						};
						httpServices.deleteRequest(API_URL + '/delete', params).then(function (data) {
							if (data) {
								helperFactory.successMessage(data.message);
								$scope.page = 0;
								contentHelper.getMediaView($scope);
							} else {
								helperFactory.errorMessage(data.message);
								$scope.errorMsgLogin = '';
							}
							$('#delete').modal('hide');
						}).catch(function (error) {
							$scope.errorMsgLogin = 'Server error.';
						});

					}
				} else {
					if (selectedUserValue) {
						var userID = localstorage.get('userId');
						var formData = {};
						var params = {
							'action': API_PATH + "content_delete_" + selectedUserValue.id + "_" + userID,
							'rawBody': formData,
							'rawBodyKey': ''
						};
						httpServices.deleteRequest(API_URL + '/delete', params).then(function (data) {
							if (data) {
								helperFactory.successMessage(data.message);
								$scope.page = 0;
								contentHelper.getContentView($scope);
							} else {
								helperFactory.errorMessage(data.message);
								$scope.errorMsgLogin = '';
							}
							$('#delete').modal('hide');
						}).catch(function (error) {
							$scope.errorMsgLogin = 'Server error.';
						});

					}
				}

			}

			/**Add content action**/
			contentHelper.saveContentData($scope);

			/**Add media action**/
			$scope.addMedia = function (addMediaForm) {
				$scope.addMediaForm = addMediaForm;
				contentHelper.addMedia($scope);
			};

			/*Get thumb of youtube video*/
			$scope.mediaSaveButton = false;
			$scope.thumbSrc = "";
			$scope.getThumb = function (url) {
				if (url != undefined) {
					$scope.mediaSaveButton = true;
					$scope.thumbSrc = youTubeThumb.getThumb(url, null);
					if ($scope.thumbSrc != "" && $scope.thumbSrc != undefined) {
						$scope.mediaSaveButton = false;
					}
				}
			}

			$scope.editContentIndex = function (contentIndex) {
				$('#editContent').modal('show');
				var contentID = $scope.contentData[contentIndex].id;
				var contentAction = API_PATH + "content_" + contentID;
				var contentParams = {
					'action': contentAction,
				};
				httpServices.getRequest(API_URL, contentParams).then(function (data) {
					if (data.status == 200) {
						$scope.filesData = [];
						$scope.editContentData = data.data;
						$scope.editContentData.selectedClient = {
							"id": $scope.editContentData.clientId
						}
					} else {
						$scope.contentDataMsg = "No content found";
					}
				}).catch(function (error) {
					$scope.errorMsgLogin = 'Server error.';
				});

			}
			/**Validation**/
			$scope.formValidator = formValidator;

			$scope.listValidatorMedia = function (inptVal) {
				if ($scope.mediaForm && inptVal.length == 0) {
					return "Required";
				} else {
					return true;
				}
			}

			$scope.addMoreMedia = function () {
				if ($scope.filesData.length < 10) {
					$scope.fileLimitError = "";
					jQuery('#media-img-media').click();
				} else {
					$scope.fileLimitError = "Can't select more than 10 files."
				}
			}

			$scope.updateContent = function (editContentForm) {
				contentHelper.updateContent(editContentForm, $scope);
			}
			$scope.resetFormData = function (addContentForm, addMediaForm) {
				addContentForm.reset();
				editContentForm.reset();
				addMediaForm.reset();
				$scope.mediaKeywords = null;
				$scope.contentKeywords = null;
				$scope.file = '';
				$scope.selectedClient = '';
				$scope.contentTitle = '';
				$scope.description = '';
				$scope.videoFile = '';
				$scope.filesData = [];
			}
			$scope.deleteMedia = function (media) {

			}

		});
});