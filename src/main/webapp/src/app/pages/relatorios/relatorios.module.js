/**
 * @author george.silva
 * created on 06.10.2017
 */
(function () {
  'use strict';

  angular
    .module('sga.pages.relatorios', [
      
      'ui.grid',
      'ui.grid.grouping',
      'ui.grid.selection',
      'ui.grid.cellNav',
      'ui.grid.exporter'
      
    ])
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {

    $stateProvider
        .state('app.relatorios', {
          url: '/relatorios',
          template : '<ui-view autoscroll="true" autoscroll-body-top></ui-view>',
          abstract: true,
          title: 'Relatórios',
          protected: true,
          sidebarMeta: {
            icon: 'ion-clipboard',
            order: 100,
          }
        })
        .state('app.relatorios.pendencias-prevenda', {
          url: '/pendencias-prevenda',
          title: 'Pendências Pré-Venda',
          component: 'relatorioPendenciasPrevenda',
          protected: true,
          sidebarMeta: {
            order: 0
          }
        });

  }

})();