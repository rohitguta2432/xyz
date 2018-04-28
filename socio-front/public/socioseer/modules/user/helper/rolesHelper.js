/**
 * Role Management
 */
define([
    'angular',
    'angularRoute',
    'jquery',
], function (angular, angularRoute) {
    angular.module('socioApp.user.rolesHelper', ['socioApp.user.rolesHelper'])
        .factory('rolesHelper', function (localstorage, $location, httpServices, $timeout, helperFactory) {
            var rolesHelper = {};
            /**
            * @method get All Roles & permissions
            */
            rolesHelper.getAllRolesPermissions = function () {
                if (helperFactory.checkKeysExists('userRolePermissions')) {
                    var allRoles = JSON.parse(localstorage.get('userRolePermissions'));
                    return allRoles;
                }
            }
            /**
            * @method get user's access level
            */
            rolesHelper.getUSerAccessLevel = function () {
                if (typeof localstorage.get('userAccessLevel') != 'undefined') {
                    return localstorage.get('userAccessLevel');
                }
            }

            /**
             * @method Get Roles
             */
            rolesHelper.getRoleKey = function ($key) {
                var allRoles = this.getAllRolesPermissions();
                if (typeof allRoles != 'undefined')
                    for (var i = 0, len = allRoles.length; i < len; i++) {
                        if (allRoles[i].name === $key) {
                            return allRoles[i];
                        }
                    }
            }

            rolesHelper.roleAccess = function (_role) {
                var roleKey = this.getRoleKey(_role);

                var resultObject = {
                    GET: false,
                    POST: false,
                    PUT: false,
                    DELETE: false
                }
                if (typeof roleKey != 'undefined' && roleKey.permissions.length) {
                    if (roleKey.permissions.indexOf('GET') >= 0) {
                        resultObject.GET = true;
                    }
                    if (roleKey.permissions.indexOf('POST') >= 0) {
                        resultObject.POST = true;
                    }
                    if (roleKey.permissions.indexOf('PUT') >= 0) {
                        resultObject.PUT = true;
                    }
                    if (roleKey.permissions.indexOf('DELETE') >= 0) {
                        resultObject.DELETE = true;
                    }
                }
                return resultObject;
            }

          
            /**
             * @method check GET permission
             */
            rolesHelper.canView = function (role) {
                var _role = rolesHelper.getRoleKey(role);
                if (typeof _role != 'undefined' && _role.permissions.length) {
                    if (_role.permissions.indexOf('GET') >= 0) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            }
            /**
             * @method check EDIT permission
             */
            rolesHelper.canEdit = function (role) {
                var _role = rolesHelper.getRoleKey(role);
                if (typeof _role != 'undefined' && _role.permissions.length) {
                    if (_role.permissions.indexOf('PUT') >= 0) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            }
            /**
             * @method check POST permission
             */
            rolesHelper.canCreate = function (role) {
                var _role = rolesHelper.getRoleKey(role);
                if (typeof _role != 'undefined' && _role.permissions.length) {
                    if (_role.permissions.indexOf('POST') >= 0) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            }
            /**
             * @method check POST permission
             */
            rolesHelper.canDelete = function (role) {
                var _role = rolesHelper.getRoleKey(role);
                if (typeof _role != 'undefined' && _role.permissions.length) {
                    if (_role.permissions.indexOf('DELETE') >= 0) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            }
            return rolesHelper;
        })
});