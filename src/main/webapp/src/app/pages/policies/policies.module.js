/**
 * @author george.silva
 * created on 01.03.2021
 */
(function () {
  'use strict';

  angular
    .module('sga.pages.policies', [])
    .config(routeConfig)
    .run(routeUser);

  /** @ngInject */
  function routeConfig($stateProvider) {

    $stateProvider
      .state('app.documents', {
        url: '/documents',
        title: 'Documentação',
        protected: true,
        sidebarMeta: {
          icon: 'ion-leaf',
          order: 100,
        },
      })

      .state('app.documents.policies', {
        url: '/policies',
        template: '<ui-view autoscroll="true" autoscroll-body-top></ui-view>',
        title: 'Políticas Ambientais',
        sidebarMeta: {
          order: 0,
        }
      })

      .state('app.documents.policies.board', {
        url: '/board',
        title: 'Políticas Ambientais - Board',
        component: 'policiesBoard',
        resolve: {
          policiesDocumentsData: function (/*dataService*/) {
            // return dataService.getPoliciesDocuments().$promise;
            return [{ id: 1, name: "ISO-14001-2004 ", type: "Norma", document: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" },
            { id: 2, name: "Politica Ambiental - Primeira Versão", type: "Politica", document: "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb" }]
          }
        }
      })

      .state('app.documents.policies.policy', {
        url: '/policy/:id',
        title: 'Políticas Ambientais - Documento',
        component: 'policyForm',
        resolve: {
          policyDocument: function ($stateParams/*, dataService*/) {
            //return dataService.getPolicyDocument($stateParams.id).$promise;
            return { id: $stateParams.id, name: "Politica Ambiental - Primeira Versão", type: "Politica", document: "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb" };
          }
        }
      })

      .state('app.documents.policies.create', {
        url: '/create',
        title: 'Nova Políticas Ambiental',
        component: 'policyForm',
        protected: false
      })

      .state('app.documents.goals', {
        url: '/goals',
        template: '<ui-view autoscroll="true" autoscroll-body-top></ui-view>',
        title: 'Metas Ambientais',
        sidebarMeta: {
          order: 100,
        }
      })

      .state('app.documents.goals.board', {
        url: '/board',
        title: 'Metas Ambientais - Board',
        component: 'goalsBoard',
        resolve: {
          goalsData: function (dataService) {
            return dataService.getGoalsData().$promise;
          }
        }
      })

      .state('app.documents.goals.goal', {
        url: '/goal/:id',
        title: 'Meta Ambiental',
        component: 'goalForm',
        resolve: {
          goal: function ($stateParams, dataService) {
            return dataService.getGoal($stateParams.id).$promise;
          }
        }
      })

      .state('app.documents.goals.create', {
        url: '/create',
        title: 'Nova Meta Ambiental',
        component: 'goalForm'
      });

  };

  /** @ngInject */
  function routeUser($transitions) {

    $transitions.onBefore({}, function (transition) {

      if (transition.to().name == 'app.documents.policies') {
        return transition.router.stateService.target('app.documents.policies.board');
      } else if (transition.to().name == 'app.documents.goals') {
        return transition.router.stateService.target('app.documents.goals.board');
      }

    });

};

})();
