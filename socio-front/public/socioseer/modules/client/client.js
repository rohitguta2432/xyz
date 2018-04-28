/**
 * Client Module Controllers
 * @author Gaurav Sirauthiya
 */
'use strict';

define([
	'angular',
	'jquery',
	'angularRoute',
	'datepicker',
	'clientHelper'
], function (angular) {
	angular.module('socioApp.client', ['ui.router', 'socioApp.client.clientHelper'])
		.config(['$stateProvider', function ($stateProvider) {
			$stateProvider.state('client', {
				url: '/client',
				templateUrl: 'modules/client/views/client.html',
				controller: 'clientListController',
			}).state("addClient", {
				url: '/addClient',
				templateUrl: 'modules/client/views/addClient.html',
				controller: 'addClientController',
			}).state("createBrand", {
				url: '/createBrand',
				templateUrl: 'modules/client/views/createBrand.html',
				controller: 'createBrandController',
			}).state("viewClient", {
				url: '/viewClient',
				templateUrl: 'modules/client/views/viewClient.html',
				controller: 'viewClientController',
			})
		}]).directive('fileModel', ['$parse', function ($parse) {
			return {
				restrict: 'A',
				link: function (scope, element, attrs) {
					var model = $parse(attrs.fileModel);
					var modelSetter = model.assign;

					element.bind('change', function () {
						scope.$apply(function () {
							modelSetter(scope, element[0].files[0]);
						});
					});
				}
			};
		}])
		.directive('input', function () {
			return {
				restrict: 'E',
				require: '?ngModel',
				link: function (scope, element, attr, ngModel) {
					if (ngModel) {
						var convertToModel = function (value) {
							return value === '' ? null : value;
						};
						ngModel.$parsers.push(convertToModel);
					}
				}
			};
		})
		/**
		 * @controller add Client
		 */
		.controller('addClientController', function ($scope, $location, localstorage, helperFactory, $state, httpServices, Upload, formValidator, clientHelper, $timeout, menuFactory) {
			if (!helperFactory.isLoggedIn()) {
				$state.go('login');
				return false;
			}
			$scope.addLocalTimeStamp = -((new Date()).getTimezoneOffset() * 60 * 1000);

			$scope.files = [];
			$scope.$on("seletedFile", function (event, args) {
				$scope.$apply(function () {
					$scope.files.push(args.file);
				});
			});

			$scope.editClient = false;
			$scope.segmentData = null;
			$scope.$emit('pageTitle', "Create Client");
			$scope.$emit('menuItem', menuFactory.getMenuItems($scope));
			$scope.$emit('getHeader', true);
			$scope.$emit('getSidebar', true);
			$scope.$emit('getFooter', true);
			$scope.$emit('titleSection', true);
			clientHelper.getLicenceTypeData($scope, httpServices, helperFactory);
			clientHelper.getIndustriesData($scope, httpServices, helperFactory);
			clientHelper.getAllCountriesData($scope, httpServices, helperFactory);
			clientHelper.getRegionByCountryIdData($scope, httpServices, helperFactory);
			clientHelper.getSegmentNameById($scope, httpServices, helperFactory);
			clientHelper.getSegmentsByIndustry($scope, httpServices, helperFactory);
			clientHelper.getSubSegmentsByIndustry($scope, httpServices, helperFactory);
			/* check for step 2 */
			if (sessionStorage.currentCLient) {
				$scope.editClient = sessionStorage.currentCLient;
				var action = API_PATH + "client_" + $scope.editClient;
				var header = localstorage.get('authToken');
				var params = {
					'action': action
				};
				$scope.client = {};
				httpServices.getRequest(API_URL, params).then(function (response) {
					if (response.status == 200 && !helperFactory.isEmpty(response.data)) {
						$scope.client = response.data;
						$scope.industryData = $scope.client.industry;
						$scope.segmentsData = $scope.getSegments($scope.industryData.id);
						$scope.subSegmentsData = $scope.getSubSegments($scope.client.segment.id);
						$scope.clientInformation = $scope.client.clientInformation;
						if ($scope.clientInformation != null) {
							$scope.countries = {
								'id': $scope.clientInformation.country
							};
							$scope.countryRegionData = $scope.getRegionByCountryId($scope.clientInformation.country);
							$scope.regions = {
								'name': $scope.clientInformation.state
							};
						}
						$scope.client.status = 1;
						$scope.segmentData = response.data.segment;
						if (response.data.profileImageUrl != null) {
							$scope.clientImage = response.data.profileImageUrl;
						}
						$scope.licenseType = response.data.licenseType;
						$scope.subSegmentData = response.data.subSegment;
						$scope.client.startDateString = helperFactory.formatDate($scope.client.subscriptionStartDate, 'monthName')
						$scope.client.endDateString = helperFactory.formatDate($scope.client.subscriptionEndDate, 'monthName')
					} else {
						$scope.errorMsgLogin = '';
					}
				}).catch(function (error) {
					$scope.errorMsgLogin = 'Server error.';
				});

				$scope.getAllCountries();
				jQuery('#menu1').removeClass('active in');
				jQuery('.process-step.menu1').removeClass('active').addClass('complete');
				jQuery('.process-step.menu2').removeClass('disabled').addClass('active');
				jQuery('#menu2').addClass('active in');
			}
			jQuery('.btn-circle').on('click', function () {
				jQuery(this).addClass('btn-info').removeClass('btn-default').blur();
			});
			jQuery('.next-step, .prev-step').on('click', function (e) {
				var $activeTab = jQuery('.tab-pane.active');
				var formName = jQuery(this).closest('form').attr('name');
				if (jQuery(e.target).hasClass('next-step')) {

				} else {
					var prevTab = $activeTab.prev('.tab-pane').attr('id');
					jQuery('[href="#' + prevTab + '"]').addClass('btn-info').removeClass('btn-default');
					jQuery('[href="#' + prevTab + '"]').tab('show');
					var res = prevTab.substring(4, 5);
					res = parseInt(res) + 1;
					var nextTab = "menu" + res + "";
					jQuery('.process-step.bs-wizard-step.' + nextTab + '').addClass('disabled').removeClass('active');
					jQuery('.process-step.bs-wizard-step.' + prevTab + '').addClass('active').removeClass('complete');
				}

			});
			var that = this;
			$scope.client = {};
			that.visibility = true;
			$scope.client.competitiorsDefinitions = [{
				'handle': {},
				'name': null,
				'keyword': null
			}];
			$scope.helperFactory = helperFactory;
			$scope.addMoreCompetitors = function () {
				$scope.client.competitiorsDefinitions.push({
					'handle': {},
					'name': null,
					'keyword': null
				});
				return false;
			}

			$scope.changeMySrc = function () {
				if (typeof $scope.file != 'undefined' && $scope.file != null) {
					if (helperFactory.getImageMessages($scope.file)) {
						$scope.clientImage = $scope.file.$ngfBlobUrl;
					} else {
						$scope.file = null;
					}
				}
			}
			$scope.opeFileManager = function () {
				jQuery('input[type="file"]').click();
			}
			/**
			 * @saveClient step 1
			 */
			$scope.formValidator = formValidator;
			$scope.minDate = new Date().toDateString();
			$scope.saveClientStep1 = function (formName) {
				if (formName.$valid) {
					var formData = $scope.client;
					if (sessionStorage.currentCLient) {
						$scope.editClient = sessionStorage.currentCLient;
					}
					var startDateString = formData.startDateString;
					var endDateString = formData.endDateString;
					$scope.competitiors = [];
					formData.status = 1;
					formData.updatedBy = localstorage.get('userId');
					formData.subscriptionStartDate = helperFactory.getUTCTimeStamp(startDateString);
					formData.subscriptionEndDate = helperFactory.getUTCTimeStamp(endDateString);

					formData.industry = {};
					formData.segment = {};
					formData.subSegment = {};
					formData.licenseType = {};
					if (typeof $scope.segmentData != 'undefined') {
						formData.segment.id = $scope.segmentData.id;
						formData.segment.segmentName = $scope.segmentData.segmentName;
					}
					if (typeof $scope.licenseTypesData != 'undefined') {
						formData.licenseType.id = $scope.licenseTypesData.id;
						formData.licenseType.licenceType = $scope.licenseTypesData.licenceType;
					}
					if (typeof $scope.subSegmentData != 'undefined') {
						formData.subSegment.id = $scope.subSegmentData.id;
						formData.subSegment.subSegmentName = $scope.subSegmentData.subSegmentName;
					}
					if (typeof $scope.industryData != 'undefined') {
						formData.industry.id = $scope.industryData.id;
						formData.industry.industryName = $scope.industryData.industryName;
					}

					var competitiorsData = [];
					angular.forEach($scope.client.competitiorsDefinitions, function (val, key) {
						var keys = [];
						var hnds = {};
						angular.forEach(val.keyword, function (v, k) {
							keys.push(v.text);
						});
						val.keywords = keys;
						angular.forEach(val.handle, function (hand, hk) {
							var hands = [];
							angular.forEach(hand, function (v, k) {
								hands.push(v.text);
							});
							hnds[hk] = hands;
						});
						val.keywords = keys;
						val.handles = hnds;
						competitiorsData.push(val);
					});
					//formData.competitiorsData = competitiorsData;
					angular.forEach(competitiorsData, function (value, key) {
						delete value.handle;
						delete value.keyword;
					})
					formData.competitiorsDefinitions = competitiorsData;
					formData.createdBy = helperFactory.getLoggedInUserId();

					var headers = helperFactory.getAuthToken();
					var action = API_PATH + 'client';
					/* if editing client */
					if (sessionStorage.currentCLient) {
						delete formData.id;
						formData.status = 1;
						action = API_PATH + "client_" + sessionStorage.currentCLient;
						var params = {
							'action': action,
							'rawBody': formData,
							"rawBodyKey": "client"
						};
						if ($scope.file && typeof $scope.file !== 'undefined' && $scope.file != null) {
							Upload.upload({
								url: API_URL + '/image',
								data: {
									file: $scope.file
								}
							}).then(function (resp) {
								params = {
									'action': action,
									'rawBody': formData,
									"rawBodyKey": "client",
									"fileKey": "logo",
									"file": resp.data.upload_file_name
								};
								httpServices.postMediaRequest(API_URL + "/media/put", params).then(function (data) {
									if (data.status == 200 && data.data != null) {
										helperFactory.successMessage(data.message);
										var $activeTab = jQuery('.tab-pane.active');
										var nextTab = $activeTab.next('.tab-pane').attr('id');
										jQuery('[href="#' + nextTab + '"]').addClass('btn-info').removeClass('btn-default');
										jQuery('[href="#' + nextTab + '"]').tab('show');

										var res = nextTab.substring(4, 5);
										res = parseInt(res) - 1;
										var prevTab = "menu" + res + "";
										jQuery('.process-step.bs-wizard-step.' + nextTab + '').addClass('active').removeClass('disabled');
										jQuery('.process-step.bs-wizard-step.' + prevTab + '').addClass('complete').removeClass('active');
									} else {
										helperFactory.errorMessage(data.message);
										scope.errorMsgLogin = '';
									}
								}).catch(function (error) {
									scope.errorMsgLogin = 'Server error.';
								});
							});
						} else {
							httpServices.postMediaRequest(API_URL + "/media/put", params).then(function (data) {
								if (data.status == 200 && data.data != null) {
									helperFactory.successMessage(data.message);
									$scope.clientData = data.data;
									var $activeTab = jQuery('.tab-pane.active');
									var nextTab = $activeTab.next('.tab-pane').attr('id');
									jQuery('[href="#' + nextTab + '"]').addClass('btn-info').removeClass('btn-default');
									jQuery('[href="#' + nextTab + '"]').tab('show');

									var res = nextTab.substring(4, 5);
									res = parseInt(res) - 1;
									var prevTab = "menu" + res + "";
									jQuery('.process-step.bs-wizard-step.' + nextTab + '').addClass('active').removeClass('disabled');
									jQuery('.process-step.bs-wizard-step.' + prevTab + '').addClass('complete').removeClass('active');
								} else {
									helperFactory.errorMessage(data.message);
									scope.errorMsgLogin = '';
								}
							}).catch(function (error) {
								scope.errorMsgLogin = 'Server error.';
							});
						}

					} else {
						/* upload image */
						var clientImageData = $scope.file;
						if (typeof clientImageData != 'undefined' && clientImageData != null) {
							Upload.upload({
								url: API_URL + '/image',
								data: {
									file: clientImageData
								}
							}).then(function (resp) {
								formData.status = 1;
								var params = {
									'action': action,
									'rawBody': formData,
									"rawBodyKey": "client",
									"fileKey": "logo",
									"file": resp.data.upload_file_name
								};
								$scope.saveClientData(params);
							}).catch(function (error) {
								$scope.errorMsgLogin = 'Server error.';
							});
						} else {
							formData.status = 1;
							var params = {
								'action': action,
								'rawBody': formData,
								"rawBodyKey": "client"
							};
							$scope.saveClientData(params);
						}
						$scope.getAllCountries();
					}
				}
			}

			$scope.saveClientData = function (params) {
				httpServices.postMediaRequest(API_URL + '/media', params).then(function (data) {
					if (data.status == 200) {
						helperFactory.successMessage(data.message);
						$scope.clientData = data.data;
						var $activeTab = jQuery('.tab-pane.active');
						var nextTab = $activeTab.next('.tab-pane').attr('id');
						jQuery('[href="#' + nextTab + '"]').addClass('btn-info').removeClass('btn-default');
						jQuery('[href="#' + nextTab + '"]').tab('show');

						var res = nextTab.substring(4, 5);
						res = parseInt(res) - 1;
						var prevTab = "menu" + res + "";
						jQuery('.process-step.bs-wizard-step.' + nextTab + '').addClass('active').removeClass('disabled');
						jQuery('.process-step.bs-wizard-step.' + prevTab + '').addClass('complete').removeClass('active');
						sessionStorage.currentCLient = $scope.clientData.id;
					} else {
						helperFactory.errorMessage(data.message);
						$scope.errorMsgLogin = '';
					}
				}).catch(function (error) {
					$scope.errorMsgLogin = 'Server error.';
				});
			}
			/**
			 * @SaveClient Step 2
			 */
			$scope.saveClientStep2 = function (formName) {
				if (formName.$valid) {
					var $activeTab = jQuery('.tab-pane.active');
					var nextTab = $activeTab.next('.tab-pane').attr('id');
					var activeTabId = jQuery('.tab-pane.active').attr('id');
					jQuery('[href="#' + nextTab + '"]').addClass('btn-info').removeClass('btn-default');
					jQuery('[href="#' + activeTabId + '"]').addClass('btn-info').removeClass('btn-default');
					jQuery('[href="#' + nextTab + '"]').tab('show');

					var res = nextTab.substring(4, 5);
					res = parseInt(res) - 1;
					var prevTab = "menu" + res + "";

					jQuery('.process-step.bs-wizard-step.' + nextTab + '').addClass('active').removeClass('disabled');
					jQuery('.process-step.bs-wizard-step.' + prevTab + '').addClass('complete').removeClass('active');

					var formData = $scope.clientInformation;
					if (typeof $scope.countries != 'undefined') {
						formData.country = $scope.countries.id;
						/*if ($scope.countries.woeid) {
							formData.woeid = $scope.countries.woeid;
						}*/
					}
					if (typeof $scope.regions != 'undefined') {
						formData.state = $scope.regions.name;
					}

					var info = {
						"clientInformation": formData
					}
					action = API_PATH + "client_" + sessionStorage.currentCLient;
					var params = {
						'action': action,
						'rawBody': info,
						"rawBodyKey": "client",
					};
					httpServices.postMediaRequest(API_URL + "/media/put", params).then(function (data) {
						if (data.status == 200 && !helperFactory.isEmpty(data.data)) {
							helperFactory.successMessage(data.message);
						} else {
							helperFactory.errorMessage(data.message);
						}
					}).catch(function (error) {
						$scope.errorMsgLogin = 'Server error.';
					});
				}
			}

			/**
			 * @method Save Client Step 3
			 */
			$scope.saveClientStep3 = function (formName) {
				var formData = $scope.accountDetails;
				if (typeof formData != 'undefined' && formName.$valid) {
					formData.clientId;
					formData.clientName = $scope.client.clientName;
					formData.clientId = sessionStorage.currentCLient;

					var action = API_PATH + 'client_user';
					var userData = {
						'action': action,
						'myparam': [formData]
					};
					httpServices.postRequest(API_URL, userData).then(function (data) {
						if (data.status == 200) {
							helperFactory.successMessage('Client Saved Successfully..');
							$state.go('client');
						} else {
							helperFactory.errorMessage(data.message);
						}
					}).catch(function (error) {
						$scope.errorMsgLogin = 'Server error.';
					});
				}
			}

			/**
			 * @author: Anjani
			 * @desc: Add platform details for competitors data
			 */

			$scope.platformData = localstorage.getObject('platformObj');

		}).controller('clientListController', function ($scope, $stateParams, $location, localstorage, helperFactory, $state, httpServices, pagination, clientHelper, userHelper, menuFactory) {
			if (!helperFactory.isLoggedIn()) {
				$state.go('login');
				return false;
			}

			if (!userHelper.isAdmin()) {
				$state.go('summary');
			}

			sessionStorage.removeItem('currentCLient');
			sessionStorage.removeItem('viewClient');
			sessionStorage.removeItem('editMode');
			$scope.$emit('menuItem', menuFactory.getMenuItems($scope));
			$scope.$emit('pageTitle', "Clients");
			$scope.$emit('getHeader', true);
			$scope.$emit('getSidebar', true);
			$scope.$emit('getFooter', true);
			$scope.$emit('titleSection', true);
			/** fetching Clients **/
			$scope.sorting = {
				attribute: 'createdDate',
				direction: 'desc'
			};
			$scope.page = 0;
			$scope.per_page = 10;
			$scope.getClientsView = function (page) {
				var action = API_PATH + "client_all";
				$scope.page = page;
				$scope.per_page = 10;
				$scope.indexer = eval($scope.page * $scope.per_page);
				$scope.paginationData = {};
				var header = localstorage.get('authToken');
				var params = {
					'action': action,
					'page': $scope.page,
					'size': $scope.per_page,
					'q': 'status:1,2',
					'sort': $scope.sorting.attribute + ',' + $scope.sorting.direction,
				};
				if ($scope.searchKey != undefined && $scope.searchKey != null) {
					params.q += ';clientName:' + $scope.searchKey + '~true';
				} else {
					$scope.searchKey = null;
				}
				httpServices.getRequest(API_URL, params).then(function (data) {
					if (data.status == 200 && !helperFactory.isEmpty(data)) {

						$scope.clientData = data.data;
						$scope.clientListData = data.data;
						$scope.totalRecords = data.count;
						pagination.setPagination($scope);

					} else {
						$scope.errorMsgLogin = '';
					}
				}).catch(function (error) {
					$scope.errorMsgLogin = 'Server error.';
				});
			}
			$scope.searchCLients = function ($event) {
				if ($event.keyCode == 13 && $scope.searchKey != null) {
					$scope.getClientsView(0);
				}
				if ($event.keyCode == 8) {
					$scope.getClientsView(0);
				}
			}
			$scope.getClientsView(0);
			$scope.getPagedData = function (page) {
				if (page < $scope.dx.length && page >= 0) {
					this.getClientsView(page);
				}
			}
			$scope.sortClientName = {
				attribute: 'clientName',
				dir: 'desc'
			};
			$scope.sortIndustry = {
				attribute: 'industry.industryName',
				dir: 'desc'
			};
			$scope.sortUserCount = {
				attribute: 'countUsers',
				dir: 'desc'
			};
			$scope.dir = 'desc';
			$scope.sortBy = function (sortingData) {
				var _dir = (sortingData.dir == 'desc') ? 'desc' : 'asc';
				$scope.sorting = {
					attribute: sortingData.attribute,
					direction: _dir
				}
				$scope.getClientsView(0);
				sortingData.dir = (sortingData.dir == 'desc') ? 'asc' : 'desc';
			}
			$scope.viewClientById = function (clientId, editMode = false) {
				sessionStorage.viewClient = clientId;
				if (editMode) {
					sessionStorage.editMode = true;
				}
			}
			/**
			 * @method set client ID to modal popup 
			 */
			$scope.deleteClientPopup = function (clientId) {
				$scope.deleteClient = clientId;
			}
			/**
			 * @method Delete client by ID
			 */
			$scope.deleteClientById = function (clientId) {
				var params = {
					'action': API_PATH + "client_delete_" + clientId + "_" + helperFactory.getLoggedInUserId()
				};
				httpServices.deleteRequest(API_URL + '/delete', params).then(function (data) {
					if (data.status == 200) {
						$scope.getClientsView(0);
						jQuery('.btn-cancel').click();
					} else {
						$scope.errorMsgLogin = '';
					}
				}).catch(function (error) {
					$scope.errorMsgLogin = 'Server error.';
				});
			}
			/**
			 * @method Update Cleint Status
			 */
			$scope.changeStatus = function (CleintID, statusValue) {
				var status = (statusValue == 1) ? 2 : 1;
				var params = {
					'action': API_PATH + 'client_status_' + CleintID + '_' + status + '_' + helperFactory.getLoggedInUserId()
				};
				httpServices.postRequest(API_URL + '/put', params).then(function (data) {
					if (data.status == 200) { } else {
						$scope.errorMsgLogin = '';
					}
				}).catch(function (error) {
					$scope.errorMsgLogin = 'Server error.';
				});
			}


		}).controller('createBrandController', function (Upload, $window, $scope, $stateParams, $location, localstorage, helperFactory, $state, httpServices, $timeout, formValidator, clientHelper, userHelper, outreachHelper, rolesHelper, menuFactory) {

			if (!helperFactory.isLoggedIn()) {
				$state.go('login');
				return false;
			}

			$scope.addedBrands = [];
			$scope.newBrandInfo = {};
			$scope.canAddBrands = rolesHelper.canCreate('MANAGE_BRAND');
			if (!$scope.canAddBrands) {
				$state.go('summary');
			}

			$scope.$emit('pageTitle', "Create Brand");
			$scope.$emit('menuItem', menuFactory.getMenuItems($scope));
			$scope.$emit('getHeader', true);
			$scope.$emit('getSidebar', true);
			$scope.$emit('getFooter', true);
			$scope.$emit('titleSection', true);
			var header = localstorage.get('authToken');
			$scope.changeMySrc = function () {
				if (typeof $scope.newBrandInfo.file != 'undefined' && $scope.newBrandInfo.file != null) {
					if (helperFactory.getImageMessages($scope.newBrandInfo.file)) { } else {
						$scope.newBrandInfo.file = null;
					}
				}
			}
			$scope.extraSettings = SINGLE_CLIENT_DROPDOWN;
			if (userHelper.isAdmin()) {
				$scope.adminClientDropdown = true;
				outreachHelper.getClient($scope, httpServices, helperFactory, localstorage);
				$scope.selectedClient = [];
				$scope.clientBrand = false;
			} else {
				$scope.selectedClientId = localstorage.get('clientId');
				outreachHelper.fetchClientBrands($scope, $scope.selectedClientId);
				$scope.clientBrand = true;
			}
			$scope.changeClient = function (data) {
				$scope.clientBrand = true;
			}
			/*On unchecked client*/
			$scope.onDeselectClient = function (data) {
				$scope.clientBrand = false;
			}
			/*On unchecked client*/
			$scope.newBrandInfo = {};
			$scope.addBrand = function () {
				if (!$scope.clientBrand || typeof $scope.newBrandInfo.name == 'undefined') {
					jQuery('#selectBrand').parent().addClass();
					if (!jQuery('#selectBrand').parent().find('label.has-error').length) {
						jQuery('#selectBrand').parent().append('<label class="control-label has-error validationMessage"><i class="fa fa-times"></i> Required</label>');
					}
					jQuery('#selectBrand').focus();
					return false;

				} else {
					jQuery('#selectBrand').parent().removeClass('has-error');
					jQuery('#selectBrand').parent().find('label.has-error').remove()
				}
				if ($scope.newBrandInfo && !(angular.equals({}, $scope.newBrandInfo))) {
					if ($scope.newBrandInfo.file && $scope.newBrandInfo.file != null) {
						var reader = new FileReader();
						reader.onload = function (e) {
							$scope.$apply(function () {
								$scope.newBrandInfo.fileSrc = reader.result;
								$scope.addedBrands.push($scope.newBrandInfo);
								$scope.newBrandInfo = {};
							});
						}
						reader.readAsDataURL($scope.newBrandInfo.file);
					} else {
						$scope.newBrandInfo.fileSrc = "assets/images/dummy-logo.jpg";
						$scope.addedBrands.push($scope.newBrandInfo);
						$scope.newBrandInfo = null;
					}
				}
			}
			$scope.removeBrand = function (index) {
				$scope.addedBrands.splice(index, 1);
			}
			var timeOut;
			$scope.selectClientBrand = function (event, clientName) {
				if (clientName != undefined && clientName.length > 0) {
					$timeout.cancel(timeOut);
					timeOut = $timeout(function () {
						var paramsClient = {
							'action': API_PATH + "client_all",
							'q': 'status:1,2;clientName:' + clientName + '~true',
						};
						httpServices.getRequest(API_URL, paramsClient).then(function (data) {
							if (data.status == 200 && data.data.length > 0) {
								$scope.existingClient = data.data;
							} else {
								$scope.errorMsgLogin = '';
							}
						}).catch(function (error) {
							$scope.errorMsgLogin = 'Server error.';
						});
					}, 1000);
				} else {
					$scope.existingClient = null;
				}
			}
			$scope.selectedClientInBrand = function (value) {
				$scope.clientBrand = value;
				$scope.existingClient = null;
			}
			/**
			 * @method save Brand 
			 */
			$scope.createNewBrand = function (createBrandForm) {
				if (createBrandForm.$valid) {
					var c = 0;
					angular.forEach($scope.addedBrands, function (brand) {
						c++;
						/* saveing brandData */
						clientHelper.saveBrand($scope, httpServices, helperFactory, Upload, $state, brand);
					});
					if ($scope.addedBrands.length == c) { }
				}
			}
			/**Form Validation Rules **/
			$scope.formValidator = formValidator;
			$scope.brandListValidator = function (inptVal) {
				return formValidator.brandValidator($scope.addedBrands.length);
			}

		}).controller('viewClientController', function (Upload, $scope, $stateParams, $location, localstorage, helperFactory, $state, rolesHelper, userHelper, httpServices, clientHelper, formValidator, $timeout, $window, $http, menuFactory) {
			if (!helperFactory.isLoggedIn()) {
				$state.go('login');
				return false;
			}
			
			$scope.addLocalTimeStamp = -((new Date()).getTimezoneOffset() * 60 * 1000);
			
			if (!sessionStorage.viewClient || typeof sessionStorage.viewClient == 'undefined' || sessionStorage.viewClient == 'undefined') {
				$state.go('client');
			}
			$scope.viewClient = sessionStorage.viewClient;

			$scope.editMode = false;
			$scope.$emit('pageTitle', "View Client");
			$scope.$emit('menuItem', menuFactory.getMenuItems($scope));
			$scope.configScroll = SCROLL_CONFIG;
			$scope.showClientButtons = false;
			$scope.editingClient = false;
			$scope.$emit('getHeader', true);
			$scope.$emit('getSidebar', true);
			$scope.$emit('getFooter', true);
			$scope.$emit('titleSection', true);
			$scope.clientinfoTab = 'modules/client/includes/clientinfo.html';
			$scope.brandsTab = 'modules/client/includes/brandsTab.html';
			$scope.usersTab = 'modules/client/includes/usersTab.html';
			$scope.teamsTab = 'modules/client/includes/teamsTab.html';

			$scope.canViewUsers = rolesHelper.canView('GET_USER_BY_CLIENT');
			$scope.canAddUsers = rolesHelper.canCreate('MANAGE_USER') && rolesHelper.canView('FETCH_ALL_SECURITY_GROUP');
			$scope.canViewBrands = rolesHelper.canView('GET_BRAND_FOR_CLIENT');
			$scope.canAddBrands = rolesHelper.canCreate('MANAGE_BRAND');
			$scope.canDeleteBrands = rolesHelper.canDelete('MANAGE_BRAND') || rolesHelper.canDelete('DELETE_BRAND_BY_ID');
			$scope.canViewHandles = rolesHelper.canView('GET_SOCIAL_HANDLER_BY_CLIENT');
			$scope.canManageHandles = rolesHelper.canCreate('MANAGE_SOCIAL_HANDLER');
			$scope.canViewTeam = rolesHelper.canView('FETCH_TEAMS_BY_CLIENT');
			$scope.canDeleteTeam = rolesHelper.canDelete('DELETE_TEAM_BY_ID');
			$scope.canAddTeam = rolesHelper.canCreate('MANAGE_TEAM') && rolesHelper.canView('FETCH_ALL_APPROVERS_BY_CLIENT') && rolesHelper.canView('GET_USER_BY_CLIENT');
			$scope.showEditButton = rolesHelper.canEdit('MANAGE_CLIENT');
			$scope.showSaveButton = rolesHelper.canEdit('MANAGE_CLIENT');

			$scope.isAdmin = false;


			$scope.clientData = {};
			$scope.clientData.competitiorsDefinitions = [{
				'handle': null,
				'name': null,
				'keyword': null
			}];
			$scope.helperFactory = helperFactory;
			$scope.addMoreCompetitors = function () {
				$scope.clientData.competitiorsDefinitions.push({
					'handle': null,
					'name': null,
					'keyword': null
				});
				return false;
			}

			if (userHelper.isAdmin()) {
				$scope.isAdmin = true;
			}
			/**
			 * call client helper methods
			 */
			$scope.clientData = {};
			clientHelper.getLicenceTypeData($scope, httpServices, helperFactory);
			clientHelper.getIndustriesData($scope, httpServices, helperFactory);
			clientHelper.getSegmentsByIndustry($scope, httpServices, helperFactory);
			clientHelper.getSubSegmentsByIndustry($scope, httpServices, helperFactory);
			$scope.helperFactory = helperFactory;
			$scope.clientBrands = null;
			$scope.redirectWebUrl = function (url) {
				var httpString = 'http://',
					httpsString = 'https://';
				if (url.substr(0, httpString.length) !== httpString && url.substr(0, httpsString.length) !== httpsString) {
					url = httpString + url;
				}
				$window.open(url, '_blank');
			};

			$scope.deleteRecord = function (data) {
				$scope.recordData = data;
			}
			$scope.deleteUserRecord = function (data) {
				$scope.userRecordData = data;
			}
			$scope.deleteHandleRecord = function (data) {
				$scope.handleRecordData = data;
			}
			$scope.deleteActionData = function ($id) {
				if ($id) {
					var params = {
						'action': API_PATH + "brand_delete_" + $id + "_" + helperFactory.getLoggedInUserId()
					};
					httpServices.deleteRequest(API_URL + '/delete', params).then(function (data) {
						if (data.status == 200) {
							$scope.getBrandsById($scope.viewClient);
							helperFactory.successMessage(data.message);
							jQuery('.btn-cancel').click();
						} else {
							$scope.errorMsgLogin = '';
						}
					}).catch(function (error) {
						$scope.errorMsgLogin = 'Server error.';
					});
				}
			}
			$scope.deleteBrandById = function ($id) {
				if ($id) {
					var params = {
						'action': API_PATH + "brand_delete_" + $id + "_" + helperFactory.getLoggedInUserId()
					};
					httpServices.deleteRequest(API_URL + '/delete', params).then(function (data) {
						if (data.status == 200) {
							$scope.getBrandsById($scope.viewClient);
							helperFactory.successMessage(data.message);
						} else {
							$scope.errorMsgLogin = '';
						}
					}).catch(function (error) {
						$scope.errorMsgLogin = 'Server error.';
					});
				}
			}
			/**
			 * create brand for this client
			 */
			$scope.brandObject = {};
			$scope.saveBrand = function (formName) {
				if (!jQuery('#addClientBox').val() || jQuery('#addClientBox').val() == null || jQuery('#addClientBox').val() == '') {
					jQuery('#addClientBox').parent().addClass('has-error');
					if (!jQuery('#addClientBox').parent().find('label.has-error').length) {
						jQuery('#addClientBox').parent().append('<label class="control-label has-error validationMessage"><i class="fa fa-times"></i> Required</label>');
					}
					return false;
				} else {
					jQuery('#addClientBox').parent().removeClass('has-error');
					jQuery('#addClientBox').parent().find('label.has-error').remove();
				}
				var formData = {
					'name': $scope.brandObject.editClientBrand.name,
					'clientName': $scope.clientData.clientName,
					'clientId': $scope.viewClient,
					"status": 1,
					"createdBy": helperFactory.getLoggedInUserId(),
					"updatedBy": helperFactory.getLoggedInUserId()
				};
				if ($scope.brandObject.editClientBrand.logo && $scope.brandObject.editClientBrand.logo != null) {
					Upload.upload({
						url: API_URL + '/image',
						data: {
							file: $scope.brandObject.editClientBrand.logo
						}
					}).then(function (resp) {
						var params = {
							'action': API_PATH + "brand",
							'rawBody': formData,
							'rawBodyKey': 'brand',
							'fileKey': 'logo',
							"file": resp.data.upload_file_name
						};
						clientHelper.saveBrandData(params, $scope, helperFactory, httpServices);
						$scope.getBrandsById($scope.viewClient);
					})
				} else {
					var params = {
						'action': API_PATH + "brand",
						'rawBody': formData,
						'rawBodyKey': 'brand',
						'fileKey': 'logo',
						'file': null
					};
					clientHelper.saveBrandData(params, $scope, helperFactory, httpServices);
					$scope.getBrandsById($scope.viewClient);
				}

			}

			$scope.getClientInfo = function () {
				$scope.editMode = false;
				if (rolesHelper.canEdit('MANAGE_CLIENT')) {
					$scope.showEditButton = true;
					$scope.showSaveButton = true;
				} else {
					$scope.showEditButton = false;
					$scope.showSaveButton = false;
				}
			}
			/**
			 * @method get Brands for client
			 */

			$scope.getBrands = function () {
				$scope.editMode = false;
				$scope.showSaveButton = false;
				if (rolesHelper.canCreate('MANAGE_BRAND') || rolesHelper.canDelete('DELETE_BRAND_BY_ID')) {
					$scope.showEditButton = true;
				} else {
					$scope.showEditButton = false;
				}
				clientHelper.getBrandsDataById($scope, httpServices, helperFactory);
				$scope.getBrandsById($scope.viewClient);
			}
			/**
			 * @method get teams for client
			 */
			$scope.getTeams = function (remainIneditMode = false) {
				if (!remainIneditMode) {
					$scope.editMode = false;
				}
				$scope.showSaveButton = false;
				if (rolesHelper.canDelete('DELETE_TEAM_BY_ID')) {
					$scope.showEditButton = true;
				} else {
					$scope.showEditButton = false;
				}
				clientHelper.getTeamByClientId($scope);
			}
			$scope.deleteUserById = function ($id) {
				if ($id) {
					var formData = {};
					var params = {
						'action': API_PATH + "user_delete_" + $id + "_" + helperFactory.getLoggedInUserId(),
						'rawBody': formData,
						'rawBodyKey': ''
					};
					httpServices.deleteRequest(API_URL + '/delete', params).then(function (data) {
						if (data.status == 200) {
							$scope.noContent = '';
							var action = API_PATH + 'user_client_' + $scope.viewClient;
							var params = {
								'action': action,
								'q': 'status:1,2',
								'page': 0,
								'size': 9
							};
							httpServices.getRequest(API_URL, params).then(function (response) {
								if (response.status == 200) {
									$scope.getUsersByClientId(true);
									helperFactory.successMessage(data.message);
									jQuery('.btn-cancel').click();
								}
							}).catch(function (error) {
								$scope.errorMsgLogin = 'Server error.';
							});
						} else {
							$scope.errorMsgLogin = '';
						}
					}).catch(function (error) {
						$scope.errorMsgLogin = 'Server error.';
					});
				}
			}
			$scope.minDate = new Date().toDateString();
			var action = API_PATH + "client_login_" + $scope.viewClient + '_client';
			var header = localstorage.get('authToken');
			var params = {
				'action': action
			};
			/**
			 * @method redirect to edit client
			 */
			$scope.editclientById = function ($id) {

				sessionStorage.viewClient = $id;
				$scope.editMode = true;
				$scope.$emit('pageTitle', "Edit Client");
				if (typeof $scope.clientData.industry != 'undefined') {
					$scope.segmentsData = $scope.getSegments($scope.clientData.industry.id);
				}
				if (typeof $scope.clientData.segment != 'undefined') {
					$scope.subSegmentsData = $scope.getSubSegments($scope.clientData.segment.id);
				}

			}
			$scope.changeToViewMode = function () {
				$scope.editMode = false;
				$scope.$emit('pageTitle', "View Client");
			}
			$scope.helperFactory = helperFactory;
			/************* fetch client data ************/
			if (typeof sessionStorage.editMode != 'undefined' && sessionStorage.editMode) {
				$scope.editMode = true;
				$scope.$emit('pageTitle', "Edit Client");
				sessionStorage.removeItem('editMode');
			}
			clientHelper.fetchClientData($scope, httpServices, API_URL, params, helperFactory);
			/**
			 * @method toggle image browse button
			 */
			$scope.opeFileManager = function () {
				jQuery('#profile-img').click();
			}
			/**
			 * @method image preview
			 */
			$scope.changeMySrc = function () {
				if (typeof $scope.userProfileFile != 'undefined' && $scope.userProfileFile != null) {
					if (helperFactory.getImageMessages($scope.userProfileFile)) {
						$scope.clientImage = $scope.userProfileFile.$ngfBlobUrl;
					} else {
						$scope.userProfileFile = null;
					}
				}
			}
			/* click on user tab fetch user for this client */
			$scope.extraMultiSettings = MULTIPLE_DROPDOWN_SETTING;
			$scope.extraSingleSettings = SINGLE_CLIENT_DROPDOWN;
			$scope.checkFileSize = function () {
				if (typeof $scope.brandObject.editClientBrand.logo != 'undefined' && $scope.brandObject.editClientBrand.logo != null) {
					if (helperFactory.getImageMessages($scope.brandObject.editClientBrand.logo)) {

					} else {
						$scope.brandObject.editClientBrand.logo = null;
					}
				}
			}
			$scope.getUsersByClientId = function (remainIneditMode = false) {
				if (!remainIneditMode) {
					$scope.editMode = false;
				}
				$scope.showSaveButton = false;
				if (rolesHelper.canDelete('DELETE_USER_BY_ID')) {
					$scope.showEditButton = true;
				}
				$scope.noContent = '';
				var action = API_PATH + 'user_client_' + $scope.viewClient;
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
			}
			$scope.clickOnSave = function () {
				jQuery('#saveButton').click();
			}
			$scope.formValidator = formValidator;
			/**
			 * @method save Client data
			 */
			$scope.saveCLientByData = function (formName) {

				if (!formName.$valid) {
					return false;
				}
				var formData = $scope.clientData;
				formData.subscriptionStartDate = helperFactory.getUTCTimeStamp(formData.startDateString);
				formData.subscriptionEndDate = helperFactory.getUTCTimeStamp(formData.endDateString);
				if ($scope.clientData.competitiorsDefinitions.length > 0) {
					var competitiorsData = [];
					var competitiorsClone = $scope.clientData.competitiorsDefinitions;
					angular.forEach(competitiorsClone, function (val, key) {
						var keys = [];
						var hnds = {};
						angular.forEach(val.keyword, function (v, k) {
							keys.push(v.text);
						});
						val.keywords = keys;
						angular.forEach(val.handle, function (hand, hk) {
							var hands = [];
							angular.forEach(hand, function (v, k) {
								hands.push(v.text);
							});
							hnds[hk] = hands;
						});
						val.keywords = keys;
						val.handles = hnds;
						competitiorsData.push(val);
					});
					//formData.competitiorsData = competitiorsData;
					angular.forEach(competitiorsData, function (value, key) {
						delete value.handle;
						delete value.keyword;
					});
					formData.competitiorsDefinitions = competitiorsData;
				}


				action = API_PATH + "client_" + $scope.viewClient;
				params = {
					'action': action,
					'rawBody': formData,
					"rawBodyKey": "client",
					"fileKey": 'logo',
					"file": null
				}

				if (formData.noOfBrands < localstorage.get('activeClientBrands') && formData.noOfUsers < localstorage.get('activeClientUsers')) {
					helperFactory.errorMessage("No of users & brands can not be less from current value.");
				} else if (formData.noOfBrands < localstorage.get('activeClientBrands')) {
					helperFactory.errorMessage("No of brands should not be less than " + localstorage.get('activeClientBrands'));
				} else if (formData.noOfUsers < localstorage.get('activeClientUsers')) {
					helperFactory.errorMessage("No of users should not be less than " + localstorage.get('activeClientUsers'));
				} else {
					if (typeof $scope.userProfileFile != 'undefined' && $scope.userProfileFile != null) {

						Upload.upload({
							url: API_URL + '/image',
							data: {
								file: $scope.userProfileFile
							}
						}).then(function (resp) {
							params = {
								'action': action,
								'rawBody': formData,
								"rawBodyKey": "client",
								"fileKey": "logo",
								"file": resp.data.upload_file_name
							}
							clientHelper.updateCLientData($scope, helperFactory, httpServices, params);
						});
					} else {
						clientHelper.updateCLientData($scope, helperFactory, httpServices, params);
					}
					$scope.editMode = false;
				}



				$scope.$emit('pageTitle', "View Client");
			}
			/**
			 * @method Auth Twitter
			 */
			$scope.authTwitter = function () {
				var _params = {};
				httpServices.twitterPostRequest(API_URL + '/twitter', _params).then(function (data) {
					if (data.status == 200 && !helperFactory.isEmpty(data.data)) {
						$scope.twitterAuthToken = data.data;
						sessionStorage.twitter_req_token = JSON.stringify(data.data);
						window.location.href = $scope.twitterAuthToken.url;
					} else { }
				}).catch(function (error) {
					$scope.errorMsgLogin = 'Server error.';
				});
			}

			$scope.getAccess = function () {
				$scope.oauth_verifier = helperFactory.getParameterByName();
				if (!helperFactory.isEmpty($scope.oauth_verifier.oauth_verifier)) {
					var _params = {
						'action': 'https://api.twitter.com/oauth/access_token',
						'data': {
							newData: $scope.oauth_verifier,
							prevData: sessionStorage.twitter_req_token
						},
					};
					httpServices.twitterAccessPostRequest(API_URL + '/twitter/access', _params).then(function (data) {
						if (data.status == 200 && !helperFactory.isEmpty(data.data)) {
							helperFactory.successMessage('Handler Saved Successfully');
							$timeout(function () {
								window.location.href = BASE_URL + '#!/viewClient';
							}, 1000);
							clientHelper.saveHandler(data.data, $scope, helperFactory, httpServices);
						} else {

						}
					}).catch(function (error) {
						$scope.errorMsgLogin = 'Server error.';
					});
				}
			}

			$scope.getAccess();
			$scope.getHandles = function (remainIneditMode = false) {
				if (!remainIneditMode) {
					$scope.editMode = false;
				}
				$scope.showSaveButton = false;
				$scope.showEditButton = rolesHelper.canDelete('MANAGE_SOCIAL_HANDLER');
				clientHelper.getHandlesByClientId($scope, helperFactory, httpServices)
			}
			$scope.deleteHandleId = function ($id) {
				var params = {
					'action': API_PATH + "social-handler_delete_" + $id + "_" + helperFactory.getLoggedInUserId()
				};
				httpServices.deleteRequest(API_URL + '/delete', params).then(function (data) {
					if (data.status == 200) {
						helperFactory.successMessage(data.message);
						jQuery('.btn-cancel').click();
						$scope.getHandles(true);
					} else {
						helperFactory.errorMessage(data.message);
					}
				}).catch(function (error) { })
			}
			/**
			 * @method get All roles
			 */
			$scope.getAllRoles = function () {
				//console.log($scope.clientUsersData.length);
				var userAdded = $scope.clientUsersData.length;
				var userLimit = localstorage.get('activeClientUsers');
				
				if(userAdded<userLimit){
						var paramsRole = {
							'action': API_PATH + "security-group_fetchAllActive",
							'q': 'status:1'
						};

						httpServices.getRequest(API_URL, paramsRole).then(function (data) {
							if (data.status == 200 && data.data && data.data.length > 0) {
								$scope.existRoles = data.data;
								$('#addUserModal').modal('show');
							} else {
								$scope.errorMsgLogin = '';
							}
						}).catch(function (error) {
							$scope.errorMsgLogin = 'Server error.';
						});
				}else{
					alert("You can not add more than "+userLimit+ " user.");
				}
			
			}
			$scope.user = {};
			$scope.userd = {};
			$scope.resetFormData = false;
			/**
			 * @method save User for Client
			 */
			$scope.saveUser = function (formName, reset = false) {
				if (!formName.$valid) {
					return false;
				}
				if (reset) {
					$scope.resetFormData = true;
				}
				var formData = $scope.user;
				formData.clientId = $scope.viewClient;
				formData.createdBy = helperFactory.getLoggedInUserId(),
					formData.updatedBy = helperFactory.getLoggedInUserId(),
					formData.clientId = $scope.viewClient;
				formData.status = 1;
				var x = [];
				var y = [];
				formData.clientName = $scope.clientData.clientName;
				formData.rePassword = $scope.user.password;
				formData.securityGroups = [$scope.userd.securityGroups];
				x.push(formData);
				var action = API_PATH + "user";
				var params = {
					'action': action,
					'rawBody': x,
					'rawBodyKey': 'user',
					'fileKey': 'logo',
					"file": null
				};
				httpServices.postMediaRequest(API_URL + '/media', params).then(function (data) {
					if (data.status == 200) {
						helperFactory.successMessage(data.message);
						if ($scope.resetFormData) {
							$scope.user = {};
							$scope.resetFormData = false;
							formName.reset();
						} else {
							$scope.resetFormData = false;
							$scope.user = {};
							formName.reset();
							jQuery('.close').click();
						}
						$scope.getUsersByClientId()
					} else {
						helperFactory.errorMessage(data.message);
					}
				}).catch(function (error) {
					$scope.errorMsg = 'Server error.';
					helperFactory.errorMessage($scope.errorMsg);
				});

			}
			/**
			 * @method prepare team data
			 */
			$scope.prepareTeamData = function (formName) {
				formName.reset();
				$scope.approversForTeam = [];
				$scope.usersForTeam = [];
				clientHelper.getClientUsersData($scope);
				clientHelper.getApproversData($scope);
				$scope.teamRawData = {};
				$scope.teamRawData.selectedUsers = [];
				$scope.teamRawData.selectedApprovers = [];
				$scope.approversForTeam = [];
				$scope.usersForTeam = [];
				$scope.resetTeamFormData = false;
			}

			/**
			 * @method save team for Client
			 */
			$scope.saveTeam = function (formName, reset) {

				if (!formName.$valid) {
					return false;
				} else if ($scope.teamRawData.selectedUsers.length == 0) {
					$scope.selectedUserError = true;
					return false;
				} else if ($scope.teamRawData.selectedApprovers.length == 0) {
					$scope.selectedApproverError = true;
					return false;
				}

				if (reset) {
					$scope.resetTeamFormData = true;
				}
				var cap = [];
				var usl = [];
				angular.forEach($scope.teamRawData.selectedUsers, function (u) {
					usl.push(u.id);
				});
				angular.forEach($scope.teamRawData.selectedApprovers, function (u) {
					cap.push(u.id);
				});
				var formData = {
					'name': $scope.teamRawData.teamName,
					'clientId': $scope.viewClient,
					'usersList': usl,
					'createdBy': helperFactory.getLoggedInUserId(),
					'contentApproversList': cap,
					'status': 1

				};
				var action = API_PATH + "team";
				var params = {
					'action': action,
					'myparam': formData
				};
				httpServices.postRequest(API_URL, params).then(function (data) {
					if (data.status == 200) {
						helperFactory.successMessage(data.message);
						if ($scope.resetTeamFormData) {
							$scope.teamRawData = {};
							$scope.teamRawData.selectedUsers = [];
							$scope.teamRawData.selectedApprovers = [];
							$scope.resetTeamFormData = false;
							formName.reset();
							$scope.getTeams();
						} else {
							$scope.resetTeamFormData = false;
							$scope.teamRawData = {};
							$scope.teamRawData.selectedUsers = [];
							$scope.teamRawData.selectedApprovers = [];
							formName.reset();
							$scope.getTeams();
							jQuery('.close').click();
						}
					} else {
						helperFactory.errorMessage(data.message);
					}
				}).catch(function (error) {
					helperFactory.errorMessage($scope.errorMsg);
				});
			}
			/**
			 * @method set Delete Team ID
			 */
			$scope.deleteTeamId = null;
			$scope.setDeleteTeamId = function ($id) {
				$scope.deleteTeamId = $id;

			}
			$scope.resetTeamForm = function (formName) {

				formName.reset();
			}
			/**
			 * @method delete team data
			 */
			$scope.deleteClientTeamById = function ($id) {
				if ($id) {
					var formData = {};
					var params = {
						'action': API_PATH + "team_delete_" + $id + "_" + helperFactory.getLoggedInUserId(),
						'myparam': formData
					};
					httpServices.deleteRequest(API_URL + '/delete', params).then(function (data) {
						if (data.status == 200) {
							helperFactory.successMessage(data.message);
							jQuery('.btn-cancel').click();
							$scope.getTeams(true);
						} else {
							helperFactory.errorMessage(data.message);
						}
					}).catch(function (error) {
						$scope.errorMsg = 'Server error.';
						helperFactory.errorMessage($scope.errorMsg);
					});
				}
			}

			/*Initialize facebook Application*/
			clientHelper.initFB_App();
			$scope.loginResponse = undefined;
			$scope.accessToken = undefined;
			$scope.selectedHandlers = {};

			/**
			 * @method Authanticate Facebook
			 * @author Parag Vyas
			 */

			$scope.authFacebook = function () {
				$scope.selectedHandlers = {};

				FB.getLoginStatus(function (loginResponse) {
					if (loginResponse.status === 'connected') {
						FB.logout(function (response) {
							// user is now logged out
							FB.login(function (loginResponse) {
								$scope.refreshToken(loginResponse);
							});
						});
						//$scope.refreshToken(loginResponse);
					} else {


						FB.login(function (loginResponse) {
							$scope.refreshToken(loginResponse);
						});

					}
				});
			}

			/**
			 * @method Refresh Token Facebook
			 * @author Parag Vyas
			 */
			$scope.refreshToken = function (loginResponse) {

				var client_id = CLIENT_ID;
				var client_secret = CLIENT_SECRET;
				var grant_type = "fb_exchange_token";
				var fb_exchange_token = loginResponse.authResponse.accessToken;

				$http({
					method: "GET",
					url: "https://graph.facebook.com/oauth/access_token?client_id=" + client_id + "&client_secret=" + client_secret + "&grant_type=fb_exchange_token&fb_exchange_token=" + fb_exchange_token,
				}).then(function mySuccess(res) {
					$scope.getPageList(loginResponse, res.data.access_token);
				});
			}

			/**
			 * @method Get page list Facebook
			 * @author Parag Vyas
			 */
			$scope.getPageList = function (loginResponse, accessToken) {

				$http({
					method: "GET",
					url: "https://graph.facebook.com/me/accounts?fields=access_token,picture,name,category,perms&access_token=" + accessToken
				}).then(function mySuccess(res) {
					if (res.data.data.length > 0) {
						$scope.pageListData = res.data.data;
					} else {
						$scope.pageListDataError = "Sorry! No handlers found for this account.";
						FB.logout(function (response) {
							// user is now logged out
						});
					}
					$('#pageListModel').modal('show');
					$scope.loginResponse = loginResponse;
					$scope.accessToken = accessToken;
				});

			}

			$scope.saveFBHandlers = function () {

				$scope.selectedFBHandlers = [];
				angular.forEach($scope.pageListData, function (val, key) {
					angular.forEach($scope.selectedHandlers, function (hand, ind) {
						if (ind == val.id && hand) {
							$scope.selectedFBHandlers.push(val);
						}
					});
				});

				if ($scope.loginResponse != undefined && $scope.accessToken != undefined && $scope.selectedFBHandlers.length > 0) {
					clientHelper.saveFacebookHandlers($scope, helperFactory, httpServices);
				}
			}
			/**Add team from error*/
			$scope.selectedUserError = false;
			$scope.selectedApproverError = false;
			$scope.changeUsers = function () {
				$scope.selectedUserError = false;
			}
			$scope.onDeselectUsers = function () {
				$scope.selectedUserError = false;
			}
			$scope.changeApprovers = function () {
				$scope.selectedApproverError = false;
			}
			$scope.onDeselectApprovers = function () {
				$scope.selectedApproverError = false;
			}

			/**
			 * @author: Anjani
			 * @desc: Add platform details for competitors data
			 */

			$scope.platformData = localstorage.getObject('platformObj');


			$scope.loggedInUser = localstorage.get('LoginUser');

		});




});