/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme.components')
      .directive('pageTop', pageTop);

  /** @ngInject */
  function pageTop($state, userService, notifyService) {

    var directive = {
      restrict: 'E',
      templateUrl: 'app/theme/components/pageTop/pageTop.html',
      link: function($scope) {
        
        $scope.searchValue = "";
        $scope.userName = userService.getIdentity().name;

        $scope.logout = function() {
          notifyService.notify('logout');
        }

        $scope.startSearch = function() {
          $state.go('app.cotacoes.cotacao', {id: $scope.searchValue});
        }

      }
    };

    return directive;

  }

})();