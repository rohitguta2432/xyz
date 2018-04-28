/**
 * Helper Methods
 * @access global
 * @author Gaurav Sirauthiya
 * @since March 25, 2017
 * @version 1.0.0
 */
define([
	'angular',
	'angularRoute',
	'jquery',
	'userHelper'
], function (angular, angularRoute) {
	angular.module('socioApp.helperFactory', ['socioApp.user.userHelper'])
		.factory('helperFactory', function (localstorage, $location, httpServices, $timeout, $q) {
			var helper = {};
			helper.isMediaExist = function (src) {
				var deferred = $q.defer();
				var image = new Image();
				image.onerror = function () {
					deferred.resolve(false);
				};
				image.onload = function () {
					deferred.resolve(true);
				};
				image.src = src;
				return deferred.promise;
			}
			/**
			 * @method number format
			 */
			helper.numberFormatter = function (num, digits = 1) {
				var si = [{
					value: 1E18,
					symbol: "E"
				},
				{
					value: 1E15,
					symbol: "P"
				},
				{
					value: 1E12,
					symbol: "T"
				},
				{
					value: 1E9,
					symbol: "G"
				},
				{
					value: 1E6,
					symbol: "M"
				},
				{
					value: 1E3,
					symbol: "k"
				}
				],
					rx = /\.0+$|(\.[0-9]*[1-9])0+$/,
					i;
				for (i = 0; i < si.length; i++) {
					if (num >= si[i].value) {
						return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
					}
				}
				return num.toFixed(digits).replace(rx, "$1");
			}
			/**
			 * @method convert date to UTC string
			 */
			helper.converDateToUTC = function (date) {
				return date.toUTCString();
			}
			/**
			 * @method get first and last day
			 */
			helper.getFirstLstDate = function () {
				var dateObj = {};
				var date = new Date();
				dateObj.firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
				dateObj.lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
				return dateObj;
			}
			/**
			 * @method check user logged in
			 */
			helper.isLoggedIn = function () {
				if (typeof localstorage.get('logged_in') != 'undefined' && localstorage.get('logged_in') != '' && localstorage.get('logged_in') != 'false') {
					return true;
				}
			}
			/**
			 * @method check key exists in localstorage
			 */
			helper.checkKeysExists = function (key) {
				if (typeof localstorage.get(key) != 'undefined' && localstorage.get(key) != '' && localstorage.get(key) != 'false') {
					return true;
				}
			}
			/**
			 * @return get logged in user Id
			 */
			helper.getLoggedInUserId = function () {
				if (this.checkKeysExists('userId')) {
					return localstorage.get('userId')
				}
			}
			/**
			 * @return logged in  user's client Id
			 */
			helper.getLoggedInUserClientId = function () {
				if (this.checkKeysExists('clientId')) {
					return localstorage.get('clientId')
				}
			}

			/**
			 * @method Get CurrentTimeStamp 
			 */
			helper.getCurrentTimeStamp = function () {
				var foo = new Date;
				var unixtime_ms = foo.getTime();
				return parseInt(unixtime_ms / 1000);
			}
			/**
			 * @method get day from timestamp
			 */
			helper.getDayFromDate = function (timeStamp) {
				var a = new Date(timeStamp);
				var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
				var dayOfWeek = days[a.getDay()];
				return dayOfWeek;
			}
			/**
			 * @method Get Image upload error messages messages
			 */
			helper.getImageMessages = function (file, ht = false, wd = false, sz = false) {
				var height = (ht) ? ht : 1200;
				var width = (wd) ? wd : 1600;
				var size = (sz) ? sz : 2;
				var sizeInKb = size * 1024 * 1024;

				if (file.type == 'image/jpeg' || file.type == 'image/png' || file.type == 'image/jpg' || file.type == 'image/gif') {
					if (file.size > sizeInKb) {
						this.errorMessage('Image should not be more than ' + size + 'MB');
						return false;
					} else if (file.$ngfHeight && file.$ngfHeight > height) {
						this.errorMessage('Image Height should be less than ' + height + 'px');
						return false;
					} else if (file.$ngfWidth && file.$ngfWidth > width) {
						this.errorMessage('Image width should be less than ' + width + 'px');
						return false;
					} else {
						return true;
					}
				} else {
					if (!file.$ngfWidth) {
						this.errorMessage('Only images (jpg/png/gif) are allowed');
						return false;
					} else {
						this.errorMessage('Only images (jpg/png/gif) are allowed');
					}

				}
			}
			/**
			 * @method Get Image upload error messages
			 */
			helper.getVideoMessages = function (file, sz = false) {
				var size = (sz) ? sz : 2;
				var sizeInKb = size * 1024 * 1024;
				if (file.size > sizeInKb) {
					this.errorMessage('Video should not be more than ' + size + 'MB');
					return false;
				} else {
					return true;
				}
			}
			/**
			 * @method get Url Params
			 */
			helper.getParameterByName = function () {
				var query_string = {};
				var query = window.location.search.substring(1);
				var vars = query.split("&");
				for (var i = 0; i < vars.length; i++) {
					var pair = vars[i].split("=");
					if (typeof query_string[pair[0]] === "undefined") {
						query_string[pair[0]] = decodeURIComponent(pair[1]);
					} else if (typeof query_string[pair[0]] === "string") {
						var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
						query_string[pair[0]] = arr;
					} else {
						query_string[pair[0]].push(decodeURIComponent(pair[1]));
					}
				}
				return query_string;
			}

			/**
			 * @method auth token
			 */
			helper.getAuthToken = function () {
				if (this.checkKeysExists('authToken')) {
					return localstorage.get('authToken')
				}
			}
			/**
			 * @method check not empty object
			 */
			helper.isEmpty = function (obj) {
				for (var key in obj) {
					if (obj.hasOwnProperty(key))
						return false;
				}
				return true;
			}

			/**
			 * @method convert date to time Stamp
			 */

			helper.convertToTimeStamp = function (dateString) {
				if (typeof dateString != 'undefined') {
					var y = dateString.split('/');
					var u = y[1] + '/' + y[0] + '/' + y[2];
					return Date.parse(u);
				}
			}
			/**
			 * @method get timestamp from date string
			 */
			helper.getTimeStamp = function (dateString) {
				if (typeof dateString != 'undefined') {
					return Date.parse(dateString);
				}
			}
			/**
			 * @method get day value
			 */
			helper.getDateValue = function (dayDifference) {
				var today = new Date();
				today.setDate(today.getDate() + dayDifference);
				var dd = today.getDate();
				var mm = today.getMonth() + 1;

				var yyyy = today.getFullYear();
				if (dd < 10) {
					dd = '0' + dd;
				}
				if (mm < 10) {
					mm = '0' + mm;
				}
				var dateIs = dd + '/' + mm + '/' + yyyy;
				return dateIs;
			}
			/**
			 * @method convert  time Stamp to date 
			 */
			helper.formatDate = function (dateString, format = 'dd/MM/yyyy') {
				if (typeof dateString != 'undefined') {
					var d = new Date(dateString);
					var month = ("0" + (d.getMonth() + 1)).slice(-2)
					var day = ("0" + d.getDate()).slice(-2);
					var year = d.getFullYear();
					var sep = '/';
					if (format == 'monthName') {
						month = this.getMonthName((d.getMonth())) + ',';
						sep = ' ';
					} else if (format == 'fullMonthName') {
						month = this.getMonthName((d.getMonth()), true) + ',';
						sep = ' ';
					}
					var convertedDate = day + sep + month + sep + year;
					return convertedDate;
				}
			}
			/**
			 * @month array
			 */
			helper.getMonthName = function ($month, $full = false) {
				var fullMonths = ["January", "February", "March", "April", "May", "June",
					"July", "August", "September", "October", "November", "December"
				];

				var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
					"Jul", "August", "September", "October", "November", "December"
				];

				if ($full) {
					return fullMonths[$month];
				}
				return monthNames[$month]
			}

			/**
			 * @method show success message 
			 */
			helper.successMessage = function (message) {
				jQuery('#successMessage').removeClass('fadeOutUp').addClass('fadeInDown');
				jQuery('#successMessage .success').html(message);
				jQuery('#successMessage .error').hide();
				jQuery('#successMessage .success').fadeIn();
				$timeout(function () {
					jQuery('#successMessage').removeClass('fadeInDown').addClass('fadeOutUp');
				}, 2000);
			}
			/**
			 * @method show success message 
			 */
			helper.errorMessage = function (message) {
				jQuery('#successMessage').css({
					'height': 'auto'
				});
				jQuery('#successMessage').removeClass('fadeOutUp').addClass('fadeInDown');
				jQuery('#successMessage .error').html(message);
				jQuery('#successMessage .success').hide();
				jQuery('#successMessage .error').fadeIn();

				$timeout(function () {
					jQuery('#successMessage').removeClass('fadeInDown').addClass('fadeOutUp');
				}, 2000);
			}
			/**
			 * @method get time with am/pm 
			 */
			helper.getAmPmTime = function (date) {
				var hours = date.getHours();
				var minutes = date.getMinutes();
				var ampm = hours >= 12 ? 'pm' : 'am';
				hours = hours % 12;
				hours = hours ? hours : 12;
				minutes = minutes < 10 ? '0' + minutes : minutes;
				var strTime = hours + ':' + minutes + ' ' + ampm;
				return strTime;
			}
			helper.updateByLabelList = function (listData, propName) {
				angular.forEach(listData, function (data) {
					data.label = data[propName];
				})
			}
			/**
			 * @method parse URL's from string
			 */
			helper.linkify = function (inputText) {
				var replacedText, replacePattern1, replacePattern2, replacePattern3;
				/*URLs starting with http://, https://, or ftp://*/
				if (typeof inputText != 'undefined') {
					replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
					replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

					/*URLs starting with "www." (without // before it, or it'd re-link the ones done above).*/
					replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
					replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

					/*Change email addresses to mailto:: links.*/
					replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
					replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');
				}

				return replacedText;
			}

			return helper;
		}).filter('linkify', function () {
			return function (x) {
				return x.toUpperCase();
			}
		}).filter('toUrl', function () {
			return function (x) {
				return x.replace(/(https:\/\/[^\s]+)/gi, '<a target="_blank" href="$1">$1</a>');
			}
		}).filter('toTwitterData', function (helperFactory) {
			return function (x) {
				var ff = helperFactory.getTimeStamp(x);
				var y = new Date(ff);
				var tt = y.toUTCString();
				return ff;
			}
		}).filter('numberFormat', function (helperFactory) {
			return function (x, y = 1) {
				return helperFactory.numberFormatter(x, y);
			}
		}).filter('parseTagsTwitter', function (helperFactory) {
			return function (x) {
				if (typeof x != 'undefined') {
					var y = helperFactory.linkify(x);
					var t = y.replace(/(^|\s)#(\w+)/g, "$1<a class='hash_tags' target='_blank' href='https://twitter.com/search?q=%23$2'>#$2</a>");
					return t.replace(/(^|\s)@(\w+)/g, "$1<a class='hash_tags' target='_blank' href='https://twitter.com/search?q=%40$2'>@$2</a>");
				}
			}
		}).filter('parseTagsFacebook', function (helperFactory) {
			return function (x) {
				if (typeof x != 'undefined') {
					var y = helperFactory.linkify(x);
					return t = y.replace(/(^|\s)#(\w+)/g, "$1<a class='hash_tags' target='_blank' href='https://www.facebook.com/search/top/?q=%23$2'>#$2</a>");
				}
			}
		})
		/**
		 * Security group factory
		 * @author Parag Vyas
		 */
		.factory('securityGroups', function (localstorage, httpServices, $timeout, userHelper, helperFactory) {
			var helper = {};
			helper.clientUserAction = function ($scope) {
				var timeOut;
				$scope.selectedUsers = [];
				/**
				 * @method add users for team
				 */
				$scope.addTeamUser = function (event, userName) {
					var $clientId = localstorage.get('clientId');
					if (userHelper.isAdmin() && typeof $scope.obj != 'undefined' && $scope.obj != null && !helperFactory.isEmpty($scope.obj)) {
						$clientId = $scope.obj.teamClient.id;
					}
					if (userName != undefined && userName.length > 0) {
						$timeout.cancel(timeOut);
						timeOut = $timeout(function () {

							if ($scope.isAdmin) {
								var actionClientUser = API_PATH + "user_client_" + $clientId;
							} else {
								var actionClientUser = API_PATH + "user_client_" + $clientId;
							}

							var params = {
								'action': actionClientUser,
								'q': 'status:1; fullName:' + userName + '~true'

							};
							httpServices.getRequest(API_URL, params).then(function (data) {
								$scope.teamMembers = [];
								if (data.status == 200) {
									if (!data.data || data.data.length == 0) {
										$scope.noUserFound = "No user found";
									} else {
										$scope.noUserFound = "";
										if ($scope.selectedUsers && $scope.selectedUsers != null) {
											for (var i = 0; i < data.data.length; i++) {
												var isInArray = false;
												for (var j = 0; j < $scope.selectedUsers.length; j++) {
													if ($scope.selectedUsers[j].id == data.data[i].id) {
														isInArray = true;
													}
												}
												if (!isInArray) {
													$scope.teamMembers.push(data.data[i]);
												}

											}
										}
									}
								} else {
									$scope.errorMsgLogin = '';
								}

							}).catch(function (error) {
								$scope.errorMsgLogin = 'Server error.';
							});

						}, 1000);
					} else {
						$scope.teamMembers = null;
					}
				}
				/**
				 * @method add selected users to team object
				 */
				$scope.selectedUserInTeam = function (value) {
					$scope.selectedUsers.push(value);
					$scope.selectedUserIDs = $scope.selectedUsers;
					$scope.teamUserInput = null;
					$scope.teamMembers = null;
					$scope.teamApprover = null;
					$scope.selecetdApproverBy = null;
				}
				/**
				 * @method deselect users from team object
				 */
				$scope.deselectUserInTeam = function (value) {
					for (var i = 0; i < $scope.selectedUsers.length; i++) {
						if ($scope.selectedUsers[i].id == value.id) {
							$scope.selectedUsers.splice(i, 1);
							break;
						}
					}
					$scope.teamUserInput = null;
					$scope.teamMembers = null;
				}
			}
			/**
			 * @method selected audience action
			 */
			helper.selectAudienceAction = function ($scope, isEditCamp = false) {
				var timeOut;
				$scope.selectedAud = [];

				if (isEditCamp) {
					if ($scope.campaignViewdata.targetAudience && $scope.campaignViewdata.targetAudience[0] != null) {
						angular.forEach($scope.campaignViewdata.targetAudience, function (audience) {
							$scope.selectedAud.push(audience);
						})
					}
				}
				$scope.addAudInput = function (audName) {
					if (audName != undefined && audName.length > 0) {
						$timeout.cancel(timeOut);
						timeOut = $timeout(function () {
							var params = {
								'action': API_PATH + "audience-types_all",
								'q': 'name:' + audName + '~true'
							};
							httpServices.getRequest(API_URL, params).then(function (data) {
								$scope.totalAud = [];
								if (data.status == 200 && data.data && data.data.length > 0) {
									for (var i = 0; i < data.data.length; i++) {
										var isInArray = false;
										for (var j = 0; j < $scope.selectedAud.length; j++) {
											if ($scope.selectedAud[j].id == data.data[i].id) {
												isInArray = true;
											}
										}
										if (!isInArray) {
											$scope.totalAud.push(data.data[i]);
										}

									}
									$scope.editTargetAudience = null;

								} else {
									$scope.errorMsgLogin = '';
								}

							}).catch(function (error) {
								$scope.errorMsgLogin = 'Server error.';
							});
						}, 1000);
					} else {
						$scope.teamMembers = null;
					}
				}

				$scope.selectedAudience = function (aud) {
					$scope.selectedAud.push(aud);
					$scope.audInput = null;
					$scope.totalAud = null;
					$scope.errorAudiennce = "";
					$scope.editTargetAudience = null;

					$scope.audienceError = false;
					$scope.audienceErrorMsg = "";
					jQuery("#audienceData").removeClass('formErrorMsgCampBorer');
				}
				$scope.deselectAud = function (aud) {
					for (var i = 0; i < $scope.selectedAud.length; i++) {
						if ($scope.selectedAud[i].id == aud.id) {
							$scope.selectedAud.splice(i, 1);
							break;
						}
					}
					$scope.audInput = null;
					$scope.totalAud = null;
				}
			}

			function addNewBudgetList($scope) {
				var dataPush = {};
				var nameArr = [];
				var durationArr = [];
				angular.forEach($scope.selectedSocial, function (opt) {
					nameArr.push(opt);
				})
				dataPush.name = nameArr;
				dataPush.duration = ["Weekly", "Monthly"];
				$scope.selectedPlatformList.push(dataPush);
			}

			helper.budgetListAction = function ($scope, isEditCamp = false) {
				$scope.selectedPlatformList = [];
				$scope.updatePlatformAdd = function () {
					var nameArrUpdate = [];
					$timeout(function updateMake() {
						angular.forEach($scope.selectedSocial, function (opt, keyIndex) {
							nameArrUpdate.push(opt);
							if ($scope.selectedSocial.length == keyIndex + 1) {
								angular.forEach($scope.selectedPlatformList, function (platformList) {
									delete platformList.name;
									platformList.name = nameArrUpdate;
								})
							}
						})

					}, 300);

				}
				$scope.addNewListPlatform = function (init = false) {
					$scope.addPlatfromWarning = false;
					if (init) {
						if (helperFactory.isEmpty($scope.campaignViewdata.budgetList)) {
							addNewBudgetList($scope);
						} else {
							$scope.selectedPlatformList = [];
							angular.forEach($scope.campaignViewdata.budgetList, function (budget) {
								var dataPush = {};
								dataPush.name = [];
								dataPush.platform = budget.platform;
								dataPush.duration = ["Weekly", "Monthly"];
								dataPush.durability = budget.duration;
								dataPush.budget = budget.budget;
								dataPush.startDate = budget.startDate;
								dataPush.endDate = budget.endDate;
								$scope.selectedPlatformList.push(dataPush);
							})
						}
						$timeout(function updateList() {
							$scope.updatePlatformAdd();
						}, 300);
					} else if ($scope.selectedPlatformList.length < 4) {
						addNewBudgetList($scope);
					}

					/*if ($scope.selectedPlatformList[0].name.length == 0) {
						$scope.addBudgetError = "Please select platform";
						$scope.addPlatfromWarning = true;
					}*/

				}
				/**dELETE BUDGET ROWS* */
				$scope.deleteBudgetRow = function (index) {
					$scope.selectedPlatformList.splice(index, 1);
				}

			}

			helper.setOptionSocial = function (optionSocial) {
				angular.forEach(optionSocial, function (option, key) {
					switch (option.name.toLowerCase()) {
						case 'facebook':
							option.name = "Facebook";
							option.label = "Facebook";
							option.class = "facebook";
							option.href = "#facebook-post";
							break;
						case 'twitter':
							option.name = "Twitter";
							option.label = "Twitter";
							option.class = "twitter";
							option.href = "#twitter-post";
							break;
						case 'linkedin':
							option.name = "Linkedin";
							option.label = "Linkedin";
							option.class = "linkedin";
							option.href = "#linkedin-post";
							break;
						case 'youtube':
							option.name = "Youtube";
							option.label = "Youtube";
							option.class = "youtube";
							option.href = "#youtube-post";
							break;
					}

				})
			}

			helper.getSocialPlatformByName = function (platformName, optionSocial, platformScope) {
				angular.forEach(optionSocial, function (opt) {
					if (opt.name.toLowerCase() == platformName) {
						platformScope.push(opt);
					}
				})
			}

			helper.getIndexJSONArrayKey = function (jsonArray, key, value) {
				var arrLen = jsonArray.length;
				if (arrLen == 0) {
					return -1;
				}
				angular.forEach(jsonArray, function (jsonObj, keyObj) {
					if (jsonObj[key] == value) {
						return keyObj;
					}
					if (arrLen == keyObj + 1) {
						return -1;
					}
				})
			}

			helper.socialPlatformAction = function ($scope, isCampaignInit = false, postCall = false) {
				var mediaParam = {
					'action': API_PATH + "social-platforms_all"
				}
				httpServices.getRequest(API_URL, mediaParam).then(function (data) {

					if (data.status == 200 && data.data.length > 0) {
						$scope.optionSocial = data.data;
						helper.setOptionSocial($scope.optionSocial);
						if (isCampaignInit) {
							var socLength = isCampaignInit.length; /**platform list actually */
							angular.forEach(isCampaignInit, function (soc, keyIndex) {
								var keepGoing = true;
								angular.forEach($scope.optionSocial, function (socOpt) {
									if (keepGoing) {
										if (soc.id == socOpt.id) {
											keepGoing = false;
											$scope.selectedSocial.push(socOpt);
										}
									}
								})
								if (socLength == keyIndex + 1) {
									postCall.handleFromSocialClient($scope, true);
								}
							})
						}
					} else {
						$scope.errorMsgLogin = '';
					}
				}).catch(function (error) {
					$scope.errorMsgLogin = 'Server error.';
				});

			}

			helper.getAllRolesPermissions = function ($scope, roles = false, rolesAll = false) {
				var header = localstorage.get('authToken');
				var params = {
					'action': $scope.actionURL
				};

				if ($scope.viewMode == null) {
					$scope.viewCheckBoxValue = false;
					$scope.roleClass = "socio-table table-responsive";
				} else {
					$scope.viewCheckBoxValue = true;
					$scope.roleClass = "socio-table table-responsive readonly-table";
				}
				$scope.selectAll = [];
				if (helperFactory.isEmpty($scope.existRoleData) || $scope.existRoleData.length == 0) {
					httpServices.getRequest(API_URL, params).then(function (data) {
						if (data.status == 200) {
							if (roles) {
								if (rolesAll) {
									$scope.existRoleData = data.data;
								} else {
									$scope.existRoleData = data.data.roles;
								}
								roleDataAction($scope);
							} else {
								if (helperFactory.isEmpty($scope.isEditInit)) {
									$scope.assignedData = data.data.roles;
								}
								var params = {
									'action': API_PATH + "roles_all"
								};
								httpServices.getRequest(API_URL, params).then(function (roleData) {
									if (roleData.status == 200) {
										$scope.existRoleData = roleData.data;
										roleDataAction($scope, true);
									} else { }
								}).catch(function (error) { });
							}

						} else {
							$scope.errorMsgLogin = '';
						}
					}).catch(function (error) {
						$scope.errorMsgLogin = 'Server error.';
					});
				} else {
					var params = {
						'action': API_PATH + "roles_all"
					};
					httpServices.getRequest(API_URL, params).then(function (roleData) {
						if (roleData.status == 200) {
							/*$scope.rolesHeader = true;*/
							$scope.existRoleData = roleData.data;
							roleDataAction($scope, true);
						} else { }
					}).catch(function (error) { });
				}
			}

			function roleDataAction($scope, editViewInitialise = false) {
				for (var i = 0; i < $scope.existRoleData.length; i++) {
					$scope.existRoleData[i].isDisabled = true;
					$scope.existRoleData[i].checkAll = 0;
					$scope.rolePermissions = [{
						name: "POST",
						status: 0,
						isDisabled: true
					}, {
						name: "GET",
						status: 0,
						isDisabled: true
					}, {
						name: "PUT",
						status: 0,
						isDisabled: true
					}, {
						name: "DELETE",
						status: 0,
						isDisabled: true
					}];
					if ($scope.existRoleData[i].permissions.length == 4) {
						$scope.existRoleData[i].isDisabled = false;
					}
					angular.forEach($scope.existRoleData[i].permissions, function (perm) {
						angular.forEach($scope.rolePermissions, function (rp, rpKey) {
							if (perm === rp.name) {
								rp.isDisabled = false;
							}
						})
					})
					if (editViewInitialise) {
						if ($scope.assignedData.length > 0) {
							angular.forEach($scope.assignedData, function (assign, key) {
								if ($scope.existRoleData[i].name == assign.name) {
									var c = 0;
									var permsn = assign.permissions;
									for (var j = 0; j < $scope.rolePermissions.length; j++) {
										if (permsn.indexOf($scope.rolePermissions[j].name) != -1) {
											$scope.rolePermissions[j].status = 1;
											c++;
										} else {
											/*$scope.roleDataAction[j].isDisabled = true;*/
											$scope.rolePermissions[j].status = 0;
										}
									}
									if (c == $scope.rolePermissions.length) {
										$scope.existRoleData[i].checkAll = 1;
									} else {
										$scope.existRoleData[i].checkAll = 0;
										/*$scope.existRoleData[j].checkAllisDisabled = true;*/
									}

									var index = $scope.assignedData.indexOf(assign);
									$scope.assignedData.splice(index, 1);
								}
							})
						}
					} else {
						var c = 0;
						for (var j = 0; j < $scope.rolePermissions.length; j++) {
							var permsn = $scope.existRoleData[i].permissions;
							if (!$scope.flagInitialiseCheck) {
								$scope.rolePermissions[j].status = 0;
								c++;
							} else {
								if (permsn.indexOf($scope.rolePermissions[j].name) != -1) {
									$scope.rolePermissions[j].status = 1;
									c++;
								} else {
									$scope.rolePermissions[j].status = 0;
								}
							}
						}
						if (!$scope.flagInitialiseCheck) {
							$scope.existRoleData[i].checkAll = 0;

						} else if (c == $scope.rolePermissions.length) {
							$scope.existRoleData[i].checkAll = 1;
						} else {
							$scope.existRoleData[i].checkAll = 0;
						}
					}
					$scope.existRoleData[i].role_permissions = $scope.rolePermissions;
				}
				$scope.checkAll = function (data, flag, key) {
					if ($scope.existRoleData != null) {
						for (var i = 0; i < $scope.existRoleData.length; i++) {
							if (data == i) {
								if (flag) {
									angular.forEach($scope.existRoleData[i].role_permissions, function (item) {
										item.status = 1;
									});
									$scope.existRoleData[i].checkAll = 1;
								} else {
									angular.forEach($scope.existRoleData[i].role_permissions, function (item) {
										item.status = 0;
									});
									$scope.existRoleData[i].checkAll = 0;
								}
							}
						}
					}
				}

				$scope.checkIndCheck = function (key, flag, indItem) {
					for (var i = 0; i < $scope.existRoleData.length; i++) {

						if (key == i) {

							if (!flag) {
								angular.forEach($scope.existRoleData[i].role_permissions, function (item) {
									if (item.name == indItem) {
										item.status = 0;
									}
								});
								$scope.existRoleData[i].checkAll = 0;
							} else {
								var checkOther = true;
								angular.forEach($scope.existRoleData[i].role_permissions, function (item, key) {
									if (item.name == indItem) {
										item.status = 1;
									}
								});
								angular.forEach($scope.existRoleData[i].role_permissions, function (item, key) {
									if (item.status == 0) {
										checkOther = false;
									}
								});
								if (checkOther) {
									$scope.existRoleData[i].checkAll = 1;
								}
							}
						}
					}
				}
			}

			helper.platformUniqueAction = function (postObj) {
				postObj.platformUniqueList = [];
				angular.forEach(postObj.socialHandlers, function (handle) {
					var isExist = false;
					if (postObj.platformUniqueList.length > 0) {
						var isExist = false;
						angular.forEach(postObj.platformUniqueList, function (unq) {
							if (handle.socialPlatform.id == unq.id) {
								isExist = true;
							}
						})
						if (!isExist) {
							postObj.platformUniqueList.push(handle.socialPlatform)
						}
					} else {
						postObj.platformUniqueList.push(handle.socialPlatform)
					}
				})
			}

			helper.draftListAction = function (draftPost) {
				angular.forEach(draftPost, function (draft) {
					var statusClass = {};
					switch (draft.status) {
						case 1:
							statusClass.tag = "Active";
							statusClass.class = "success-text";
							break;
						case 2:
							statusClass.tag = "Disabled";
							statusClass.class = "del-red";
							break;
						case 3:
							statusClass.tag = "Deleted";
							statusClass.class = "label label-danger";
							break;
						case 4:
							statusClass.tag = "Draft";
							statusClass.class = "blue-text";
							break;
						case 5:
							statusClass.tag = "Post scheduled";
							statusClass.class = "success-text";
							break;
						case 6:
							statusClass.tag = "Pending";
							statusClass.class = "ong-share";
							break;
						case 7:
							statusClass.tag = "Approved";
							statusClass.class = "label-success";
							break;
						case 8:
							statusClass.tag = "Rejected";
							statusClass.class = "label-rejected";
							break;
						case 14:
							statusClass.tag = "Pending";
							statusClass.class = "task pending";
							statusClass.classspan = "label label-pending";
							break;
						case 15:
							statusClass.tag = "Approved";
							statusClass.class = "task approved";
							statusClass.classspan = "label label-approved";
							break;
						case 16:
							statusClass.tag = "Rejected";
							statusClass.class = "task rejected";
							statusClass.classspan = "label label-rejected";
							break;
						case 25:
							statusClass.tag = "Expired";
							statusClass.class = "yellow-text";
							statusClass.classspan = "label label-expired";
							break;
						case 26:
							statusClass.tag = "Expired";
							statusClass.class = "task expired";
							statusClass.classspan = "label label-expired";
							break;
					}
					draft.statusClass = statusClass;
				})
			}

			helper.getAudience = function ($scope) {
				var params = {
					'action': API_PATH + "audience-types_all"
				};
				httpServices.getRequest(API_URL, params).then(function (data) {
					$scope.audience = [];
					$scope.audienceObj = "";
					if (data.status == 200 && data.data && data.data.length > 0) {
						$scope.audienceObj = data.data;
						$scope.options = data.data;

						angular.forEach(data.data, function (aud) {
							$scope.audience.push(aud.name);
						})
					} else {
						$scope.errorMsgLogin = '';
					}

				}).catch(function (error) {
					$scope.errorMsg = 'Server error.';
				});
			}

			return helper;
		})
		/**
		 * @validation factory
		 * @author Anjani Gupta
		 */
		.factory('formValidator', function (helperFactory) {
			var helper = {};
			/**
			 * @method validate only aplhabet
			 */
			helper.alphabetOnly = function (inputtxt) {
				var letters = /[a-z]/i;
				if (letters.test(inputtxt)) {
					return true;
				}
			}
			/**
			 * @method validate only digits
			 */
			helper.digitsOnly = function (inputtxt) {
				var letters = /[0-9]/i;
				if (letters.test(inputtxt)) {
					return true;
				}
			}
			/**
			 * @method validate valid URL
			 */
			helper.isValidUrl = function (inputtxt) {

				if (/^(www)((\.[A-Z0-9][A-Z0-9_-]*)+.(com|org|net|dk|in|nl|at|us|tv|info|uk|co.uk|biz|se)$)(:(\d+))?\/?/i.test(inputtxt) ||
					/^(http|https|ftp):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+.(com|org|net|dk|in|nl|at|us|tv|info|uk|co.uk|biz|se)$)(:(\d+))?\/?/i.test(inputtxt) ||

					/^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(inputtxt)
				) {
					return true;
				} else if (inputtxt == "" || inputtxt == undefined) {
					return true;
				} else {
					return 'Enter a valid url';
				}
			}
			/**
			 * @method validate email format
			 */
			helper.emailValidation = function (inputtxt) {
				var pattern = /^([a-z0-9,!\#\$%&'\*\+\/=\?\^_`\{\|\}~-]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z0-9,!\#\$%&'\*\+\/=\?\^_`\{\|\}~-]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*@([a-z0-9-]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z0-9-]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*\.(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]){2,})$/i;
				if (pattern.test(inputtxt)) {
					return true;
				} else {
					return "Invalid Email Id";
				}
			}
			/**
			 * @method validate phone Number
			 */
			helper.phoneValidation = function (inputtxt) {
				var phoneno = /^\d{10}$/;
				if (phoneno.test(inputtxt)) {
					return true;
				} else {
					return "Invalid phone no";
				}

			}
			/**
			 * @method validate password
			 */
			helper.passwordValidator = function (password, isRequired = true) {
				if (isRequired && !password) {
					return true;
				}
				if (password && password.length < 6) {
					return "Password must be at least " + 6 + " characters long";
				}

				if (password && !password.match(/[A-Z]/)) {
					return "Password must have at least one capital letter";
				}

				if (password && !password.match(/[0-9]/)) {
					return "Password must have at least one number";
				}
				return true;
			}
			helper.listValidator = function (listObj) {
				if (listObj > 0) {
					return true;
				} else {
					return "Select at least one user";
				}
			}
			helper.listValidatorAudience = function (listObj) {
				if (listObj > 0) {
					return true;
				} else {
					return "Select audience";
				}
			}
			helper.brandValidator = function (obj) {
				if (obj > 0) {
					return true;
				} else {
					return "Add at least one brand";
				}
			}
			helper.apprverListValidator = function (listObj) {
				if (typeof listObj != 'undefined' && !helperFactory.isEmpty(listObj)) {
					return true;
				} else {
					return "Select approver";
				}
			}

			helper.mediaListValidator = function (data) {
				if (data != undefined) {
					return true;
				} else {
					return "Required";
				}
			}
			/**
			 * @method validate date
			 */
			helper.dateValidator = function (startDate, endDate) {
				if (typeof startDate != 'undefined' && typeof endDate != 'undefined') {
					if (helperFactory.getTimeStamp(startDate) <= helperFactory.getTimeStamp(endDate)) {
						return true;
					} else {
						return false;
					}
				}
			}

			/**
			 * @method validate date
			 */
			helper.dateValidator2 = function (startDate, endDate) {
				if (typeof startDate != 'undefined' && typeof endDate != 'undefined') {
					if (helperFactory.getTimeStamp(startDate) <= helperFactory.getTimeStamp(endDate)) {
						return true;
					} else {
						return false;
					}
				}
			}
			/**
			 * @method rematch passoword and rePassword
			 */
			helper.matchPassword = function (pass, repass) {
				if (typeof pass == 'undefined' && typeof repass == 'undefined') {
					return true
				}
				if (typeof pass != 'undefined') {
					if (pass == null && typeof repass == 'undefined') {
						return true;
					} else if (pass == repass) {
						return true;
					} else if (pass != null && typeof repass == 'undefined' && pass === repass) {
						return true
					} else {
						return false;
					}
				}
			}
			return helper;
		})
		/**
		 * @pagination factory
		 * @author Gaurav Sirauthiya
		 */
		.factory('pagination', function () {
			var helper = {};
			/**
			 * @method set Pagination data
			 */
			helper.setPagination = function (scope) {
				if (typeof scope.per_page == 'undefined') {
					scope.per_page = 10;
				}
				scope.indexer = eval(scope.page * scope.per_page);
				scope.paginationData = {};
				var x = parseInt(scope.totalRecords / scope.per_page);

				if (scope.totalRecords % scope.per_page == 0) {
					var x = parseInt(scope.totalRecords / scope.per_page) - 1;
				}
				scope.paginationData = {
					'per_page': scope.per_page,
					'total_data': scope.totalRecords,
					'page_num': scope.page,
				};
				scope.dx = [];
				for (var i = 0; i <= x; i++) {
					scope.dx.push(i);
				}

			}
			return helper;
		}).factory('youTubeThumb', function () {
			var helper = {};

			helper.getThumb = function (url, size) {
				if (url === null) {
					return '';
				}
				size = (size === null) ? 'big' : size;
				results = url.match('[\\?&]v=([^&#]*)');
				video = (results === null) ? url : results[1];

				if (size === 'small') {
					return 'http://img.youtube.com/vi/' + video + '/2.jpg';
				}
				return 'http://img.youtube.com/vi/' + video + '/0.jpg';
			}
			return helper;
		})
		/**
		 * @menu items factory
		 * @author Gaurav Sirauthiya
		 */
		.factory('menuFactory', function (localstorage, userHelper, rolesHelper, helperFactory, $templateCache, $location, $timeout) {
			var menuFactory = {};
			menuFactory.checkMenuActive = function (menuItems) {
				var locPath = $location.path();
				var matchUrlFound = false;
				angular.forEach(menuItems, function (menu) {
					menu.active = false;
					angular.forEach(menu.children, function (child) {
						if (child.href === locPath /*|| (locationSet != null && locationSet === locPath)*/) {
							child.active = true;
							menu.active = true;
							matchUrlFound = true;
						} else {
							child.active = false;
						}
					})
				})
				if (!matchUrlFound) {
					var newLocPath = "";
					if (locPath.match(/user/i)) {
						newLocPath = "/userListing";
					} else if (locPath.match(/client/i)) {
						newLocPath = "/client";
					} else if (locPath.match(/team/i)) {
						newLocPath = "/teamListing";
					} else if (locPath.match(/role/i)) {
						newLocPath = "/roleListing";
					} else if (locPath.match(/campaign/i)) {
						newLocPath = "/campaignListing";
					} else if (locPath.match(/task/i)) {
						newLocPath = "/tasks";
					} else if (locPath.match(/draft/i)) {
						newLocPath = "/draft";
					} else if (locPath.match(/performance/i)) {
						newLocPath = "/performance";
					}
					angular.forEach(menuItems, function (menu) {
						menu.active = false;
						angular.forEach(menu.children, function (child) {
							if (child.href === newLocPath) {
								child.active = true;
								menu.active = true;
							} else {
								child.active = false;
							}
						})
					})
				}
			}
			/**
			 * @author get menu items
			 */
			menuFactory.getMenuItems = function ($scope) {
				var vm = this;
				var menu = [];
				var userAccessLevel = rolesHelper.getUSerAccessLevel();
				var outReachMenu = {
					label: 'Outreach',
					icon: 'fa-tachometer',
					children: [],
					active: false
				};
				var summaryList = {
					label: 'Summary',
					icon: 'fa-circle',
					href: '/summary',
					active: false
				};
				var campaignList = {
					label: 'Campaign',
					icon: 'fa-circle',
					href: '/campaignListing',
					active: false
				};

				var scheduledList = {
					label: 'Scheduled',
					icon: 'fa-circle',
					href: '/scheduled',
					active: false
				};
				var publishedList = {
					label: 'Published',
					icon: 'fa-circle',
					href: '/published',
					active: false
				};
				var tasksList = {
					label: 'Tasks',
					icon: 'fa-circle',
					href: '/tasks',
					active: false
				};

				var eventList = {
					label: 'Events',
					icon: 'fa-circle',
					href: '/event',
					active: false
				};

				var composePostList = {
					label: 'Compose Post',
					icon: 'fa-circle',
					href: '/composePost',
					active: false
				};
				var draftList = {
					label: 'Drafts',
					icon: 'fa-circle',
					href: '/draft',
					active: false
				};

				outReachMenu.children.push(summaryList);
				/**manage campaign menu */
				var _showCampaignMenu = rolesHelper.canView('FETCH_ALL_CAMPAIGN') || rolesHelper.canView('GET_CAMPAIGN_BY_CLIENT');
				if (_showCampaignMenu) {
					outReachMenu.children.push(campaignList);
				}

				/**manage compose post menu */
				var _showComposePostMenu = rolesHelper.canCreate('MANAGE_POST') && rolesHelper.canView('GET_BRAND_FOR_CLIENT') && rolesHelper.canView('GET_CAMPAIGN_BY_CLIENT') && rolesHelper.canView('GET_SOCIAL_HANDLER_BY_CLIENT_PLATFORM_ID') && rolesHelper.canView('MANAGE_CAMPAIGN');
				if (_showComposePostMenu) {
					outReachMenu.children.push(composePostList);
				}

				/**manage draft menu */
				var _showDraftMenu = rolesHelper.canView('GET_DRAFT_POST_BY_CLIENT');
				if (_showDraftMenu) {
					outReachMenu.children.push(draftList);
				}

				/**manage scheduled menu */
				var _showScheduledMenu = rolesHelper.canView('POST_SCHEDULE_FILTER_BY_DATE_RANGE_STATUS_BY_CALENDAR') && rolesHelper.canView('FETCH_ALL_EVENTS');
				if (_showScheduledMenu) {
					outReachMenu.children.push(scheduledList);
				}

				/**manage published menu */
				var _showPublishedMenu = rolesHelper.canView('POST_SCHEDULE_FILTER_BY_DATE_RANGE_STATUS') && rolesHelper.canView('GET_CAMPAIGN_BY_CLIENT');
				if (_showPublishedMenu) {
					outReachMenu.children.push(publishedList);
				}

				/**manage task menu */
				var _showTaskMenu = rolesHelper.canView('FETCH_ALL_TASKS') || (rolesHelper.canView('GET_TASK_BY_CLIENT') && rolesHelper.canEdit('MANAGE_TASK') && rolesHelper.canView('MANAGE_TASK'));

				if (_showTaskMenu) {
					outReachMenu.children.push(tasksList);
				}

				/**manage events menu */
				outReachMenu.children.push(eventList);
				if (outReachMenu.children.length > 0) {
					menu.push(outReachMenu);
				}
				var clientMenu = {
					label: 'Client',
					icon: 'fa-user',
					children: [],
					active: false
				};
				var clientListMenu = {
					label: 'Clients',
					icon: 'fa-circle',
					href: '/client',
					active: false
				};
				var brandListMenu = {
					label: 'Create Brand',
					icon: 'fa-circle',
					href: '/createBrand',
					active: false
				};
				var clientViewMenu = {
					label: 'View Client',
					icon: 'fa-circle',
					href: '/viewClient',
					active: false
				};

				if (userAccessLevel == 'super_admin') {
					clientMenu.children.push(clientListMenu)
				}

				if (userAccessLevel == 'client_admin') {
					clientMenu.children.push(clientViewMenu)
				}
				

				var _showBrandMenu = rolesHelper.canCreate('MANAGE_BRAND');
				if (_showBrandMenu) {
					clientMenu.children.push(brandListMenu);
				}

				var contentMenu = {
					label: 'Content',
					icon: 'fa-files-o',
					children: [{
						label: 'Suggestions',
						icon: 'fa-circle',
						href: '/suggestions'
					}],
					active: false
				};

				var contentLibraryMenu = {
					label: 'Content Library',
					icon: 'fa-circle',
					href: '/contentLibrary',
					active: false
				}
				var _showContentMenu = rolesHelper.canView('FETCH_ALL_CONTENT') || rolesHelper.canView('FETCH_ALL_MEDIA');
				if (_showContentMenu) {
					contentMenu.children.push(contentLibraryMenu);
				}


				var audienceMenu = {
					label: 'Audience',
					icon: 'fa-users',
					children: [

						{
							label: 'Audience',
							icon: 'fa-circle',
							href: '/audienceList'
						}
					],
					active: false
				};

				var performanceMenu = {
					label: 'Performance',
					icon: 'fa-bar-chart-o',
					children: [],
					active: false
				};


				var performanceList = {
					label: 'Summary',
					icon: 'fa-circle',
					href: '/performance',
					active: false
				};
				var teamReportList = {
					label: 'Team Report',
					icon: 'fa-circle',
					href: '/teamReport',
					active: false
				};
				var _showPerformanceList = rolesHelper.canView('GET_CAMPAIGN_BY_CLIENT') && rolesHelper.canView('POST_TWITTER_HASHTAG_BY_CLIENT_ID') && rolesHelper.canView('GET_PERFORMANCE_SUMMARY_BY_CLIENT');
				if (_showPerformanceList) {
					performanceMenu.children.push(performanceList);
				}
				var settingMenu = {
					label: 'Settings',
					icon: 'fa-envelope',
					children: [{
						label: 'Set-up Metrics',
						icon: 'fa-circle',
						href: '/setupMetrics'
					},
						/*{
							label: 'Set-up Reminders',
							icon: 'fa-circle',
							href: 'setupReminders'
						}*/
					],
					active: false
				};

				var userMenu = {
					label: 'User Management',
					icon: 'fa-user-plus',
					children: [],
					active: false
				};
				var userListMenu = {
					label: 'Users',
					icon: 'fa-circle',
					href: '/userListing',
					active: false
				};
				var teamListMenu = {
					label: 'Teams',
					icon: 'fa-circle',
					href: '/teamListing',
					active: false
				};
				/* Allowing User listing Menu */
				var _showUserList = rolesHelper.canView('GET_USER_BY_CLIENT');
				if (_showUserList) {
					userMenu.children.push(userListMenu);
				}
				/* Allowing Team Listing Menu */
				var _showTeamList = (rolesHelper.canView('FETCH_TEAMS_BY_CLIENT') || rolesHelper.canView('FETCH_ALL_TEAM')) && rolesHelper.canEdit('MANAGE_TEAM');
				if (_showTeamList) {
					userMenu.children.push(teamListMenu);
				}


				if (clientMenu.children.length > 0) {
					menu.push(clientMenu);
				}
				menu.push(contentMenu);

				if (performanceMenu.children.length > 0) {
					menu.push(performanceMenu);
				}
				if (userMenu.children.length > 0) {
					menu.push(userMenu);
				}
				var rolesMenuAccess = rolesHelper.getRoleKey('MANAGE_ROLE');
				if (rolesMenuAccess && rolesMenuAccess.permissions.indexOf('GET') > -1) {
					var roleListMenu = {
						label: 'Roles',
						icon: 'fa-circle',
						href: '/roleListing',
						active: false
					};
					userMenu.children.push(roleListMenu);
				}
				vm.menu = null;
				vm.msg = null;
				menuFactory.checkMenuActive(menu);

				$scope.config = {
					data: angular.copy(menu),
					animation: true,
				};
				$scope.animationCfg = {
					animation: true,
					data: angular.copy(menu)
				}
			}
			return menuFactory;
		});
});