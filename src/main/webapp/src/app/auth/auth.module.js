/**
 * @author george.silva
 * created on 31.10.2017
 */
(function () {
  'use strict';

  angular
    .module('sga.auth', [])
    .config(authConfig);

  /** @ngInject */
  function authConfig($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.when('/logout', '/login');

    $stateProvider
        .state('login', {
          url: '/login',
          component: 'login',
          resolve: {
            previousState: function($state) {
              return {
                name: $state.current.name,
                params: angular.copy($state.params)
              }
            }
          }
        })
        .state('logout', {
          url: '/logout'
        })        
        .state('access', {
          url: '/acesso',
          component: 'access'
        });    

  }

})();