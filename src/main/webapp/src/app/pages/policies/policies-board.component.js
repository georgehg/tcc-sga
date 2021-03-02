/**
 * @author george.silva
 * created on 01.03.2021
 */
(function () {
    'use strict';

    angular
        .module('sga.pages.policies')
        .component('policiesBoard', {

            controllerAs: 'vm',

            bindings: {
                policiesDocumentsData: '<'
            },

            templateUrl: 'app/pages/policies/policies-board-template.html',

            controller: class PoliciesBoardComponent {

                constructor($state, $filter, userService) {
                    this.state = $state;
                    this.filter = $filter;
                    this.userService = userService;
                }

                $onInit() {
                    var vm = this;
                    vm.actionsList = vm.filter('filterBy')(vm.userActions, ['visible'], '1');

                    vm.safePoliciesDocumentsData = vm.policiesDocumentsData;
                    vm.policiesDocumentsTable = [];

                    vm.isAllCollapsed = true;

                    vm.createPermission = vm.userService.hasPrivilege('policies', 'create');
                    vm.updatePermission = vm.userService.hasPrivilege('policies', 'edit');
                    vm.deletePermission = vm.userService.hasPrivilege('policies', 'delete');
                }

                editPolicy(policy) {
                    var vm = this;
                    vm.state.go('app.documents.policies.policy', {id: policy.id});
                }

                deletePolicy(policy) {
                    var vm = this;

                    vm.isAllCollapsed = collapsed;
                }

            }
        });

})();