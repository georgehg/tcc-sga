/**
 * @author george.silva
 * created on 05.01.2018
 */
(function () {
  'use strict';

    angular
    .module('sga.pages.pendencias')
    .component('pendenciasTableDetail', {
        
        controllerAs: 'vm',

        bindings: {
            stateMachine: '<',
            pendencia: '<'
        },

        templateUrl: 'app/pages/pendencias/pendencias-table-detail-template.html',
        
    });
    
})();
