/**
 * @author george.silva
 * created on 30.10.2017
 */
(function () {
    'use strict';

    angular
        .module('sga.resources')
        .factory('permissionResource', permissionResource);

    /** @ngInject */
    function permissionResource($resource, environment) {
        return $resource(environment.getApiRoute() + '/users/permissions', {},
        {query: {
            method: 'GET',
            responseType: 'json',
            isArray: false,
            transformResponse: function (response) {

                var permissions = {};
                
                angular.forEach(response.roles, function(element) {
                    permissions[element.name] = element.privileges;
                });

                console.log(permissions);

                return permissions;
            }
        }});
    }

})();