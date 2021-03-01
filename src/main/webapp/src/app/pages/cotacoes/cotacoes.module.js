/**
 * @author george.silva
 * created on 01.09.2017
 */
(function () {
  'use strict';

  angular
    .module('sga.pages.cotacoes', [])
    .config(routeConfig)
    .run(googleAPI)
    .run(routeUser);

  /** @ngInject */
  function routeConfig($stateProvider) {
    
    $stateProvider
        .state('app.cotacoes', {
          url: '/cotacoes',
          template : '<ui-view autoscroll="true" autoscroll-body-top></ui-view>',
          title: 'Cotações',
          protected: true,
          resolve: {
            cotacoesStateMachine: function(cotacaoFSMService) {
              return cotacaoFSMService.getCotacoesStateMachine().$promise;
            }
          },
          sidebarMeta: {
            icon: 'ion-social-usd',
            order: 200,
          },          
        })
        
        .state('app.cotacoes.esteira', {
          url: '/esteira',
          title: 'Cotações',
          component: 'cotacoesBoard',
          protected: true,
          resolve: {
            statesPool: function(dataService) {
                return dataService.getCotacoesStatus().$promise;
              }
          }
        })

        .state('app.cotacoes.esteira.criar', {
          url: '/criar',
          templateUrl: 'app/pages/cotacoes/criar-cotacao-options-template.html',
          title: 'Criar Cotações',
          protected: true
        })
        
        .state('app.cotacoes.esteira.status', {
          url: '/:status',
          component: 'cotacoesTable',
          protected: true,
          protectParams: ['status'],
          resolve: {
            stateMachine: function($stateParams, cotacaoFSMService) {
              return cotacaoFSMService.getStateMachine($stateParams.status);
            },
            cotacoesTableData: function($stateParams, dataService) {
              return dataService.getCotacoes({status: $stateParams.status}).$promise;
            }
          },
        })
        
        .state('app.cotacoes.cotacao', {
          url: '/cotacao/:id',
          title: 'Cotação',
          component: 'cotacao',
          protected: true,
          resolve: {
            stateMachine: function(cotacao, cotacaoFSMService) {
              return cotacaoFSMService.getStateMachine(cotacao.status);
            },
            usuario: function(cotacao, dataService) {
              return dataService.getUser({email: cotacao.modificado_por}).$promise
                      .then(function(usuario){
                        return usuario[0];
                      });
            },
            projeto: function(servico, dataService) {
              if (!servico){
                return dataService.getProjeto();
              }
              return dataService.getProjeto(servico.projeto_id).$promise;
            },
            servico: function(cotacao, dataService) {
              return dataService.getOutrosServicos(cotacao.id_concentrador).$promise;
            },
            cotacao: function($stateParams, dataService) {
              return dataService.getCotacao($stateParams.id).$promise;
            }
          }
        })

        .state('app.cotacoes.criar', {
          url: '/criar/:template',
          title: 'Criar Cotações',
          component: 'criarCotacao',
          protected: true,
          protectParams: ['template']
        });       

  };  

  /** @ngInject */
  function googleAPI($filter) {

    var script = document.createElement("script");
    script.type = "text/javascript";

    var CurrentDate = $filter('date')(new Date(),'HH');
    if (CurrentDate >= 0 && CurrentDate <= 9) {
      script.src = "https://maps.googleapis.com/maps/api/js?v=3&key=AIzaSyDOnRVXSEqeLKxW44Gxt8xpsIl1lX567lk&libraries=places";
    } else if (CurrentDate > 9 && CurrentDate <= 11) {
      script.src = "https://maps.googleapis.com/maps/api/js?v=3&key=AIzaSyDxi5GkZ6eHJ2WeQcnk7oHSSnjQswtZrzU&libraries=places";
    } else if (CurrentDate > 11 && CurrentDate <= 13) {
      script.src = "https://maps.googleapis.com/maps/api/js?v=3&key=AIzaSyBKE9EoyXmJ5geN1AWbrHZLBAC8NHcG3uc&libraries=places";
    } else if (CurrentDate > 13 && CurrentDate <= 15) {
      script.src = "https://maps.googleapis.com/maps/api/js?v=3&key=AIzaSyC5YUecL2AV1MocO1jTOAMw5gmT-924CRw&libraries=places";
    } else if (CurrentDate > 15 && CurrentDate <= 17) {
      script.src = "https://maps.googleapis.com/maps/api/js?v=3&key=AIzaSyDUcqYOG8mgDm6zzD6C1C5-rk118NUA4dE&libraries=places";
    } else if (CurrentDate > 17 && CurrentDate <= 24) {
      script.src = "https://maps.googleapis.com/maps/api/js?v=3&key=AIzaSyDUwyM5kym165Mi8uyNXS7RMlD_K8RrQOg&libraries=places";
    }

    document.body.appendChild(script);

  };

  /** @ngInject */
  function routeUser($transitions, userService) {

    $transitions.onBefore({}, function(transition) {

      if (transition.to().name == 'app.cotacoes')  {

        if (userService.checkPermission("cotacoes.esteira.criar")) {
          return transition.router.stateService.target('app.cotacoes.esteira.criar');
        } else {
          return transition.router.stateService.target('app.cotacoes.esteira');
        }

      }

    });

  };

})();