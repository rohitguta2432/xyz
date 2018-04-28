'use strict';
define([
	'angular',
	'angularRoute',
	'userHelper',
	'outreachHelper',
	'highChart',
	'highChartMore',
	'checkBoxSelection'
], function (angular) {
	angular.module('socioApp.performance', ['ui.router', 'socioApp.user.userHelper', 'socioApp.outreach.outreachHelper', 'checklist-model'])

		.config(['$stateProvider', function ($stateProvider) {
			$stateProvider.state('performance', {
				url: '/performance',
				templateUrl: 'modules/performance/views/summary.html',
				controller: 'performanceController',
			}).state("campaignReport", {
				url: '/performanceReport',
				templateUrl: 'modules/performance/views/campaignReport.html',
				controller: 'campaignReportController',
				params: {
					campaignId: ""
				}
			}).state("teamReport", {
				url: '/teamReport',
				templateUrl: 'modules/performance/views/teamReport.html',
				controller: 'teamReportController',
			}).state("compareCampaigns", {
				url: '/performanceCompare',
				templateUrl: 'modules/performance/views/compareCampaigns.html',
				controller: 'compareCampaignsController',
			});
		}])
		.controller('performanceController', function (rolesHelper, outreachHelper, $scope, $location, localstorage, helperFactory, $state, httpServices, userHelper, menuFactory, $timeout) {
			if (!helperFactory.isLoggedIn()) {
				$state.go('login');
				return false;
			}
			$scope.compareBtnText = "Compare Campaign";
			$scope.isReadyToComapre = false;


			/*If true then show default selected client of zero index for admin*/
			$scope.showSelectedClient = true;
			$scope.configScroll = SCROLL_CONFIG;
			$scope.canViewPerformance = rolesHelper.canView('GET_CAMPAIGN_BY_CLIENT') && rolesHelper.canView('POST_TWITTER_HASHTAG_BY_CLIENT_ID') && rolesHelper.canView('GET_PERFORMANCE_SUMMARY_BY_CLIENT');
			if (!$scope.canViewPerformance) {
				$state.go('summary')
			}

			$scope.canViewDetail = rolesHelper.canView('MANAGE_CAMPAIGN');
			$scope.$emit('menuItem', menuFactory.getMenuItems($scope));
			$scope.$emit('pageTitle', "Performance");
			$scope.$emit('getHeader', true);
			$scope.$emit('getFooter', true);

			if (userHelper.isAdmin()) {
				$scope.clientId = "";
				$scope.adminClientDropdown = true;
				$scope.selectedClient = [];
				$scope.extraSettings = SINGLE_CLIENT_DROPDOWN;
				outreachHelper.getClient($scope, httpServices, helperFactory, localstorage);

				$timeout(function () {
					console.log($scope.clientId);
					if ($scope.clientId) {
						getCampaignListByClientId();
					}
				}, 500);

			} else {
				$scope.clientId = localstorage.get('clientId');
				$scope.adminClientDropdown = false;
				getCampaignListByClientId();
			}

			$scope.changeClient = function () {
				$scope.filter = false;
				$scope.startDate = null;
				$scope.endDate = null;
				$scope.comparisonObj = [];
				if ($scope.selectedClient.length > 0) {
					$scope.clientId = $scope.selectedClient[0].id;
					getCampaignListByClientId();
				} else {
					$scope.clientId = "";
				}

			}

			$scope.summary = [];
			$scope.mentions = [];
			function getSummary() {
				$scope.summary = [];
				if ($scope.filter) {
					var params = {
						'action': API_PATH + 'performance_summary_' + $scope.clientId,
						'q': 'startDate:' + helperFactory.getTimeStamp($scope.startDate) + ',gte,' + helperFactory.getTimeStamp($scope.endDate) + ',lte!true',
					};
				} else {
					var params = {
						'action': API_PATH + 'performance_summary_' + $scope.clientId
					};
				}

				httpServices.getRequest(API_URL, params).then(function (data) {
					$scope.summaryReportError = "";
					if (data.status == 200 && !helperFactory.isEmpty(data.data)) {
						console.log("campaign date--------------", data.data.campaignReports)
						$scope.summary = data.data.campaignReports;

						if ($scope.summary.length == 0) {
							$scope.summaryReportError = "No report found...";
						}

						$scope.clientFollowersInfoList = data.data.clientFollowersInfoList;
						$scope.userMentionSummarieList = data.data.userMentionSummarieList;
						$scope.mentions.push($scope.userMentionSummarieList);
					} else {
						$scope.summaryReportError = "No report found...";
					}
					getCampaignHashTags();
				}).catch(function (error) {
					$scope.errorMsg = 'Server error.';
				});
			}

			function getCampaignListByClientId() {
				getSummary();
			}

			$scope.getCampaignReport = function (data) {
				localstorage.set('campaignReportId', data.campaignId);
				$state.go('campaignReport', {
					'campaignId': data.campaignId
				});
			}

			function getCampaignHashTags() {
				$scope.hashTagCount = [];
				if ($scope.clientId) {
					var params = {
						'action': API_PATH + "performance_hashtag_client_" + $scope.clientId,
					};
					httpServices.getRequest(API_URL, params).then(function (data) {
						if (data.status == 200 && !helperFactory.isEmpty(data.data)) {
							angular.forEach(data.data, function (cdata, index) {
								angular.forEach(cdata.hashTagCount, function (hashData, key) {
									$scope.hashTagCount.push({
										'tag': key,
										'count': hashData
									});
								});
							});
						}
					}).catch(function (error) {
						$scope.errorMsgLogin = 'Server error.';
					});
				}
			}


			/**
			 * @author: Anjani Gupta
			 * @method: selectCampaign
			 * @Description: Select campaigns to compare
			 * */
			$scope.comparisonObj = [];

			$scope.selecteCampaign = function () {
				$scope.compareBtnText = "Select Campaign";


				if ($scope.comparisonObj.length < 2) {
					/**select at min two campaigns */
					$scope.compareCampError = "Minimum two campaigns are required.";
				} else if ($scope.comparisonObj.length > 3) {
					$scope.compareCampError = "Maximum three campaign can be comapired.";
				} else {
					$scope.compareCampError = "";
					/** redirect to comparison page*/
					angular.forEach($scope.comparisonObj, function (data) {

						data.clientFollowersInfoList = $scope.clientFollowersInfoList;
						data.userMentionSummarieList = $scope.userMentionSummarieList;
					});

					console.log($scope.comparisonObj)
					localstorage.setObject('compareObj', $scope.comparisonObj);
					$state.go('compareCampaigns');
				}


			}

			$scope.filter = false;
			$scope.filterReports = function () {
				if ($scope.startDate != undefined && $scope.endDate != undefined) {
					$scope.filter = true;
					getCampaignListByClientId();
				}
			}

		})
		.controller('campaignReportController', function (outreachHelper, securityGroups, $stateParams, httpServices, $scope, $location, localstorage, helperFactory, $state, $timeout, rolesHelper, menuFactory) {
			if (!helperFactory.isLoggedIn()) {
				$state.go('login');
				return false;
			}
			$scope.configScroll = SCROLL_CONFIG;
			$scope.canViewDetail = rolesHelper.canView('MANAGE_CAMPAIGN');
			if (!$scope.canViewDetail) {
				$state.go('summary')
			}
			$scope.$emit('menuItem', menuFactory.getMenuItems($scope));
			$scope.$emit('pageTitle', "Campaign Report");
			$scope.$emit('getHeader', true);
			$scope.$emit('getFooter', true);
			$scope.campaignId = localstorage.get('campaignReportId');
			if ($scope.campaignId) {
				geCampaigntSummaryReport($scope.campaignId);
				outreachHelper.getCampignData($scope, securityGroups, false, $timeout);
			}

			function makeSocialGraph(platformName, divID, graphData) {
				var options = {
					chart: {
						type: 'bubble',
						plotBorderWidth: 1,
						zoomType: 'xy',
						events: {
							load: function () {
								this.myTooltip = new Highcharts.Tooltip(this, this.options.tooltip);
							}
						}
					},
					title: {
						text: 'Performance Graph'
					},
					xAxis: {
						title: {
							text: ' No. of Replies '
						},
						gridLineWidth: 1
					},
					yAxis: {
						title: {
							text: ' No. of Likes '
						},
						startOnTick: false,
						endOnTick: false
					},
					tooltip: {
						useHTML: true,
						headerFormat: '<table>',
						pointFormat: '<tr><th colspan="2" class="ac"><h5 style="text-overflow: ellipsis; white-space: nowrap; width:150px; overflow: hidden;">{point.name}</h5></th></tr>' +
						'<tr><th class="graph-icon ac"><i class="fa fa-comments"></i> </th><td>{point.x}</td></tr>' +
						'<tr><th class="graph-icon ac"><i class="fa fa-thumbs-up" ng-class="{"fa-thumbs-up":platformName == "facebbok","fa-favourite":platformName == "twitter"}"></i> </th><td>{point.y}</td></tr>' +
						'<tr><th class="graph-icon ac"><i class="fa fa-share"></i> </th><td>{point.z}</td></tr>',
						footerFormat: '</table>',
						followPointer: true
					},

					plotOptions: {
						bubble: {
							minSize: 1,
							maxSize: 60,
						},
						series: {
							dataLabels: {
								enabled: true,
								format: '{point.key}'
							},
							events: {
								click: function (evt) {
									this.chart.myTooltip.refresh(evt.point, evt);
								},
								mouseOut: function () {
									this.chart.myTooltip.hide();
								}
							}
						}
					},
					series: graphData
				};

				$(divID).highcharts(options);
			}

			function geCampaigntSummaryReport(campaignId) {
				var params = {
					'action': API_PATH + 'performance_campaign_' + campaignId
				};
				httpServices.getRequest(API_URL, params).then(function (data) {
					if (data.status == 200 && !helperFactory.isEmpty(data.data)) {
						$scope.campaignSummary = data.data;
						var fbData = [];
						var twData = [];
						var likeRange = 500;
						angular.forEach($scope.campaignSummary.postMetrics, function (pm) {
							if (pm.name === "Likes") {
								likeRange = pm.level[0];
							}
						})

						angular.forEach($scope.campaignSummary.postReportDtos, function (pf, indexReport) {
							var tmpPoint = { x: pf.commentCount, y: pf.likeCount, z: pf.shareCount, name: pf.description };
							if (likeRange > pf.likeCount) {
								tmpPoint.color = '#1DA1F2';/*#295396*/
							} else {
								tmpPoint.color = 'green';
							}

							switch (pf.platform.toLowerCase()) {
								case 'facebook':
									/*tmpPoint.key = "FB";*/
									fbData.push(tmpPoint);
									break;
								case 'twitter':
									/*tmpPoint.key = "TWT";*/
									twData.push(tmpPoint);
									break;
							}
							if ($scope.campaignSummary.postReportDtos.length == indexReport + 1) {
								console.log('fb Data: ', fbData);
								console.log('tw Data: ', twData);
								if (fbData.length > 0) {
									var sData = [{
										name: 'Facebook',
										data: fbData,
										marker: {
											fillColor: {
												radialGradient: { cx: 0.4, cy: 0.3, r: 0.7 },
												stops: [
													[0, 'rgba(255,255,255,0.5)'],
													[1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0.5).get('rgba')]
												]
											}
										}
									}];
									makeSocialGraph('twitter', '#containerFacebook', sData);
								}
								if (twData.length > 0) {
									var sData = [{
										name: 'Twitter',
										data: twData,
										marker: {
											fillColor: {
												radialGradient: { cx: 0.4, cy: 0.3, r: 0.7 },
												stops: [
													[0, 'rgba(255,255,255,0.5)'],
													[1, Highcharts.Color(Highcharts.getOptions().colors[1]).setOpacity(0.5).get('rgba')]
												]
											}
										}
									}];
									makeSocialGraph('twitter', '#containerTwitter', sData);
								}
							}
						})


					} else { }
				}).catch(function (error) {
					$scope.errorMsg = 'Server error.';
				});
			}

		})
		.controller('teamReportController', function ($scope, $location, localstorage, helperFactory, $state, userHelper, httpServices, securityGroups, menuFactory) {
			if (!helperFactory.isLoggedIn()) {
				$state.go('login');
				return false;
			}
			$scope.$emit('menuItem', menuFactory.getMenuItems($scope));
			$scope.$emit('pageTitle', "Team Report");
			$scope.$emit('getHeader', true);
			$scope.$emit('getFooter', true);
			$scope.configScroll = SCROLL_CONFIG;
			$scope.pieData = [{
				name: "Microsoft Internet Explorer",
				y: 56.33
			}, {
				name: "Chrome",
				y: 24.03,
				sliced: true,
				selected: true
			}, {
				name: "Firefox",
				y: 10.38
			}, {
				name: "Safari",
				y: 4.77
			}, {
				name: "Opera",
				y: 0.91
			}, {
				name: "Proprietary or Undetectable",
				y: 0.2
			}]
			securityGroups.socialPlatformAction($scope);
			if (userHelper.isAdmin()) {
				$scope.adminClientDropdown = true;
				userHelper.fetchClientForTeam($scope);
			} else {
				$scope.clientId = localstorage.get('clientId');
				$scope.adminClientDropdown = false;
				userHelper.getAllTeams($scope, false, false, $scope.clientId);
			}

			$scope.sorting = {
				attribute: 'createdDate',
				direction: 'desc'
			};

			$scope.getPagedData = function (page) {
				if (page < $scope.dx.length && page >= 0) {
					$scope.getTeamView(0);
				}
			}

			$scope.changeClient = function (data) {
				$scope.searchKey = null;
				if (data != undefined && data != null) {
					$scope.clientId = data.id;
					userHelper.getAllTeams($scope, false, false, $scope.clientId);
					$scope.getTeamView(0);
				}
			}

			$scope.showPerformance = function (team) {
				var platforms = [];
				angular.forEach($scope.optionSocial, function (opt) {
					platforms.push(opt.id);
				})
				var formData = {
					"clientId": $scope.clientId,
					"authorId": localstorage.get('userId'),
					"platformIds": platforms,
					"startDate": "01/03/2017",
					"endDate": "29/09/2017"
				}
				var params = {
					'action': API_PATH + 'performance_teamReport',
					'myparam': formData
				};
				httpServices.postRequest(API_URL, params).then(function (data) {
					if (data.status == 200) {
						helperFactory.successMessage(data.message);
						$scope.performanceData = data.data;
						angular.forEach($scope.performanceData, function (piD) {
							piD.isReportOpen = false;
							var dataSum = piD.postCount;
							piD.pieData = [{
								name: "Approved",
								y: (piD.approvedCount / dataSum) * 100,
								color: '#FFF263'
							}, {
								name: "Pending",
								y: (piD.pendingCount / dataSum) * 100,
								color: '#ED561B'
							}, {
								name: "Rejected",
								y: (piD.rejectedCount / dataSum) * 100,
								color: '#64E572'
							}, {
								name: "Published",
								y: (piD.pubishedCount / dataSum) * 100,
								color: '#6AF9C4'
							}]
						})
					} else {
						helperFactory.errorMessage(data.message);
					}
				}).catch(function (error) {
					$scope.errorMsgLogin = 'Server error.';
				});


			}

		}).controller('compareCampaignsController', function (outreachHelper, securityGroups, $stateParams, httpServices, $scope, $location, localstorage, helperFactory, $state, $timeout, rolesHelper, menuFactory) {
			if (!helperFactory.isLoggedIn()) {
				$state.go('login');
				return false;
			}
			$scope.$emit('menuItem', menuFactory.getMenuItems($scope));
			$scope.$emit('pageTitle', "Compare Campaigns");
			$scope.$emit('getHeader', true);
			$scope.$emit('getFooter', true);

			$scope.stackedGraph = function (stackData) {
				var options = {

					chart: {
						type: 'column'
					},

					title: {
						text: 'Total social media data grouped by campaign'
					},

					xAxis: {
						categories: ['Likes', 'Comments', 'Share', 'Posts']
					},

					yAxis: {
						allowDecimals: false,
						min: 0,
						title: {
							text: 'Count'
						}
					},

					tooltip: {
						formatter: function () {
							return '<b>' + this.x + '</b><br/>' +
								this.series + ': ' + this.y + '<br/>' +
								'Total: ' + this.point.stackTotal;
						}
					},

					plotOptions: {
						column: {
							stacking: 'normal',
							dataLabels: {
								enabled: true,
								color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
							}
						}
					},

					series: stackData
				};

				$("#stackedGraph").highcharts(options);
			}
			/**
			 * @method: drawColumnGraph
			 * @author: Anjani Gupta
			 * @desc: This graph draw the different stats graph for post/likes/comments/shares count
			 * @type: column chart
			 * @date: 26th June 2017
			 */

			$scope.drawColumnGraph = function (divId, camps, data, color) {
				var toolTipData = [];
				angular.forEach(camps.platformReports, function (pr) {
					var tmpData = { 'like': pr.likeCount, 'comment': pr.commentCount, 'share': pr.shareCount, 'postCount': pr.postCount };
					switch (pr.platform.toLowerCase()) {
						case 'facebook':
							tmpData.platform = 'Facebook';
							break;
						case 'twitter':
							tmpData.platform = 'Twitter';
							break;
					}
					toolTipData.push(tmpData);
				})
				var options = {
					chart: {
						type: 'column',

					},
					title: {
						text: ''
					},
					subtitle: {
						text: ''
					},
					xAxis: {
						categories: [
							'Likes',
							'Post',
							'Comments',
							'Share',
						],
						crosshair: true
					},
					yAxis: {
						min: 0,
						max: localstorage.get("maxYAxis"),
						title: {
							text: 'Count'
						},
						allowDecimals: false,
					},
					tooltip: {
						/*formatter: function () {
							var s = '';
							var table = "";

							$.each(toolTipData, function (i, point) {
								if (point.platform.toLowerCase() == 'facebook') {
									s += "<tr><th class='platform-icon ac'><i class='fa fa-facebook-official'></i></th>" +
										"<td><label class='like'><i class='fa fa-thumbs-o-up like'></i></label>" + point.like + "</td>" +
										"<td ><label class='share'><i class='fa fa-share share'></i></label>" + point.share + "</td>" +
										"<td ><label class='ong-share'><i class='fa fa-comments-o '></i></label>" + point.comment + "</td>" +
										"<td><label class='envelope'><i class='fa fa-envelope'></i></label>" + point.postCount + "</td>" +
										"</tr>";
								}
								else if (point.platform.toLowerCase() == 'twitter') {
									s += "<tr><th class='platform-icon ac'><i class='fa fa-twitter'></i></th>" +
										"<td> <label class='heart'><i class='fa fa-heart'></i></label>" + point.like + "</td>" +
										"<td><label class='retweet'><i class='fa fa-retweet '></i></label>" + point.share + "</td>" +
										"<td> <label class='ong-share'><i class='fa fa-comments-o'></i></label>" + point.comment + "</td>" +
										"<td><label class='envelope'><i class='fa fa-envelope'></i></label>" + point.postCount + "</td>" +
										"</tr>";
								}
							});

							table = "<table class='table table-bordered mb0px ac small-table'>" + s + "</table>"
							return table;
						},
						shared: true,*/
						
						headerFormat: '<small>{point.key}</small><table>',
						pointFormat: '<span style="color:{point.color}">{point.name}</span>: {point.y}',
						footerFormat: '</table>',
						
					},
					plotOptions: {
						column: {
							pointPadding: 0.2,
							borderWidth: 0
						}
					},
					series: [{
						name: camps.campaignName,
						data: data,
						color: color,
						showInLegend: false
					}]
				};

				$(divId).highcharts(options);
			}

			/**
			 * @method: drawStatsGraph
			 * @author: Anjani Gupta
			 * @desc: This graph draw the different stats graph for post/likes/comments/shares count
			 * @type: donut chart
			 * @date: 23rd June 2017
			 */


			$scope.drawStatsGraph = function (divId, name, data, camps) {

				var options = {
					chart: {
						plotBackgroundColor: null,
						plotBorderWidth: 0,
						plotShadow: false,
						height: 300
					},
					title: {
						text: name,
						align: 'center',
						verticalAlign: 'middle',
						y: 10,
						style: {
							fontWeight: 'normal',
							fontSize: '12px',
							color: 'black'
						}
					},
					/*tooltip: {
						useHTML: true,
						headerFormat: '<table>',
						pointFormat: '<tr><th colspan="2" class="ac"><h5 style="text-overflow: ellipsis;    white-space: nowrap; width:150px; overflow: hidden;">{point.campObj}</h5></th></tr>' +
						'<tr><th class="graph-icon ac"><i class="fa fa-comments"></i> </th><td>{point.campObj}</td></tr>',
						footerFormat: '</table>',
						followPointer: true
					},*/
					plotOptions: {
						pie: {
							dataLabels: {
								enabled: true,
								distance: 0,
								style: {
									fontWeight: 'normal',
									fontSize: '12px',
									color: 'black'
								}
							},
							startAngle: 0,
							endAngle: 360,
							center: ['50%', '30%']
						}
					},
					series: [{
						type: 'pie',
						name: name,
						innerSize: '50%',
						data: data
					}]
				};

				$(divId).highcharts(options);
			}


			/**
			 * @method: drawBubbleChart
			 * @author: Anjani Gupta
			 * @desc: Bubble chart for campaigns
			 * @date: 23rd June 2017
			 */

			$scope.drawBubbleChart = function (seriesData) {

				var options = {

					chart: {
						type: 'bubble',
						plotBorderWidth: 1,
						zoomType: 'xy'
					},

					title: {
						text: 'Performace Graph'
					},
					xAxis: {
						title: {
							text: ' No. of Replies '
						},
						gridLineWidth: 1
					},
					yAxis: {
						title: {
							text: ' No. of Likes '
						},
						startOnTick: false,
						endOnTick: false
					},
					tooltip: {
						useHTML: true,
						headerFormat: '<table>',
						pointFormat: '<tr><th colspan="2"><h5 style="text-overflow: ellipsis;    white-space: nowrap; width:150px; overflow: hidden;">{point.name}</h5></th></tr>' +
						'<tr><th>Platform:</th><td class="platform-icon"><i class="{point.iconPlatform}"</td></tr>' +
						'<tr><th class="graph-icon"><i class="fa fa-comments"></i> </th><td>{point.x}</td></tr>' +
						'<tr><th class="graph-icon "><i  class="{point.iconLike} "></i> </th><td>{point.y}</td></tr>' +
						'<tr><th class="graph-icon"><i class="{point.iconShare}"></i> </th><td>{point.z}</td></tr>',


						footerFormat: '</table>',
						followPointer: true



					},
					series: seriesData
				}
				$("#bubbleChart").highcharts(options);
			}

			$scope.campaignData = localstorage.getObject('compareObj');

			console.log("campaign data", $scope.campaignData);

			$scope.campLikesReport = [];
			$scope.campPostCountReport = [];
			$scope.campSharesReport = [];
			$scope.campCommentsReport = [];

			var likesData = [];
			var postData = [];
			var shareData = [];
			var commentData = [];
			var stackArray = [];
			var colorArray = ["#1195ce", "#d4c12d", "#5ab071"]
			var maxArray = [];
			angular.forEach($scope.campaignData, function (camps, index) {
				var mentionsArray = [];
				var postsArray = [];
				console.log(camps.userMentionSummarieList)

				if (camps.platformNames.length != camps.platformReports.length) {
					angular.forEach(camps.platformNames, function (pf, pf_i) {

						angular.forEach(camps.platformReports, function (pfr, pfr_i) {

							if (pf.toLowerCase() != pfr.platform.toLowerCase()) {
								var pObj = {};
								pObj.commentCount = 0;
								pObj.likeCount = 0;
								pObj.platform = 0;
								pObj.postCount = 0;
								pObj.shareCount = 0;
								pObj.platform = pf.toLowerCase();

								postsArray.push(pObj);
							}
						});
						angular.forEach(camps.userMentionSummarieList, function (ment, ment_i) {

							if (pf.toLowerCase() != ment.platform.toLowerCase()) {

								var pObj = {};
								pObj.clientId = null;
								pObj.createdBy = null;
								pObj.createdDate = null;
								pObj.createdTime = null;
								pObj.handlerId = null;
								pObj.id = null;
								pObj.mentionCount = 0;
								pObj.platform = pf.toLowerCase();
								pObj.updatedBy = null;
								pObj.updatedDate = null;
								mentionsArray.push(pObj);

							}
						});

					});
				} else {
					if (camps.platformNames.length != camps.userMentionSummarieList.length) {
						angular.forEach(camps.platformNames, function (pf, pf_i) {
							angular.forEach(camps.userMentionSummarieList, function (ment, ment_i) {

								if (pf.toLowerCase() != ment.platform.toLowerCase()) {

									var pObj = {};
									pObj.clientId = null;
									pObj.createdBy = null;
									pObj.createdDate = null;
									pObj.createdTime = null;
									pObj.handlerId = null;
									pObj.id = null;
									pObj.mentionCount = 0;
									pObj.platform = pf.toLowerCase();
									pObj.updatedBy = null;
									pObj.updatedDate = null;
									mentionsArray.push(pObj);

								}
							});
						});
					}
				}
				if (mentionsArray.length > 0) {
					angular.forEach(mentionsArray, function (men) {
						camps.userMentionSummarieList.push(men);
					})
				}

				if (postsArray.length > 0) {
					angular.forEach(postsArray, function (pos) {
						camps.platformReports.push(pos);
					})
				}




				var likeCount = 0;
				var shareCount = 0;
				var commentCount = 0;
				var postCount = 0;
				var islastIndex = false;
				if ($scope.campaignData.length == index + 1) {
					islastIndex = true;
				}
				geCampaigntSummaryReport(camps, islastIndex);
				angular.forEach(camps.platformReports, function (platforms, ind) {


					likeCount = likeCount + platforms.likeCount;
					shareCount = shareCount + platforms.shareCount;
					commentCount = commentCount + platforms.commentCount;
					postCount = postCount + platforms.postCount;


					if (platforms.platform.toLowerCase() == 'twitter') {
						var colColor = "#1dcaff";
					} else if (platforms.platform.toLowerCase() == 'facebook') {
						var colColor = "#3b5998";
					}

					stackArray.push({ 'name': platforms.platform, color: colColor, 'data': [platforms.likeCount, platforms.postCount, platforms.commentCount, platforms.shareCount], 'stack': camps.campaignName });

				});

				likesData.push([camps.campaignName, likeCount]);
				postData.push([camps.campaignName, postCount]);
				shareData.push([camps.campaignName, shareCount]);
				commentData.push([camps.campaignName, commentCount]);
				var aaa = [likeCount, postCount, shareCount, commentCount];
				angular.forEach(aaa, function(a){
						maxArray.push(a);
				});

				$scope.campLikesReport.push({ 'campaignId': camps.campaignId, 'campaignName': camps.campaignName, 'likes': likeCount, 'campObj': camps });
				$scope.campSharesReport.push({ 'campaignId': camps.campaignId, 'campaignName': camps.campaignName, 'share': shareCount, 'campObj': camps });
				$scope.campCommentsReport.push({ 'campaignId': camps.campaignId, 'campaignName': camps.campaignName, 'comments': commentCount, 'campObj': camps });
				$scope.campPostCountReport.push({ 'campaignId': camps.campaignId, 'campaignName': camps.campaignName, 'posts': postCount, 'campObj': camps });

				/**draw column graph*/
				/* var divId = "#camp" + (index + 1);
				$scope["camp_title" + (index + 1)] = camps.campaignName;
				$scope["camp_sDate" + (index + 1)] = camps.startDate;
				$scope["camp_eDate" + (index + 1)] = camps.endDate;
				$scope["camp_color" + (index + 1)] = colorArray[index]; */

				camps.graphPoints = [likeCount, postCount, commentCount, shareCount];
				
				/* $timeout(function () {
					$scope.drawColumnGraph(divId, camps, [likeCount, postCount, commentCount, shareCount], colorArray[index]);
				}, 100) */
				
				

			});
			
			localstorage.set("maxYAxis", Math.max.apply(Math, maxArray));
			
			angular.forEach($scope.campaignData, function (camps, index) {
				
				var divId = "#camp" + (index + 1);
				$scope["camp_title" + (index + 1)] = camps.campaignName;
				$scope["camp_sDate" + (index + 1)] = camps.startDate;
				$scope["camp_eDate" + (index + 1)] = camps.endDate;
				$scope["camp_color" + (index + 1)] = colorArray[index];
				
				$timeout(function () {
					$scope.drawColumnGraph(divId, camps, camps.graphPoints, colorArray[index]);
				}, 100);
			});
			
			//console.log("-------------------------$scope.campPostCountReport-------------------", $scope.campPostCountReport)
			//console.log("-------------------------stackArray-------------------", stackArray)
			//$scope.stackedGraph(stackArray);

			/*console.log("campLikesReport", $scope.campLikesReport)
			console.log("campSharesReport", $scope.campSharesReport)
			console.log("campCommentsReport", $scope.campCommentsReport)
			console.log("campPostCountReport", $scope.campPostCountReport)*/
			/*var a = 0, b = 0, c = 0, d = 0;
			angular.forEach($scope.campLikesReport, function (data) {
				if (data.likes != 0) {
					a++;
				}
			})
			angular.forEach($scope.campPostCountReport, function (data) {
				if (data.posts != 0) {
					b++;
				}
			})
			angular.forEach($scope.campCommentsReport, function (data) {
				if (data.comments != 0) {
					c++;
				}
			})
			angular.forEach($scope.campSharesReport, function (data) {
				if (data.share != 0) {
					d++;
				}
			})
		
			if (a > 0)
				$scope.drawStatsGraph("#likesData", "Likes", likesData, $scope.campLikesReport);
				
			if (b > 0)
				$scope.drawStatsGraph("#totalPostData", "Post", postData, $scope.campLikesReport);
				
			if (c > 0)
				$scope.drawStatsGraph("#commentsData", "Comments/Reply", commentData, $scope.campLikesReport);
				
			if (d > 0)
				$scope.drawStatsGraph("#sharesData", "Share/Retweet", shareData, $scope.campLikesReport);*/


			/**@author: Anjani Gupta
			 * @method: geCampaigntSummaryReport
			 * @desc: prepare data for bubble chart
			*/

			function geCampaigntSummaryReport(campaign, lastIndex = false) {
				var params = {
					'action': API_PATH + 'performance_campaign_' + campaign.campaignId
				};
				httpServices.getRequest(API_URL, params).then(function (data) {
					if (data.status == 200 && !helperFactory.isEmpty(data.data)) {
						console.log(data.data);
						/**prepare post data for bubble chart */
						var graphData = [];
						angular.forEach(data.data.postReportDtos, function (postDto) {
							var iconPlatform = "";
							var iconLike = "";
							var iconShare = "";
							if (postDto.platform.toLowerCase() == 'facebook') {
								iconPlatform = "fa fa-facebook ";
								iconLike = "fa fa-thumbs-up like";
								iconShare = "fa fa-share share";
							} else if (postDto.platform.toLowerCase() == 'twitter') {
								iconLike = "fa fa-heart heart";
								iconPlatform = "fa fa-twitter ";
								iconShare = "fa fa-retweet retweet";
							}
							graphData.push({ x: postDto.commentCount, y: postDto.likeCount, z: postDto.shareCount, name: postDto.description, platform: postDto.platform, iconPlatform: iconPlatform, iconLike: iconLike, iconShare: iconShare });
						})
						campaign.graphData = {
							name: campaign.campaignName,
							data: graphData,

							/*marker: {
								fillColor: {
									radialGradient: { cx: 0.4, cy: 0.3, r: 0.7 },
									stops: [
										[0, 'rgba(255,255,255,0.5)'],
										[1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0.5).get('rgba')]
									]
								}
							}*/
						};
						if (lastIndex) {
							var seriesData = [];
							$timeout(function () {

								angular.forEach($scope.campaignData, function (cd, indd) {
									console.log('dataa:: ', cd.graphData);
									cd.graphData.color = colorArray[indd];
									seriesData.push(cd.graphData);
								})

								$scope.drawBubbleChart(seriesData);
							}, 500)

						}
					}
				});
			}

		}).filter('unique', function () {
			return function (collection, keyname) {
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
			};
		});
});