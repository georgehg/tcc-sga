/**
 * @author george.silva
 * created on 26.09.2017
 */
(function () {
    'use strict';

    angular
    .module('sga.pages.cotacoes')
    .component('cotacao', {

        controllerAs: 'vm',

        bindings: {
            stateMachine: '<',
            cotacao: '<',
            servico: '<',
            projeto: '<',
            usuario: '<'
        },

        templateUrl : 'app/pages/cotacoes/cotacao-template.html',

        controller: class CotacoesTableComponent {

            constructor($scope, $state, $filter, $timeout, $uibModal, dataService, userService, toastr, NgMap) {
                this.scope = $scope;
                this.state = $state;
                this.filter = $filter;
                this.timeout = $timeout;
                this.uibModal = $uibModal
                this.dataService = dataService;
                this.userService = userService;
                this.toastr = toastr;
                this.NgMap = NgMap;
            }

            $onInit() {
                var vm = this;

                vm.state.current.title = "Cotação N°. " + vm.cotacao.id;
                vm.isOpenDtPicker = {};

                vm.cotacao = vm.cotacao.toJSON();
                vm.cotacao_original = angular.copy(vm.cotacao);

                var floorDateFilter = vm.filter('floorDate');
                vm.cotacao.wcd_estudo_solicitado_em = floorDateFilter(vm.cotacao.wcd_estudo_solicitado_em);
                vm.cotacao.wcd_estudo_respondido_em = floorDateFilter(vm.cotacao.wcd_estudo_respondido_em);
                vm.cotacao.scd_solicitado_em = floorDateFilter(vm.cotacao.scd_solicitado_em);
                vm.cotacao.scd_respondido_em = floorDateFilter(vm.cotacao.scd_respondido_em);
                vm.cotacao.integra_solicitado_em = floorDateFilter(vm.cotacao.integra_solicitado_em);
                vm.cotacao.integra_respondido_em = floorDateFilter(vm.cotacao.integra_respondido_em);

                if (vm.stateMachine) {
                    vm.actionsList = vm.filter('filterBy')(vm.stateMachine.actions, ['visible'], '1');
                    vm.sla = vm.stateMachine.sla;
                }

                // Permissões do usuário
                vm.upgradePermission = vm.userService.checkPermission('cotacoes.flagUpgrade');
                vm.upgradeThermometerPermission = vm.userService.checkPermission('cotacoes.changeThermometer');
                vm.statusPermission = vm.userService.checkPermission("cotacoes.esteira.status." + vm.cotacao.status);
                vm.modificarCotacaoPermission = vm.userService.checkPermission('cotacoes.modificarCotacao');
                vm.modificarPrecosPermission = vm.userService.checkPermission('cotacoes.modificarPreco');
                vm.modificarEstudosPermission = vm.userService.checkPermission('cotacoes.modificarEstudos');

                // Observador do objeto cotacao que irá verificar qualquer alteração do usuário
                vm.scope.$watch(
                    function() {
                        return vm.cotacao;
                    }
                    ,function(updated, original) {
                        if (updated !== original) {                            
                            var cotacaoForUpdate = vm.filter('ObjectDiff')(updated, original);
                            cotacaoForUpdate.id = original.id;

                            vm.dataService.updateCotacao(cotacaoForUpdate).$promise
                                .then(function(cotacaoUpdated) {
                                    vm.cotacao_original = angular.copy(original);
                                    vm.toastr.success('Atualização realizada com sucesso.', 'Cotação N°. ' + cotacaoUpdated.id);
                                }
                                ,function(error) {
                                    vm.cotacao = angular.copy(vm.cotacao_original);
                                    vm.toastr.error('Ops! Aconteceu algum erro ao tentar atualizar esta cotação.',
                                                    'Cotação N°. ' + vm.cotacao.id);
                                });
                        }
                    }, true);
            }

            checkIsOnEdit(event, selectedIndex) {
                var vm = this;                

                if (vm.scope.editableForm.$visible) {

                    event.preventDefault();

                    vm.uibModal.open({
                        backdrop: false,
                        size: 'md',
                        component: 'actionConfirmation',
                        resolve: {
                            cotacao: function() {
                                return vm.cotacao;
                            },
                            action: function() {
                                return 'cancelar a edição para';
                            }
                        }
                    }).result
                        .then(function() {
                            vm.scope.editableForm.$cancel();
                            vm.activeTab = selectedIndex + 1;
                        });
                }
            }

            initializeMaps() {
                var vm = this;
                
                // Mapa Ponta A
                vm.NgMap.getMap('pontaAMap').then(function(map) {
                    var place = new google.maps.LatLng(vm.cotacao.pt_a_latitude, vm.cotacao.pt_a_longitude);
                    map.setCenter(place);
                    
                    var marker = new google.maps.Marker({
                        position:place,
                        map: map,
                        draggable: false
                    });

                    vm.timeout(function () {
                        refreshMap(map);
                        }, 100);
                });

                // Mapa Ponta B
                vm.NgMap.getMap('pontaBMap').then(function(map) {
                    var place = new google.maps.LatLng(vm.cotacao.pt_b_latitude, vm.cotacao.pt_b_longitude);
                    map.setCenter(place);
                    
                    var marker = new google.maps.Marker({
                        position:place,
                        map: map,
                        draggable: false
                    });

                    vm.timeout(function () {
                        refreshMap(map);
                        }, 100);
                });

                // The maps should be refreshed after tab page shows
                // https://stackoverflow.com/questions/13901520/grey-area-in-google-maps
                function refreshMap(map)  {
                    var center = map.getCenter();
                    google.maps.event.trigger(map, "resize");
                    map.setCenter(center);
                };
            }
            
        }

    });  

})();