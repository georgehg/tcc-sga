/**
 * @author v.lugovsky
 * created on 10.12.2016
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme.inputs')
      .directive('baSwitcher', baSwitcher);

  /** @ngInject */
  function baSwitcher() {
    return {
      templateUrl: 'app/theme/inputs/baSwitcher/baSwitcher.html',
      scope: {
        switcherStyle: '@',
        switcherModel: '=',
        switcherOnLabel: '@',
        switcherOffLabel: '@',
        switcherOnValue: '@',
        switcherOffValue: '@'
      },
      link: function(scope) {

        scope.doSwitch = doSwitch;

        if (!scope.switcherOnLabel) {
          scope.switcherOnLabel = "On";
        };

        if (!scope.switcherOffLabel) {
          scope.switcherOffLabel = "Off";
        };

        if (!scope.switcherOnValue) {
          scope.switcherOnValue = true;
        };

        if (!scope.switcherOffValue) {
          scope.switcherOffValue = false;
        };

        scope.switcherCtrlModel = scope.switcherModel == scope.switcherOnValue ? true : false;

        function doSwitch() {
          scope.switcherModel = scope.switcherCtrlModel ? scope.switcherOnValue : scope.switcherOffValue;
        }

      }
    };
  }

})();
