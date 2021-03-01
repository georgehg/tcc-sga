/**
 * @author george.silva
 * created on 20.12.2017
 */
(function () {
  'use strict';

  angular
    .module('sga.pages.pendencias', [])
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('app.pendencias', {
          url: '/pendencias',
          title: 'Minhas Pendências',
          protected: true,
          component: 'pendenciasTable',
          sidebarMeta: {
            icon: 'ion-ios-bell',
            order: 100,
          },
          resolve: {
            stateMachine: function(cotacaoFSMService) {
              return cotacaoFSMService.getCotacoesStateMachine();
            },
            pendenciasTableData: function(logedUser, dataService) {
              return dataService.getPendencias({id: logedUser.name, area: logedUser.area}).$promise;
            },
            logedUser: function(userService) {
              return userService.getIdentity();
            }
          }
        })
  }

})();