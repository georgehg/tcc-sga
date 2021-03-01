/**
 * @author george.silva
 * created on 09.01.2018
 */
(function () {
    'use strict';

    angular
    .module('sga.pages.relatorios')
    .component('relatorioPendenciasPrevenda', {

        controllerAs: 'vm',

        templateUrl: 'app/pages/relatorios/relatorio-pendencias-prevenda-template.html',

        controller: class RelatorioPendenciasPrevendaComponent {

            constructor($scope, $state, $filter, $window, uiGridExporterConstants, i18nService, dataService, 
                        notifyService, statusCotacoes, operators) {
                this.scope = $scope;
                this.filter = $filter;
                this.isMobile = $window.innerWidth < 500;
                this.uiGridExporterConstants = uiGridExporterConstants;
                this.dataService = dataService;
                this.notifyService = notifyService;
                this.statusCotacoes = statusCotacoes;
                this.operators = operators;
                i18nService.setCurrentLang('Pt-Br');
            }

            $onInit() {
                var vm = this;

                var columns = [
                    {field: 'id', displayName: 'Cotação No.', enableFiltering: false,  width:'100'},
                    {field: 'analista_responsavel', displayName: 'Responsável', width:'200', visible: false},
                    {field: 'ger_com_negocio', displayName: 'GN', width:'200', visible: false},
                    {field: 'solicitado_em', displayName: 'Solicitado', width:'100', cellFilter: 'floorDate | date: "yyyy-MM-dd"', type: 'date'},
                    {field: 'tecnologia', displayName: 'Tecnologia', width:'100'},
                    {field: 'cliente', displayName: 'Cliente', width:'180'},
                    {field: 'status_pretty_name', displayName: 'Status', width:'150'},
                    {field: 'dias_esteira', displayName: 'D. Esteira', width:'100', type: 'number', enableFiltering: false},
                    {field: 'dias_etapa', displayName: 'D. Etapa', width:'100', type: 'number', enableFiltering: false, visible: false},
                    {field: 'velocidade', displayName: 'Velocidade', width:'100', type:'number', enableFiltering: false},
                    {field: 'pt_a_cidade', displayName: 'Cidade Pt.A', width:'100', enableFiltering: false},
                    {field: 'pt_b_cidade', displayName: 'Cidade Pt.B', width:'100', enableFiltering: false, visible: false},
                    {field: 'termometro', displayName: 'Term.', width:'100', enableFiltering: false},
                    {field: 'id_wcd_estudo', displayName: 'WCD', width:'80', enableFiltering: false, visible: false}
                ];

                vm.gridOptions = {
                    enableSorting: true,
                    enableFiltering: true,
                    enableGrouping: true,
                    showGridFooter: vm.isMobile,
                    exporterMenuCsv: false,
                    exporterMenuExcel: false,
                    exporterMenuPdf: false,
                    exporterCsvColumnSeparator: ';',
                    exporterOlderExcelCompatibility: true,
                    enableGridMenu: true,
                    columnDefs: columns,
                    onRegisterApi: function(gridApi){
                        vm.gridApi = gridApi;
                        vm.gridApi.selection.on.rowSelectionChanged(vm.scope, function() {
                            vm.selectedCount = gridApi.selection.getSelectedCount();
                        });
                        vm.gridApi.selection.on.rowSelectionChangedBatch(vm.scope, function() {
                            vm.selectedCount = gridApi.selection.getSelectedCount();
                        });
                        vm.gridApi.core.on.rowsVisibleChanged(vm.scope, function() {
                            vm.visibleCount = gridApi.core.getVisibleRows().length;
                        });
                    }
                };

                vm.dataCount = 0;
                vm.visibleCount = 0;
                vm.selectedCount = 0;

                vm.faixa_esteira_operator = '=';
                vm.faixa_etapa_operator = '=';
                vm.velocidade_operator = '=';

                vm.faixa_esteira = 0;
                vm.faixa_etapa = 0;
                vm.faixa_vel = 0;
                
                vm.statusFilter = {
                    list: vm.statusCotacoes.pendentesPreVenda,
                    selected: vm.statusCotacoes.pendentesPreVenda
                };

                vm.filtra_termometro = false;
                vm.temperatura = 20;
            }

            search() {
                var vm = this;

                vm.gridOptions.data = undefined;

                var statusFilter;
                if (vm.statusFilter.selected.length !=  vm.statusFilter.list.length) {
                    statusFilter = "";
                    angular.forEach(vm.statusFilter.selected, function(status) {
                        statusFilter += "'" + status.name + "',";
                    });
                    statusFilter = statusFilter.slice(0, -1);
                };

                var filters = {
                    status: statusFilter
                };

                if (vm.faixa_esteira > 0) {
                    filters.faixa_esteira = vm.faixa_esteira_operator + vm.faixa_esteira;
                };

                if (vm.faixa_etapa > 0) {
                    filters.faixa_etapa = vm.faixa_etapa_operator + vm.faixa_etapa;
                };

                if (vm.faixa_vel > 0) {
                    filters.faixa_vel = vm.velocidade_operator + vm.faixa_vel;
                };

                if (vm.filtra_termometro) {
                    filters.termometro = vm.temperatura;
                };
                
                vm.notifyService.notify('on-app-load-start');
                vm.dataService.getPendenciasPrevenda(filters).$promise
                    .then(function(pendencias) {
                        vm.notifyService.notify('on-app-load-finish');
                        vm.gridOptions.data = pendencias;
                        vm.dataCount = vm.gridOptions.data.length;
                    });
            }

            exportCsv(type) {
                var vm = this;

                var stringDate = vm.filter('date')(new Date(), 'yyyyMMddHHmmss');
                vm.gridOptions.exporterCsvFilename = 'relatorio-pendencias-prv-' + stringDate + '.csv';
                var rowTypes = vm.uiGridExporterConstants[type];
                var colTypes = vm.uiGridExporterConstants[type];
                vm.gridApi.exporter.csvExport(rowTypes, colTypes);
            };

        }
    });
    
})();