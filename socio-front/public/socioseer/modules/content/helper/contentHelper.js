define([
	'angular',
	'angularRoute',
	'jquery'
], function (angular, angularRoute) {
	angular.module('socioApp.content.contentHelper', ['ngSanitize'])
		.factory('contentHelper', function (Lightbox, localstorage, Upload, httpServices, helperFactory, userHelper, clientHelper, pagination, outreachHelper, $timeout, rolesHelper) {

			var contentHelper = {};
			contentHelper.saveContentData = function ($scope) {

				$('#addMedia, #addContent').on('hidden.bs.modal', function () {
					// do something…
					$scope.fileObjectData = [];
				})

				$scope.extraSettings = SINGLE_CLIENT_DROPDOWN;
				$scope.selectedClientData = [];

				$scope.changeClientDropDown = function () {
					$scope.clientId = $scope.selectedClientData[0].id;
					$scope.selectedClientError = false;
				}

				$scope.onDeselectClient = function () {
					$scope.selectedClientError = false;
				}

				/**
				 * @method set Copied data into form
				 */
				$scope.setCopiedData = function (value, addContentForm, external = false) {
					addContentForm.reset();
					if (external) {
						$scope.contentDataComposePost.description = value.text;
					} else {
						$scope.description = value.text;
					}

					$scope.selectedClientError = false;
					$scope.videoFile = '';
					$scope.filesData = [];
					$scope.copiedData = value.text;
					$scope.contentKeywords = null;
					$scope.contentSourceUrl = null;
					$scope.file = '';

					if (!helperFactory.isEmpty(value.entities.urls) && typeof value.entities.urls[0].url != 'undefined') {
						$scope.contentSourceUrl = value.entities.urls[0].url;
					} else if (typeof value.entities.media != 'undefined' && typeof value.entities.media[0].url) {
						$scope.contentSourceUrl = value.entities.media[0].url;
					} else {
						$scope.contentSourceUrl = '';
					}
				}

				$scope.addMoreContentMedia = function () {
					if ($scope.filesData.length < 10) {
						$scope.fileLimitError = "";
						jQuery('#media-img-content').click();
					} else {
						$scope.fileLimitError = "Can't select more than 10 files."
					}
				}

				/** Update content */
				$scope.clientDropdown = false;
				if (userHelper.isAdmin()) {
					$scope.clientDropdown = true;
					outreachHelper.getClient($scope, httpServices, helperFactory, localstorage);

				} else {
					$scope.clientId = localstorage.get('clientId');
				}
				$scope.changeClient = function (data) {
					if (data != undefined) {
						$scope.clientId = data.id;
					}
				}
				$scope.fileLimitError = "";
				$scope.filesData = [];
				$scope.fileObjectData = [];
				$scope.previewFiles = function (files) {
					if (!helperFactory.isEmpty(files)) {
						var imgData = {};
						var totalFiles = files;
						$scope.fileError = "";
						angular.forEach(totalFiles, function (file) {
							if ($scope.filesData.length < 10) {
								$scope.mediaSaveButton = false;
								var srcFile = file.$ngfBlobUrl;
								var prevExist = false;
								angular.forEach($scope.filesData, function (fd) {
									if (fd.name === file.name) {
										prevExist = true;
									}
								})
								if (!prevExist) {
									if (helperFactory.getImageMessages(file, 3000, 3000, 4)) {
										$scope.filesData.push({
											'src': file.$ngfBlobUrl,
											'name': file.name,
											'type': 'image'
										});
										$scope.fileObjectData.push(file);
									}
								}
							} else {
								$scope.fileLimitError = "Can't select more than 10 files.";
							}
						});
					}
				}
				$scope.videoPreview = false;
				$scope.mergeVideo = function (files) {
					if (files) {
						if (helperFactory.getVideoMessages(files, 15)) {
							$scope.videoPreview = true;
							$scope.fileObjectData.push(files);
						} else {
							$scope.videoFile = null;
							$scope.videoPreview = false;
						}
					}
				}

				$scope.removeFile = function (index) {
					$scope.fileLimitError = "";
					$scope.filesData.splice(index, 1);
					$scope.fileObjectData.splice(index, 1);
					/*console.log($scope.filesData);
					console.log($scope.fileObjectData);*/
				}
				/* Add Content */
				$scope.addContent = function (addContentForm, external = false) {

					if (external) {
						$scope.contentTitle = $scope.contentDataComposePost.contentTitle;
						$scope.description = $scope.contentDataComposePost.description;
						$scope.contentKeywords = $scope.contentDataComposePost.contentKeywords;
						$scope.contentSourceUrl = $scope.contentDataComposePost.contentSourceUrl;
					}

					if ($scope.selectedClientData.length > 0) {
						$scope.selectedClientError = false;
					} else {
						$scope.selectedClientError = true;
					}
					if (!userHelper.isAdmin()) {
						$scope.selectedClientError = false;
					}
					if (addContentForm.$valid && !$scope.selectedClientError) {
						$scope.isClicked = true;
						var totalFiles = $scope.fileObjectData;

						var count = 0;
						var mediaFilesData = [];

						if (totalFiles != undefined && totalFiles.length > 0) {
							angular.forEach(totalFiles, function (files) {
								Upload.upload({
									url: API_URL + '/image',
									data: {
										file: files
									}
								}).then(function (resp) {
									var formData = {
										"keywords": [],
										"clientId": $scope.clientId,
										"createdBy": localstorage.get('userId'),
										"contentList": [{
											"videoUrl": $scope.thumbSrc,
											"mediaType": "IMAGE",
											"originalFileName": files.name,
											"hashFileName": ""
										}]
									};

									var params = {
										'action': API_PATH + "media",
										'rawBody': formData,
										'rawBodyKey': 'media',
										'fileKey': 'files',
										"file": resp.data.upload_file_name
									};


									httpServices.postMediaRequest(API_URL + '/media', params).then(function (data) {
										if (data.status == 200) {
											count++;
											mediaFilesData.push(data.data[0]);
											if (count === totalFiles.length) {
												var action = API_PATH + 'content';
												var contentData = {};
												contentData.brandId = "";
												contentData.clientId = $scope.clientId;
												contentData.platforms = [];
												contentData.tags = [];
												contentData.title = $scope.contentTitle;
												contentData.media = mediaFilesData;

												angular.forEach($scope.contentKeywords, function (keywords) {
													contentData.tags.push(keywords.text);
												})

												contentData.author = localstorage.get('userId');

												contentData.authorName = localstorage.get('currentUserName');

												contentData.postURL = $scope.contentSourceUrl;
												contentData.postDescription = $scope.description;
												contentData.createdAt = "";
												contentData.updatedAt = "";
												contentData.createdBy = localstorage.get('userId');
												contentData.campaignId = "";
												contentData.youTubeUrl = "";
												contentData.status = 1;
												var userData = {
													'action': action,
													'myparam': contentData
												};


												httpServices.postRequest(API_URL, userData).then(function (data) {

													if (data.status == 200) {
														helperFactory.successMessage(data.message);
														if ($scope.contentLib) {
															$scope.page = 0;
															contentHelper.getContentView($scope);
														}
														jQuery('button.close').click();
													} else {
														helperFactory.errorMessage(data.message);
													}

													$scope.isClicked = false;

												}).catch(function (error) {
													$scope.isClicked = false;
												});
											} else { }
										}
									}).catch(function (error) { });
								}, function (resp) { }, function (evt) {

								});
							});
						} else {
							/*add only comtent*/
							var action = API_PATH + 'content';
							var contentData = {};
							contentData.brandId = "";
							contentData.clientId = $scope.clientId;
							contentData.platforms = [];
							contentData.tags = [];
							contentData.title = $scope.contentTitle;
							contentData.media = mediaFilesData;
							angular.forEach($scope.contentKeywords, function (keywords) {
								contentData.tags.push(keywords.text);
							})
							contentData.author = localstorage.get('userId');
							contentData.authorName = localstorage.get('currentUserName');
							contentData.postURL = $scope.contentSourceUrl;
							contentData.postDescription = $scope.description;
							contentData.createdAt = "";
							contentData.updatedAt = "";
							contentData.createdBy = localstorage.get('userId');
							contentData.campaignId = "";
							contentData.status = 1;
							var userData = {
								'action': action,
								'myparam': contentData
							};

							httpServices.postRequest(API_URL, userData).then(function (data) {
								if (data.status == 200) {
									jQuery('button.close').click();
									$scope.page = 0;
									contentHelper.getContentView($scope);
									helperFactory.successMessage(data.message);
								} else {
									helperFactory.errorMessage(data.message);
								}
								$scope.isClicked = false;
							}).catch(function (error) {
								$scope.isClicked = false;
							});

						}
					} else { }
				}
			}

			/**Get content view**/
			contentHelper.getContentView = function ($scope) {

				$scope.page = $scope.page;
				$scope.per_page = 10;
				var action;
				action = API_PATH + "content_all";
				var params = {
					'action': action,
					'page': $scope.page,
					'size': 10,
					'sort': 'createdDate,desc',
				};
				params.q = 'status:1,2;createdBy:' + helperFactory.getLoggedInUserId();
				if (userHelper.isAdmin()) {
					params.q = 'status:1,2'
				} else if (userHelper.isClientAdmin()) {
					params.q = 'status:1,2;clientId:' + helperFactory.getLoggedInUserClientId()
				}
				if ($scope.searchKey != undefined && $scope.searchKey != null) {
					params.q += ';title:' + $scope.searchKey + '~true'
				} else {
					$scope.searchKey = null;
				}
				httpServices.getRequest(API_URL, params).then(function (data) {
					if (data.status == 200) {
						$scope.countValue = data.count;
						if (!helperFactory.isEmpty(data.data)) {
							$scope.contentData = data.data;
						} else {
							$scope.contentDataMsg = "No content found";
						}

					} else {
						$scope.contentDataMsg = "No content found";
					}
					$scope.totalRecords = data.count;
					pagination.setPagination($scope);
				}).catch(function (error) {
					$scope.errorMsgLogin = 'Server error.';
				});
			}
			/**Get media view**/
			contentHelper.getMediaView = function ($scope) {
				$scope.page = $scope.page;
				$scope.images = [];
				var actionMedia = API_PATH + "media" + "_all";
				var paramsMedia = {
					'action': actionMedia,
					'page': $scope.page,
					'size': 10,
					'sort': 'createdDate,desc',

				};
				paramsMedia.q = 'status:1,2;createdBy:' + helperFactory.getLoggedInUserId();
				if (userHelper.isAdmin()) {
					paramsMedia.q = 'status:1,2'
				} else if (userHelper.isClientAdmin()) {
					paramsMedia.q = 'status:1,2;clientId:' + helperFactory.getLoggedInUserClientId()
				}
				if ($scope.searchKey != undefined && $scope.searchKey != null) {
					paramsMedia.q += ';keywords:' + $scope.searchKey + '~true'
				} else {
					$scope.searchKey = null;
				}
				httpServices.getRequest(API_URL, paramsMedia).then(function (data) {
					if (data.status == 200) {
						$scope.countValue = data.count;
						if (data.hasOwnProperty('data') && data.count > 0) {
							$scope.mediaDataError = "";
							$scope.mediaData = data.data;
							$timeout(function () {
								angular.forEach($scope.mediaData, function (med, index) {
									var thumb = med.url;
									$scope.images.push({
										id: med.id,
										type: med.mediaType.toLowerCase(),
										url: med.url,
										thumbUrl: thumb
									});
								})

							});

							$scope.Lightbox = Lightbox;

						} else {
							$scope.mediaDataError = "No media found";
							$scope.images = [];
						}
						$scope.totalRecords = data.count;
						pagination.setPagination($scope);

					} else {
						$scope.errorMsgLogin = '';
					}
				}).catch(function (error) {
					$scope.errorMsgLogin = 'Server error.';
				});
			}

			/* Add Media */
			contentHelper.addMedia = function ($scope) {
				console.log($scope.fileObjectData)
				if ($scope.selectedClientData.length > 0) {
					$scope.selectedClientError = false;
				} else {
					$scope.selectedClientError = true;
				}
				if (!userHelper.isAdmin()) {
					$scope.selectedClientError = false;
				}


				if ($scope.fileObjectData.length > 0) {
					$scope.fileError = '';
				} else {
					$scope.fileError = "Required";
				}


				if (!$scope.selectedClientError && $scope.fileError == "") {
					$scope.isClicked = true;
					var totalFiles = contentHelper.uniqueFilter($scope.fileObjectData, 'name');
					var count = 0;
					var mediaFilesData = [];


					if (totalFiles != undefined && totalFiles.length > 0) {

						angular.forEach(totalFiles, function (files, indexx) {
							Upload.upload({
								url: API_URL + '/image',
								data: {
									file: files
								}
							}).then(function (resp) {
								var formData = {
									"clientId": $scope.clientId,
									"createdBy": localstorage.get('userId'),
									"contentList": [{
										"videoUrl": $scope.thumbSrc,
										"mediaType": "IMAGE",
										"originalFileName": files.name,
										"hashFileName": ""
									}]
								};
								formData.keywords = [];
								angular.forEach($scope.mediaKeywords, function (kw) {
									formData.keywords.push(kw.text)
								})
								var params = {
									'action': API_PATH + "media",
									'rawBody': formData,
									'rawBodyKey': 'media',
									'fileKey': 'files',
									"file": resp.data.upload_file_name
								};

								httpServices.postMediaRequest(API_URL + '/media', params).then(function (data) {
									count++;
									$scope.images = [];
									if (data.status == 200) {
										jQuery('button.close').click();
										$scope.page = 0;
										if (totalFiles.length == indexx + 1) {
											$scope.filesData = [];
											$scope.fileObjectData = [];
											contentHelper.getMediaView($scope);
											helperFactory.successMessage(data.message);
										}
									} else {
										helperFactory.errorMessage(data.message);
									}
									$scope.isClicked = false;
								}).catch(function (error) {
									$scope.isClicked = false;
								});

							}, function (resp) { }, function (evt) {

							});
						});
					}

				} else {

				}
			}

			/** Update content */
			contentHelper.updateContent = function (editContentForm, $scope) {
				if (!editContentForm.$valid) {
					return false;
				}
				var totalFiles = $scope.fileObjectData;
				var count = 0;
				var mediaFilesData = [];

				if (totalFiles != undefined && totalFiles.length > 0) {
					$scope.isClicked = true;
					angular.forEach(totalFiles, function (files) {
						Upload.upload({
							url: API_URL + '/image',
							data: {
								file: files
							}
						}).then(function (resp) {
							var formData = {
								"keywords": [],
								"clientId": $scope.editContentData.selectedClient.id,
								"createdBy": localstorage.get('userId'),
								"contentList": [{
									"videoUrl": "",
									"mediaType": "IMAGE",
									"originalFileName": files.name,
									"hashFileName": ""
								}]
							};

							var params = {
								'action': API_PATH + "media",
								'rawBody': formData,
								'rawBodyKey': 'media',
								'fileKey': 'files',
								"file": resp.data.upload_file_name
							};

							httpServices.postMediaRequest(API_URL + '/media', params).then(function (data) {
								if (data.status == 200) {
									count++;
									mediaFilesData.push(data.data[0]);
									if (count === totalFiles.length) {
										var actionContent = API_PATH + 'content_' + $scope.editContentData.id;
										var contentData = {};
										contentData.brandId = "";
										contentData.clientId = $scope.editContentData.selectedClient.id;
										contentData.platforms = [];
										contentData.tags = [];
										contentData.title = $scope.editContentData.title;
										contentData.media = mediaFilesData;
										angular.forEach($scope.editContentData.tags, function (keywords) {
											contentData.tags.push(keywords.text);
										})
										contentData.author = "1";
										contentData.authorName = localstorage.get('currentUserName');
										contentData.postURL = $scope.editContentData.postURL;
										contentData.postDescription = $scope.editContentData.postDescription;
										contentData.createdAt = "";
										contentData.updatedAt = "";
										contentData.createdBy = localstorage.get('userId');
										contentData.campaignId = "";
										contentData.status = 1;
										var postUpParams = {
											'action': actionContent,
											'rawBody': contentData
										};

										httpServices.putRequest(API_URL + '/put', postUpParams).then(function (upData) {
											if (upData.status == 200) {
												jQuery('button.close').click();
												helperFactory.successMessage(data.message);

												$scope.page = 0;
												contentHelper.getContentView($scope);

											} else {
												helperFactory.errorMessage(data.message);
											}
											$scope.isClicked = false;
										}).catch(function (error) {
											$scope.errorMsgLogin = 'Server error.';
											$scope.success = false;
											$scope.isClicked = false;
										});

									} else { }
								}
							}).catch(function (error) { });
						}, function (resp) { }, function (evt) {

						});
					});
				} else {
					var actionContent = API_PATH + 'content_' + $scope.editContentData.id;
					var contentData = {};
					contentData.brandId = "";
					contentData.clientId = $scope.editContentData.selectedClient.id;
					contentData.platforms = [];
					contentData.tags = [];
					contentData.title = $scope.editContentData.title;
					contentData.media = mediaFilesData;
					angular.forEach($scope.editContentData.tags, function (keywords) {
						contentData.tags.push(keywords.text);
					})
					contentData.author = "1";
					contentData.authorName = localstorage.get('currentUserName');
					contentData.postURL = $scope.editContentData.postURL;
					contentData.postDescription = $scope.editContentData.postDescription;
					contentData.createdAt = "";
					contentData.updatedAt = "";
					contentData.createdBy = localstorage.get('userId');
					contentData.campaignId = "";
					contentData.status = 1;
					var postUpParams = {
						'action': actionContent,
						'rawBody': contentData
					};

					httpServices.putRequest(API_URL + '/put', postUpParams).then(function (upData) {
						if (upData.status == 200) {
							jQuery('button.close').click();
							helperFactory.successMessage(upData.message);
							$scope.page = 0;
							contentHelper.getContentView($scope);


						} else {
							helperFactory.errorMessage(upData.message);
						}
						$scope.isClicked = false;
					}).catch(function (error) {
						$scope.errorMsgLogin = 'Server error.';
						$scope.success = false;
						$scope.isClicked = false;
					});
				}
			}

			/**Include gallery**/
			contentHelper.includeGallery = function ($scope) {
				/**Image gallery */
				$scope.methods = {};
				$scope.openGallery = function () {
					$scope.methods.open();
				};

				$scope.closeGallery = function () {
					$scope.methods.close();
				};

				$scope.nextImg = function () {
					$scope.methods.next();
				};

				$scope.prevImg = function () {
					$scope.methods.prev();
				};
				$scope.conf = {
					thumbnails: true,
					thumbSize: 180,
					inline: false,
					bubbles: true,
					bubbleSize: 20,
					imgBubbles: false,
					bgClose: false,
					piracy: false,
					imgAnim: 'fadeup',
				};
			}


			contentHelper.uniqueFilter = function (collection, keyname) {
				var output = [],
					keys = [];

				angular.forEach(collection, function (item) {
					var key = item[keyname];
					if (keys.indexOf(key) === -1) {
						keys.push(key);
						output.push(item);
					}
				});
				return output;
			}


			return contentHelper;
		});
});