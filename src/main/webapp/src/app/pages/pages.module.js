/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular
    .module('sga.pages', [

      'BlurAdmin.pages.dashboard',

      'sga.pages.relatorios',
      'sga.pages.pendencias',
      'sga.pages.cotacoes'
      
  ]);
    
})();
