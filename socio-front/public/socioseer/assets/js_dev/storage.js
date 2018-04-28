/**
 * Storage JS
 * @author Gaurav Sirauthiya <sirauthiya.gaurav@orangemantra.in>
 * @since March,25 2017
 * @version 1.0.0
 */

define([
	'angular',
	'angularRoute'
], function (angular, angularRoute) {
	angular.module('socioApp.localStorageFactory', [])
		.factory('localstorage', function ($window) {
			return {
				set: function (key, value) {
					$window.localStorage[key] = value;
				},
				get: function (key, defaultValue) {
					return $window.localStorage[key] || defaultValue;
				},
				setObject: function (key, value) {
					$window.localStorage[key] = JSON.stringify(value);
				},
				getObject: function (key) {
					return JSON.parse($window.localStorage[key] || '{}');
				},
				delete: function (key) {
					return $window.localStorage.removeItem(key);
				}
			}
		});

});
var __Css = [
	"color: #2e2e2e; font-size:21px; font-style:italic;font-family:'Monotype Corsiva'",
	"color: #1195ce; font-size:23px;font-style:italic; font-family:'Monotype Corsiva'"
]
if (typeof __c != 'undefined') {
	setTimeout(__c.info.bind(__c, "%cW" + "e" + "l" + "c" + "o" + "m" + "e" + " t" + "o " + "%cS" + "o" + "c" + "i" + "o" + "s" + "e" + "e" + "r" + " O" + "u" + "t" + "r" + "e" + "a" + "c" + "h" + " !" + "", __Css[0], __Css[1]));
}