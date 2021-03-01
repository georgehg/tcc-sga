/**
 * @author george.silva
 * created on 09.11.2017
 */
(function () {
    'use strict';

    angular
        .module('sga.services')
        .factory('userService', userService);

    /** @ngInject */
    function userService($window, $q, notifyService, authenticationResource, permissionResource) {

        var _identity = undefined;
        var _permissionsPromise = undefined;
        var _sessionTimeToLive = 60 * 30 * 1000; // 60s x 30min x 1000ms

        return {
            authenticate: authenticate,
            getIdentity: getIdentity,
            isAuthenticated: isAuthenticated,
            hasPermission: hasPermission,
            checkPermission: checkPermission,
            hasAnyPermission: hasAnyPermission,
            hasPrivilege: hasPrivilege,
            logout: logout
        }

        function authenticate(credentials) {

            return authenticationResource.authenticate(credentials
                ,authenticateComplete
                ,authenticateFailed
            )

            function authenticateComplete(result) {
                $window.localStorage.sga_user = result.email;
                $window.localStorage.sga_role = result.role;
                $window.localStorage.sga_name = result.name;
                $window.localStorage.sga_area = result.area;

                _setIdentity();
                _setExpirationTime();
            }

            function authenticateFailed(error) {
                console.log(error);
                return error;
            }
        }

        function getIdentity() {

            if (_isSessionExpired()) {
                return undefined;
            }

            _setExpirationTime();
            
            if (! isAuthenticated()) {
                return undefined;
            }

            if (! _identity) {
                _setIdentity();
            }

            return _identity;
        }

        function isAuthenticated() {
            if (! $window.localStorage.sga_user) {
                return false;
            }

            return true;
        }

        function _setIdentity() {
            _identity = {
                user: $window.localStorage.sga_user,
                role: $window.localStorage.sga_role,
                name: $window.localStorage.sga_name,
                area: $window.localStorage.sga_area,                
            }
        }

        function _setExpirationTime() {
            var now = new Date();
            $window.localStorage.sga_expireTime = now.setTime(now.getTime() + _sessionTimeToLive);
        }

        function _isSessionExpired() {
            if (! $window.localStorage.sga_expireTime) {
                notifyService.notify('session-expired');
                return true;
            }

            var now = new Date();
            var expireTime = new Date(parseInt($window.localStorage.sga_expireTime));
            if (now >= expireTime) {
                notifyService.notify('session-expired');
                return true;
            }

            return false;
        }

        function checkPermission(permission) {

            if (_isSessionExpired()) {
                return false;
            }

            _setExpirationTime();

            if (! _permissionsPromise) {
                return false;
            }
        
            if (! permission) {
                return false;
            }

            return _permissionsPromise.toJSON()[permission] ? true : false;
        }        

        function hasPermission(permission) {

            _getPermissions();

            if (_permissionsPromise && _permissionsPromise.$promise) {

                return _permissionsPromise.$promise
                    .then(function(userPermissions) {

                        if (_isSessionExpired()) {
                            return false;
                        }

                        _setExpirationTime();

                        if (! permission) {
                            return false;
                        }

                        return userPermissions.toJSON()[permission] ? true : false;
                    }
                    ,function(error) {
                        return false;
                    })
            } else {
                return $q.resolve(false);
            }
        }

        function hasAnyPermission(permissions) {

            _getPermissions();

            if (_permissionsPromise && _permissionsPromise.$promise) {
                return _permissionsPromise.$promise
                    .then(function(userPermissions) {

                        if (_isSessionExpired()) {
                            return false;
                        }

                        _setExpirationTime();
                        
                        if (! permissions) {
                            return false;
                        }

                        if (Object.keys(userPermissions.toJSON()).length == 0) {
                            return false;
                        }

                        if (permissions.length == 0) {
                            return true;
                        }

                        for (var i = 0; i < permissions.length; i++) {
                            if (userPermissions.toJSON()[permission]) {
                                return true;
                            }
                        }
                
                        return false;
                    }
                    ,function(error) {
                        return false;
                    })
            } else {
                return $q.resolve(false);
            }
        }

        function hasPrivilege(permission, privilege) {
             if (_isSessionExpired()) {
                return false;
            }

            _setExpirationTime();

            if (! _permissionsPromise) {
                return false;
            }
        
            if (! privilege) {
                return false;
            }

            var hasPrivilege = _permissionsPromise.toJSON()[permission] &&
                            _permissionsPromise.toJSON()[permission].indexOf(privilege) != -1;

            return hasPrivilege;
        }

        function _getPermissions() {
            
            if (isAuthenticated() && ! _permissionsPromise) {
                    
                var params = {};
                var identity = getIdentity();

                if (!identity) {
                    _permissionsPromise = undefined;
                    return;
                }

                params.role = getIdentity().role;

                _permissionsPromise = permissionResource.query(params
                    ,getPermissionsComplete
                    ,getPermissionsFailed
                );
                
                function getPermissionsComplete(permissions) {
                    return permissions;
                }

                function getPermissionsFailed(error) {
                    console.log(error);
                    return error;
                }
            }

        };

        function logout() {
            _identity = undefined;
            _permissionsPromise = undefined;
            delete $window.localStorage.sga_user;
            delete $window.localStorage.sga_role;
            delete $window.localStorage.sga_name;
            delete $window.localStorage.sga_area;
            delete $window.localStorage.sga_expireTime;
        }
        
    };

})();