/**
 * @author george.silva
 * created on 26.09.2017
 */
(function () {
  'use strict';

    angular
    .module('sga.pages.cotacoes')
    .component('cotacoesTableDetail', {
        
        controllerAs: 'vm',

        bindings: {
            stateMachine: '<',
            cotacao: '<'
        },

        templateUrl: 'app/pages/cotacoes/cotacoes-table-detail-template.html',

        /*controller: class CotacoesTableDetailComponent {

            constructor(dataService) {
                this.dataService = dataService;
            }

            $onInit() {
                var vm = this;
                vm.dataService.getUsuario({email: vm.cotacao.modificado_por}).$promise
                                .then(function(usuario){
                                    vm.usuario = usuario[0];
                                });
            }

        }*/
    });
    
})();
