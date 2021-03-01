/**
 * @author george.silva
 * created on 22.11.2017
 */
(function () {
    'use strict';

    angular
        .module('sga.services')
        .factory('notifyService', notifyService);

    /** @ngInject */
    function notifyService($rootScope) {

        return {
            subscribe: subscribe,
            notify: notify
        }

        function subscribe(scope, event, callback) {
            var handler = $rootScope.$on(event, callback);
            scope.$on('$destroy', handler);
        }

        function notify(event) {
            $rootScope.$emit(event);
        }
        
    };

})();