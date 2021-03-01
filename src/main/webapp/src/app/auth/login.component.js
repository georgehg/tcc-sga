/**
 * @author george.silva
 * created on 31.10.2017
 */
(function () {
    'use strict';

    angular
    .module('sga.auth')
    .component('login', {

        controllerAs: 'vm',

        bindings: {
            previousState: '<'
        },

        templateUrl : '/auth.html',

        controller: class LoginComponent {

            constructor($state, userService, toastr) {
                this.state = $state;
                this.userService = userService;
                this.toastr = toastr;
            }

            $onInit() {

                var vm = this;

                vm.submit = submit;

                vm.login = "";
                vm.passwd = "";
                vm.onLogin = false;                

                function submit() {

                    vm.onLogin = true;

                    var credentials = {
                        user: vm.login,
                        password: vm.passwd
                    }

                    vm.login = "";
                    vm.passwd = "";

                    vm.userService.authenticate(credentials).$promise
                        .then(function(result) {

                            if (vm.userService.isAuthenticated()) {
                                vm.toastr.clear();
                                if (vm.previousState.name) {
                                    vm.state.go(vm.previousState.name, vm.previousState.params);
                                } else {
                                    vm.state.go('app');
                                }
                            } else {
                                vm.onLogin = false;
                                vm.toastr.error('Verifique as informações digitadas e tente novamente.',
                                            'Login ou Senha incorretos!');                                
                            }
                            
                        })
                        .catch(function(error) {
                            vm.onLogin = false;
                            vm.toastr.warning('Verifique se o seu computador está conectado à rede ou tente mais tarde.',
                                            'Algo inesperado aconteceu!');
                            console.log(error);
                        })
                }
            }
        }
                
    });

})();