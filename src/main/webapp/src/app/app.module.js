'use strict';

angular
  .module('sga', [
    'toastr',
    'ngAnimate',
    'ngSanitize',
    'ngTouch',
    'ngJsTree',
    'ngMap',
    'ngCookies',
    'ui.bootstrap',
    'ui.sortable',
    'ui.router',
    'ui.select',
    'ui.slimscroll',
    'angular.filter',
    'angular-progress-button-styles',
    'smart-table',
    'mj.scrollingTabs',
    'ngPlacesAutocomplete',

    'BlurAdmin.theme',

    'sga.auth',
    'sga.components',
    'sga.constants',
    'sga.directives',
    'sga.filters',
    'sga.modals',
    'sga.pages',
    'sga.resources',
    'sga.services'])
  
  .config(appConfig)
  .run(appRun);

  /** @ngInject */
  function appConfig($stateProvider, $urlRouterProvider, $locationProvider, toastrConfig) {

    $stateProvider
        .state('app', {
          url: '/app',
          templateUrl : 'app.html',
          resolve: {
            appPermission: function(userService) {
                return userService.hasAnyPermission([]).$promise;
              }
          }
        })
        .state('404', {
          url: '/404',
          templateUrl :'404.html'
        });

    // Default state
    $urlRouterProvider.otherwise('/app');

    // use the HTML5 History API
    $locationProvider.html5Mode(true);

    //Global configurations for toastr notifications
    angular.extend(toastrConfig, {
      newestOnTop: true,
      positionClass: 'toast-top-center'
    });

  };

  /** @ngInject */
  function appRun($trace, $rootScope, $transitions, $state, $stateParams, userService, notifyService, toastr, editableOptions) {

    // Trace log for $state transitions
    $trace.enable('TRANSITION');

    // Listen for logout event
    notifyService.subscribe($rootScope, 'logout', function() {
      userService.logout();
      $state.go('logout');
    });

    // Listen for session-expired event
    notifyService.subscribe($rootScope, 'session-expired', function() {
      toastr.warning('Por favor, faça o login novamente na aplicação.', 'A sua sessão expirou!');
      userService.logout();
      $state.go('login');
    });

    // Listen for App on App load event
    notifyService.subscribe($rootScope, 'on-app-load-start', function() {
      $rootScope.$onAppLoad = true;
    });

    // Listen for App on App load event
    notifyService.subscribe($rootScope, 'on-app-load-finish', function() {
      $rootScope.$onAppLoad = false;
    });

    $transitions.onStart({}, function(transition) {

      // states onTransition events used by pre-loader spinner
      notifyService.notify('on-app-load-start');
      transition.promise.finally(function(){
         notifyService.notify('on-app-load-finish');
      });           

    });

    $transitions.onBefore({}, function(transition) {

      // the root state is safe once user is authenticated
      if (transition.to().name == 'app')  {

        if (!userService.isAuthenticated()) {
          return transition.router.stateService.target('login');
        };

        return userService.hasAnyPermission([])
          .then(function(hasAccess) {
            if (!hasAccess) {
              toastr.warning('Parece que você não tem permissão para acessar o SGA.', 'Usuário sem permissão!');
              userService.logout();
              return transition.router.stateService.target('login');
            } else {

              if (userService.checkPermission("policies")) {
                return transition.router.stateService.target('app.policies');
              }

              return true;

            }
            
          }
          ,function(error) {
            return false;
          });
      }

      // check if user isAuthenticated on login page
      if (transition.to().name == 'login' && userService.isAuthenticated()) {
        // redirect to the 'app' state
        return transition.router.stateService.target('app');
      }      

      if (transition.to().name.startsWith('app.') && !userService.isAuthenticated()) {
        // redirect to the 'login' state
        toastr.error('Por favor, faça o seu login na aplicação.', 'Você não está conectado!');
        return transition.router.stateService.target('login');
      }
      
      // check if the state should be protected
      if (transition.to().name.startsWith('app.') && transition.to().protected) {

        var stateName = transition.to().name;
        if (transition.to().name.startsWith('app.')) {
          stateName = transition.to().name.split('app.')[1];
        }

        // Adiciona parametros à string de state
        angular.forEach(transition.to().protectParams, function(param) {
          stateName = stateName.concat(".", transition.params()[param]);
        });

        return userService.hasPermission(stateName)
          .then(function(permited) {
            if (!permited) {
              toastr.warning('Parece que você não tem permissão para acessar este conteúdo.', 'Conteúdo não permitido!');
              return transition.router.stateService.target('app');
            }
            return true;
          }
          ,function(error) {
            toastr.danger('Aconteceu algum erro ao acessar este conteúdo.', 'Conteúdo não permitido!');
            return transition.router.stateService.target('app');
          });
      }

    });

  };

