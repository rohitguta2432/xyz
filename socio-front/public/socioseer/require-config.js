'use strict';
var _jsdir = "js_dev";
const __c = console;
require.config({
	urlArgs: "bust=" + (new Date()).getTime(),
	waitSeconds: 200,
	paths: {
		jquery: 'assets/' + _jsdir + '/lib/jquery-2.1.1',
		/*jqueryUI: 'assets/' + _jsdir + '/lib/jquery-ui',*/
		fileUploadShim: 'assets/' + _jsdir + '/lib/ng-file-upload-shim.min',
		datepicker: 'assets/' + _jsdir + '/angular-datepicker',
		angular: 'assets/' + _jsdir + '/lib/angular.min.1.6',
		angularRoute: 'assets/' + _jsdir + '/lib/angular-ui-router',
		constant: 'assets/' + _jsdir + '/constant',
		helper: 'assets/' + _jsdir + '/helper',
		storage: 'assets/' + _jsdir + '/storage',
		app: 'assets/' + _jsdir + '/app',
		bootstrap: 'assets/' + _jsdir + '/lib/bootstrap.min',
		pace: 'assets/' + _jsdir + '/lib/pace.min',
		services: 'assets/' + _jsdir + '/services',
		fileUpload: 'assets/' + _jsdir + '/lib/ng-file-upload.min',
		validator: 'assets/' + _jsdir + '/lib/angular-validator',
		ngSanitize: 'assets/' + _jsdir + '/lib/angular-sanitize',
		clipboard: 'assets/' + _jsdir + '/lib/clipboard.min',
		ngclipboard: 'assets/' + _jsdir + '/lib/ngclipboard',
		datetimepicker: 'assets/' + _jsdir + '/lib/datetimepicker',
		datetimepickerTemplate: 'assets/' + _jsdir + '/lib/datetimepicker.templates',
		moment: 'assets/' + _jsdir + '/lib/moment.min',
		clientHelper: 'modules/client/helper/clientHelper',
		userHelper: 'modules/user/helper/userHelper',
		rolesHelper: 'modules/user/helper/rolesHelper',
		outreachHelper: 'modules/outreach/helper/outreachHelper',
		tagInputs: 'assets/' + _jsdir + '/lib/ng-tags-input',
		ngAnimateJs: 'assets/' + _jsdir + '/lib/angular-animate.min',
		ngVerticalMenu: 'assets/' + _jsdir + '/lib/angular-vertical-menu',
		ngImageGallery: 'assets/' + _jsdir + '/lib/ng-image-gallery.min',
		angularBootstrapLightbox: 'assets/' + _jsdir + '/lib/angular-bootstrap-lightbox.min',
		uiBootstrap: 'assets/' + _jsdir + '/lib/ui-bootstrap-tpls',
		calender: 'assets/' + _jsdir + '/lib/calender/calendar',
		fullcalendar: 'assets/' + _jsdir + '/lib/calender/fullcalendar.min',
		gcal: 'assets/' + _jsdir + '/lib/calender/gcal',
		highChart: 'assets/' + _jsdir + '/lib/highcharts',
		highChartMore: 'assets/' + _jsdir + '/lib/highcharts-more',
		ngAuth: 'assets/' + _jsdir + '/lib/oauth-signature',
		loader: 'assets/' + _jsdir + '/lib/loading-bar.min',
		audienceHelper: 'modules/audience/helper/audienceHelper',
		settingsHelper: 'modules/settings/helper/settingsHelper',
		socialHelper: 'modules/outreach/helper/socialHelper',
		contentHelper: 'modules/content/helper/contentHelper',
		composePostHelper: 'modules/outreach/helper/composePostHelper',
		composePostController: 'modules/outreach/controllers/composePostController',
		summaryController: 'modules/outreach/controllers/summaryController',
		eventController: 'modules/outreach/controllers/eventController',
		campaignController: 'modules/outreach/controllers/campaignController',
		teamController: 'modules/user/controllers/teamController',
		roleController: 'modules/user/controllers/roleController',
		bootstrapDate: 'assets/' + _jsdir + '/lib/datetime-picker.min',
		ngMultiSelect: 'assets/' + _jsdir + '/lib/angular-bootstrap-multiselect',
		angularMultiSelect: 'assets/' + _jsdir + '/lib/angularjs-dropdown-multiselect.min',
		mailhuScrollBar: 'assets/' + _jsdir + '/lib/jquery.mCustomScrollbar.concat.min',
		srcollbar: 'assets/' + _jsdir + '/lib/scrollbars.min',
		checkBoxSelection: 'assets/' + _jsdir + '/lib/checklist-model',
	},
	shim: {
		'angular': {
			'exports': 'angular',
			deps: ['fileUploadShim', 'jquery']
		},
		'multiselect': {
			deps: ['jquery']
		},
		'angularRoute': {
			deps: ['angular'],
		},
		/*'uitinymce': {
			deps: ['angular']
		},*/
		'fileUpload': {
			deps: ['angular'],
		},
		'bootstrap': {
			deps: ['jquery'],
		},
		'mentis': {
			deps: ['jquery'],
		},
		'pace': {
			deps: ['jquery'],
		},
		'datepicker': {
			deps: ['angular'],
		},
		
		'validator': {
			deps: ['angular'],
		},
		/*'jqueryUI': {
			deps: ['jquery'],
		},*/

		'ngclipboard': {
			deps: ["angular", "clipboard"],
		},
		'datetimepickerTemplate': {
			deps: ['angular', 'datetimepicker'],
		},
		'ngSanitize': {
			deps: ['angular']
		},
		'tagInputs': {
			deps: ['angular']
		},
		'ngVerticalMenu': {
			deps: ['angular']
		},
		'ngAnimateJs': {
			deps: ['angular']
		},
		'services': {
			deps: ['angular']
		},
		'storage': {
			deps: ['angular']
		},
		'ngImageGallery': {
			deps: ['angular', 'ngAnimateJs']
		},
		'calender': {
			deps: ['angular', 'jquery', 'moment']
		},
		'fullcalendar': {
			deps: ['moment']
		},
		'gcal': {
			deps: ['calender']
		},
		'highChart': {
			deps: ['angular']
		},
		'highChartMore': {
			deps: ['highChart']
		},
		'loader': {
			deps: ['angular']
		},
		'uiBootstrap': {
			deps: ['angular']
		},
		'angularBootstrapLightbox': {
			deps: ['angular', 'uiBootstrap']
		},
		'bootstrapDate': {
			deps: ['angular']
		},
		'ngMultiSelect': {
			deps: ['angular']
		},
		'angularMultiSelect': {
			deps: ['angular']
		},
		'mailhuScrollBar': {
			deps: ['jquery']
		},
		'srcollbar': {
			deps: ['angular']
		},
		'checkBoxSelection':{
			deps: ['angular']
		}
	},
	priority: [
		'jquery',
		'moment',
		'ngAuth',
		'fileUploadShim',
		'angular',
		'fileUpload',
		'bootstrap',
		'pace',
		'constant',
		'app',
		'helper',
		'storage',
		'datepicker',
		'datetimepicker',
		'datetimepickerTemplate',
		'tagInputs',
		'ngAnimateJs',
		'ngImageGallery',
		'calender',
		'fullcalendar',
		'gcal',
		'highChart',
		'ngMultiSelect',
		'angularMultiSelect',
		'srcollbar',
		'mailhuScrollBar',
		'ngVerticalMenu',
		'rolesHelper',
		'userHelper'
	]

});

require(['clipboard'], function (clipboard) {
	window.Clipboard = clipboard;
});
require([
	'angular',
	'app'
], function (angular, app) {
	var $html = angular.element(document.getElementsByTagName('html')[0]);
	angular.element().ready(function () {
		angular.bootstrap(document, ['socioApp']);
	});

});