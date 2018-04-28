/**
 * @author Gaurav Sirauthiya
 */
angular.module('angularVerticalMenu', []);

'use strict';

angular.module('angularVerticalMenu').directive('verticalMenu', VerticalMenu);

/**
 * 
 * 
 */
function VerticalMenu() {

	function compile(element, attributes) {

		var height = element.find('li')[1].offsetHeight;
		return {
			post: function postLink(scope, iElement, iAttrs, controller) {
				if (controller.config.animation) {
					controller.setupAnimation(height);
				}
			}
		};
	}

	var ddo = {
		restrict: 'EA',
		replace: true,
		scope: {
		},
		controller: VerticalMenuController,
		controllerAs: 'vm',
		bindToController: {
			id: '@',
			config: '='
		},
		templateUrl: 'templates/angular-vertical-menu.directive.html',
		compile: compile
	};
	return ddo;
}

VerticalMenuController.$inject = ['$rootScope', '$location'];

/**
 * 
 * @param $scope
 * @param $location
 * @param $timeout
 */
function VerticalMenuController($rootScope, $location) {

	var vm = this;
    /**
     * Default bullet icon associated with the second level items with no
     * specified icon
     */
	vm.DEFAULT_BULLET_ICON = 'fa-circle-o';

	var DEFAULT_ANIMATION = {
		duration: 0.4,
		timing: 'ease'
	}

	function getKeyframesRules(item, height, id) {
		var height = height * item.children.length;
		var expandRule = '@-webkit-keyframes expand-' + id + ' { from { max-height: 0px; } to { max-height: ' + height + 'px; } } \
    		    @keyframes expand-' + id + ' { from { max-height: 0px; } to { max-height: ' + height + 'px; } }';
		var collapseRule = '@-webkit-keyframes collapse-' + id + ' { from { max-height: ' + height + 'px; } to { max-height: 0px; } } \
    		    @keyframes collapse-' + id + ' { from { max-height: ' + height + 'px; } to { max-height: 0px; }}';
		return expandRule + collapseRule;
	};

	function getAnimationRules(id) {
		var animation = angular.copy(DEFAULT_ANIMATION);
		if (angular.isObject(vm.config.animation)) {
			animation = angular.extend({}, animation, vm.config.animation);
		}
		return 0;
	}

	vm.setupAnimation = function (height) {
		var styleElt = document.createElement('style');
		styleElt.type = 'text/css';
		var items = vm.config.data;
		var head = document.head || document.getElementsByTagName('head')[0];
		var css, item, id = null;
		for (var i = 0; i < items.length; i++) {
			item = items[i];
			if (item.children && item.children.length > 0) {
				id = vm.getId(i);
				styleElt.appendChild(document.createTextNode(getAnimationRules(id)));
				css = getKeyframesRules(items[i], height, id);
				styleElt.appendChild(document.createTextNode(css));
			}
		}
		head.appendChild(styleElt);
	};
    /**
     * 
     */
	vm.toggle = function (event, item, $index) {
		
		if (!item.href) {
			var dataArray = vm.config.data;
			var targets = [];
			for (var i = 0; i < dataArray.length; i++) {
				if (i != $index) {
					targets.push(i);
				}
			}
			if (targets.length) {
				angular.forEach(targets, function (element) {
					dataArray[element].active = false;
				});
			}
		}
	
		event.stopPropagation();

		if (vm.hasChildren(item)) {
			item.active = !item.active;
		} else if (item.href) {
			$rootScope.$evalAsync(function () {
				$location.path(item.href);
			});
		} else if (item.callback) {
			item.callback(item);
		}
		return false;
	};


	/**
	 * 
	 */
	vm.toggleChild = function (event, item, $index, parent) {
		if (item.href == 'composePost') {
			localStorage.removeItem('currentPost');
			localStorage.removeItem('isPostEdit');
		}
		event.stopPropagation();
		var dataArray = parent.children;

		var targets = [];
		for (var i = 0; i < dataArray.length; i++) {
			if (i != $index) {
				targets.push(i);
			}
			if (targets.length) {
				angular.forEach(targets, function (element) {
					dataArray[element].active = false;
				});
			}
		}



		if (vm.hasChildren(item)) {
			/*item.active = !item.active;*/
		} else if (item.href) {
			$rootScope.$evalAsync(function () {
				$location.path(item.href);
				if(!item.active){
					item.active = true;
				}
			});
		} else if (item.callback) {
			item.callback(item);
		}
		return false;
	};

    /**
     * Returns <code>true</code> if the specified item has some children,
     * <code>false</code> otherwise.
     * 
     * @param {Object}
     *                item - A menu item.
     * @returns {boolean} <code>true</code> if the item has some children,
     *          <code>false</code> otherwise
     */
	vm.hasChildren = function (item) {
		return !!item.children;
	};

    /**
     * Returns the icon associated with the specified item or if none exists the
     * default bullet icon value.
     * 
     * @param {Object}
     *                item - A menu item.
     * @returns {string} the icon associated with the item
     */
	vm.getItemIcon = function (item) {
		return item.icon || vm.getDefaultIcon();
	};

    /**
     * Returns the default bullet icon specified by the
     * <code>config.default.icon</code> property or if none is specified the
     * internally defined default bullet icon.
     * 
     * @returns {string} the default bullet icon
     */
	vm.getDefaultIcon = function () {
		var icon = vm.DEFAULT_BULLET_ICON;
		if (vm.config.default && vm.config.default.icon) {
			icon = vm.config.default.icon;
		}
		return icon;
	};
    /**
     * 
     */
	vm.getId = function (index) {
		var id = vm.id || '';
		id += index;
		return id;
	}
}


