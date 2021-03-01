/**
 * @author george.silva
 * created on 20.12.2017
 */
(function () {
    'use strict';

    angular
    .module('sga.pages.pendencias')
    .component('pendenciasTable', {

        controllerAs: 'vm',

        bindings: {
            stateMachine: '<',
            pendenciasTableData: '<',
            logedUser: '<'
        },

        templateUrl: 'app/pages/pendencias/pendencias-table-template.html',

        controller: class PendenciasTableComponent {

            constructor($window, $filter) {
                this.filter = $filter;
                this.isMobile = $window.innerWidth < 500;
            }

            $onInit() {
                var vm = this;
                vm.safePendenciasTableData = vm.pendenciasTableData;
                vm.tabelaPendencias = [];
                vm.hideHeaderDCEsteira = vm.logedUser.area == 'GER_POS_DELIVERY' ? true : false;

                vm.filterGroups = [
                    {selectable: "Anal.", description: "Analista Pré-Venda", field: "gn"},
                    {selectable: "GN", description: "Gerente de Negócio", field: "gn_nome"}
                ];

                vm.isAllCollapsed = true;
            }

            filterPendencias(tableData) {
                var vm = this;
                vm.safePendenciasTableData = tableData;
            }

            collapseTable(collapsed) {
                var vm = this;
                vm.isAllCollapsed = collapsed;
            }
        }
    });
    
})();