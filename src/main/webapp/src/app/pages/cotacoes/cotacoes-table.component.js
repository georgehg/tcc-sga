/**
 * @author george.silva
 * created on 26.09.2017
 */
(function () {
    'use strict';

    angular
    .module('sga.pages.cotacoes')
    .component('cotacoesTable', {

        controllerAs: 'vm',

        bindings: {
            stateMachine: '<',
            cotacoesTableData: '<',
        },

        templateUrl: 'app/pages/cotacoes/cotacoes-table-template.html',

        controller: class CotacoesTableComponent {

            constructor($state, $filter, $window) {
                this.state = $state;
                this.filter = $filter;
                this.isMobile = $window.innerWidth < 500;
            }

            $onInit() {
                var vm = this;
                vm.state.current.title = vm.stateMachine.pretty_name;
                vm.sla = vm.stateMachine.sla;
                vm.actionsList = vm.filter('filterBy')(vm.stateMachine.actions, ['visible'], '1') ;                
                
                vm.safeCotacoesTableData = vm.cotacoesTableData;
                vm.tabelaCotacoes = [];

                vm.filterGroups = [
                    {selectable: "GN", description: "Gerente de Negócio", field: "ger_com_negocio"},
                    {selectable: "GP", description: "Gerente Pré-Comercial", field: "ger_pre_comercial"},
                    {selectable: "GA", description: "Gerente Pré-Apoio", field: "ger_pre_apoio"},
                    {selectable: "GD", description: "Gerente Pós-Delivery", field: "ger_pos_delivery"}
                ];

                vm.isAllCollapsed = true;

            }

            filterCotacoes(tableData) {
                var vm = this;

                vm.safeCotacoesTableData = tableData;
            }

            collapseTable(collapsed) {
                var vm = this;

                vm.isAllCollapsed = collapsed;
            }
            
        }
    });
    
})();