angular.module("angularVerticalMenu").run(["$templateCache", function ($templateCache) {
	$templateCache.put("templates/angular-vertical-menu.directive.html", "<ul class=vertical-menu><li class=treeview ng-class=\"{\'active\' : item.active}\" ng-repeat=\"item in vm.config.data track by $index\"><a ng-href ng-click=\"vm.toggle($event, item,$index)\"><i class=\"fa {{::item.icon}}\"></i> <span class='span'>{{::item.label}}</span> <span class=\"pull-right badge {{item.badge.context}}\" ng-if=item.badge>{{item.badge.value || item.badge}}</span> <span class=\"span fa pull-right\" ng-class=\"{\'fa-angle-right\' : !item.active, \'fa-angle-down\' : item.active}\" ng-if=vm.hasChildren(item)></span></a><ul class=\"treeview-menu sbm-collapse sbm-collapse-{{::vm.getId($index)}}\" ng-class=\"{\'visible\' : vm.hasChildren(item) && item.active}\"><li class=child level-2 ng-class=\"{\'active\' : child.active}\" ng-repeat=\"child in item.children track by $index\"><a ng-href ng-click=\"vm.toggleChild($event, child,$index , item);\"><i class=\"fa {{::vm.getItemIcon(child)}}\"></i><span class='ml20px'>{{::child.label}}</span><span class=\"fa pull-right\" ng-class=\"{\'fa-angle-right\' : !child.active, \'fa-angle-down\' : child.active}\" ng-if=vm.hasChildren(child)></span>\
</a> <ul class=\"treeview-menu sbm-collapse-{{::vm.getId($index)}}\"  ng-class=\"{\'visible\' : vm.hasChildren(child) && child.active}\"><li class=childs level-3 ng-class=\"{\'active\' : childs.active}\" ng-repeat=\"childs in child.children track by $index\"><a ng-href ng-click=\"vm.toggleChild($event, childs,$index, child);\"><i class=\"fa {{::vm.getItemIcon(childs)}}\"></i><span class='ml20px'>{{::childs.label}}</span></a></li></ul></li></ul></li></ul>");
}]);