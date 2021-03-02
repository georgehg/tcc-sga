/**
 * @author george.silva
 * created on 26.09.2017
 */
(function () {
    'use strict';

    angular
        .module('sga.pages.policies')
        .component('policyForm', {

            controllerAs: 'vm',

            bindings: {
                policyDocument: '<'
            },

            templateUrl: 'app/pages/policies/policy-form-template.html',

            controller: class PolicyFormComponent {

                constructor($scope, $state, $filter, $uibModal, /*dataService,*/ userService, toastr) {
                    this.scope = $scope;
                    this.state = $state;
                    this.filter = $filter;
                    this.uibModal = $uibModal
                  //  this.dataService = dataService;
                    this.userService = userService;
                    this.toastr = toastr;
                }

                $onInit() {
                    var vm = this;

                    /*vm.state.current.title = "Documento N°. " + vm.policyDocument.id;

                    vm.policyDocument = vm.policyDocument.toJSON();
                    vm.policyDocument_original = angular.copy(vm.policyDocument);

                    // Observador do objeto cotacao que irá verificar qualquer alteração do usuário
                    vm.scope.$watch(
                        function () {
                            return vm.policyDocument;
                        }
                        , function (updated, original) {
                            if (updated !== original) {
                                var cotacaoForUpdate = vm.filter('ObjectDiff')(updated, original);
                                cotacaoForUpdate.id = original.id;

                                vm.dataService.updateCotacao(cotacaoForUpdate).$promise
                                    .then(function (cotacaoUpdated) {
                                        vm.cotacao_original = angular.copy(original);
                                        vm.toastr.success('Atualização realizada com sucesso.', 'Cotação N°. ' + cotacaoUpdated.id);
                                    }
                                        , function (error) {
                                            vm.cotacao = angular.copy(vm.cotacao_original);
                                            vm.toastr.error('Ops! Aconteceu algum erro ao tentar atualizar esta cotação.',
                                                'Cotação N°. ' + vm.cotacao.id);
                                        });
                            }
                        }, true);*/
                }

                updateCotacao() {
                    vm.dataService.updateCotacao(cotacaoForUpdate).$promise
                        .then(function (cotacaoUpdated) {
                            vm.cotacao_original = angular.copy(original);
                            vm.toastr.success('Atualização realizada com sucesso.', 'Cotação N°. ' + cotacaoUpdated.id);
                        }
                            , function (error) {
                                vm.cotacao = angular.copy(vm.cotacao_original);
                                vm.toastr.error('Ops! Aconteceu algum erro ao tentar atualizar esta cotação.',
                                    'Cotação N°. ' + vm.cotacao.id);
                            });

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
                                cotacao: function () {
                                    return vm.cotacao;
                                },
                                action: function () {
                                    return 'cancelar a edição para';
                                }
                            }
                        }).result
                            .then(function () {
                                vm.scope.editableForm.$cancel();
                                vm.activeTab = selectedIndex + 1;
                            });
                    }
                }

            }

        });

})();
