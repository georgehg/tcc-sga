/**
 * @author george.silva
 * created on 31.10.2017
 */
(function () {
    'use strict';

    angular
        .module('sga.resources')
        .factory('authenticationResource', authenticationResource);

    /** @ngInject */
    function authenticationResource($resource, environment) {

        const params = {
            user: '@user',
            password: '@password'
        };

        return $resource(environment.getApiRoute() + '/users/authenticate', {}, {
            authenticate: {
                method: 'POST',
                responseType: 'json',
                isArray: false
            },
            params: params,
        });
    }

})();