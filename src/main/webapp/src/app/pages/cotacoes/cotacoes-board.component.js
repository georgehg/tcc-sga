/**
 * @author george.silva
 * created on 25.09.2017
 */
(function () {
    'use strict';

    angular
    .module('sga.pages.cotacoes')
    .component('cotacoesBoard', {

        controllerAs: 'vm',

        bindings: {
            statesPool: '<',
            cotacoesStateMachine: '<'
        },

        templateUrl : 'app/pages/cotacoes/cotacoes-board-template.html',

        controller: class CotacoesBoardComponent {

            constructor($state,  $location, $anchorScroll, userService) {
                this.state = $state;
                this.location = $location;
                this.anchorScroll = $anchorScroll;
                this.userService = userService;
            }

            $onInit() {
                var vm = this;

                vm.currentStatus = '';
                vm.createPermission = vm.userService.checkPermission('cotacoes.esteira.criar');

                vm.filteredStates = {};
                angular.forEach(vm.cotacoesStateMachine, function(data, state) {
                    if (data.visible == 1 && vm.userService.checkPermission("cotacoes.esteira.status." + state )) {
                        vm.filteredStates[state] = data;
                    }
                })
            }

            changeStatus() {
                var vm = this;

                if (vm.statesPool[vm.currentStatus]) {
                    vm.state.go('app.cotacoes.esteira.status', {status: vm.currentStatus});
                }
                //vm.location.hash(vm.currentStatus);
                //vm.anchorScroll();
            }

            createOptions() {
                var vm = this;
                
                vm.currentStatus = '';
                vm.state.go('app.cotacoes.esteira.criar', { template: 'opcoes' });
            }
        }
    });

})();