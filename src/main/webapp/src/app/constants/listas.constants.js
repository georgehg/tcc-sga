/**
 * @author george.silva
 * created on 02.02.2018
 */
(function () {
    'use strict';

    const listas = {
        ufs: ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO']        
    };

    angular
        .module('sga.constants')
        .constant('listas', listas);

})();