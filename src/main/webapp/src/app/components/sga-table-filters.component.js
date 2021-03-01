/**
 * @author george.silva
 * created on 02.01.2018
 */
(function () {
    'use strict';

    angular
    .module('sga.components')
    .component('sgaTableFilters', {

        controllerAs: 'vm',

        bindings: {
            tableData: '<',
            filterGroups: '<',
            groupTitle: '<',
            filterTitle: '<',
            isAllCollapsed: '<',
            onFilterChange: '&',
            onChangeCollapse: '&'
        },

        templateUrl: 'app/components/sga-table-filters-template.html',

        controller: class TableFiltersComponent {

            constructor($filter) {
                this.filter = $filter;
            }

            $onInit() {
                var vm = this;
                
                //Groups object must be:
                //groups: [selectable: "visible_value", description: "value_description", field: "table_filtering_field"]
                vm.groupSelect = {
                    groups: vm.filterGroups,
                    selected: vm.filterGroups[0]
                };

                vm.filterSelect = {
                    options: {},
                    selected: {}
                };

                angular.forEach(vm.groupSelect.groups, function(group) {

                    var groupField = group.field;
                    vm.filterSelect[groupField] = {
                        options: ["Todos"]
                    }
                    
                    var filterList = [];
                    angular.forEach(vm.filter('unique')(vm.tableData, groupField),
                        function(element) {
                            if (element[groupField]) {
                                filterList.push(element[groupField]);
                            }
                        }
                    );
                    vm.filterSelect[groupField].options = vm.filterSelect[groupField].options.concat(filterList.sort());
                });

                vm.selectGroup(vm.groupSelect.selected);
            }

            selectGroup(groupSelected) {
                var vm = this;

                vm.filterSelect.options = vm.filterSelect[groupSelected.field].options;
                vm.filterSelect.selected = vm.filterSelect[groupSelected.field].options[0];
                vm.onFilterChange({tableData: vm.tableData});
            }

            selectFilter(filterSelected) {
                var vm = this;

                var returnTable;
                if (filterSelected == "Todos") {
                    returnTable = vm.tableData;
                } else {
                    returnTable = vm.filter('filterBy')(vm.tableData, [vm.groupSelect.selected.field], filterSelected);
                }
                vm.onFilterChange({tableData: returnTable});
            }

            changeCollapse() {
                var vm = this;
                vm.onChangeCollapse({collapsed: vm.isAllCollapsed});
            }

        }
    });
    
})();