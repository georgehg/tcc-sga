/**
 * @author george.silva
 * created on 31.01.2018
 */
(function () {
    'use strict';

    angular
    .module('sga.pages.cotacoes')
    .component('criarCotacao', {

        controllerAs: 'vm',

        bindings: {
            cotacoesStateMachine: '<'
        },

        templateUrl: ['$stateParams', function ($stateParams) {
            return 'app/pages/cotacoes/criar-cotacao-' + $stateParams.template + "-template.html";
        }],
        
        controller: class CriarCotacaoOptionsComponent {

            constructor($state, $stateParams, $filter, $q, $uibModal, toastr, listas, userService,
                        dataService, precifierService) {
                this.state = $state;
                this.stateParams = $stateParams;
                this.filter = $filter;
                this.promise = $q;
                this.uibModal = $uibModal;
                this.toastr = toastr;
                this.dataService = dataService;
                this.precifierService = precifierService;

                var stateName = $state.current.name.split('app.')[1].concat(".", $stateParams.template);
                this.deletePermission = userService.hasPrivilege(stateName, 'delete');

                this.lista_degraus = listas["degraus_" + $stateParams.template];
                this.lista_prazos = listas.prazos_anos;
                this.lista_produtos_gpon = listas.produtos_gpon;
                this.lista_topologias = listas.topologias;
                this.lista_regioes = listas.regioes;
                this.lista_interfaces = listas.interfaces;
                this.lista_disponibilidades = listas.disponibilidades;
                this.title;               
            }

            $onInit() {
                var vm = this;

                vm.cotacao = {
                    termometro: 20
                };

                vm.cotacoes = [];

                switch(vm.stateParams.template) {
                    case 'sp':
                        vm.state.current.title = "Criar Cotações para Produtos dentro de São Paulo";
                        vm.cotacao.status = 'criarCotacaoSP';
                        vm.cotacao.flag_segmento = '#PESP';
                        vm.cotacao.regiao = 'SP';
                        vm.cotacao.degrau = 0;
                        break;
                    case 'ope':
                        vm.state.current.title = "Criar Cotações OPE";
                        vm.cotacao.status = 'criarCotacaoOPE';
                        vm.cotacao.flag_segmento = '#OPESP';
                        vm.cotacao.regiao = 'SP';
                        vm.cotacao.viabilidade = 1;
                        vm.cotacao.ope = 1;
                        break;
                    case 'dados':
                        vm.state.current.title = "Criar Cotações para Produtos de Dados";
                        vm.cotacao.status = 'criarCotacaoDados';
                        vm.cotacao.flag_segmento = '#PEDADOS';
                        vm.cotacao.degrau = 0;
                        vm.cotacao.degrau_calculado = 0;
                        vm.cotacao.acesso_igual_banda = 1;

                        vm.solicitado_date_options = {
                            maxDate: new Date,
                            minDate: new Date
                        };
                        vm.solicitado_date_options.minDate.setMonth(vm.solicitado_date_options.minDate.getMonth() - 1);

                        // Objeto para controlar digitação dos campos de perfis para cotação de dados
                        vm.profile = {
                            _dataProfile: undefined,
                            _videoProfile: undefined,
                            _voiceProfile: undefined,

                            _checkValue: function(oldProfile, newProfile, otherProfile1, otherProfile2) {
                                var sum = newProfile + otherProfile1 + otherProfile2;
                                if (sum > 80) {
                                    return oldProfile;
                                } else {                            
                                    return newProfile;
                                }
                            },

                            getDataProfile: function(newDataProfile) {
                                if (angular.isDefined(newDataProfile)) {
                                    this._dataProfile = this._checkValue(this._dataProfile, newDataProfile, this._videoProfile, this._voiceProfile);
                                }
                                return this._dataProfile;
                            },

                            getVideoProfile: function(newVideoProfile) {
                                if (angular.isDefined(newVideoProfile)) {
                                    this._videoProfile = this._checkValue(this._videoProfile, newVideoProfile, this._dataProfile, this._voiceProfile);
                                }
                                return this._videoProfile;
                            },

                            getVoiceProfile: function(newVoiceProfile) {
                                if (angular.isDefined(newVoiceProfile)) {
                                    this._voiceProfile = this._checkValue(this._voiceProfile, newVoiceProfile, this._dataProfile, this._videoProfile);
                                }
                                return this._voiceProfile;
                            },

                            getDataNpProfile: function() {
                                if (angular.isDefined(this._dataProfile) && angular.isDefined(this._videoProfile) && angular.isDefined(this._voiceProfile)) {
                                    return 100 - (this._dataProfile + this._videoProfile + this._voiceProfile);
                                } else {
                                    return undefined;
                                }                        
                            }
                        };

                        break;
                    case 'fsp':
                        vm.state.current.title = "Criar Cotações para Produtos fora de São Paulo";
                        vm.cotacao.status = 'criarCotacaoFSP';
                        vm.cotacao.flag_segmento = '#PEFSP';
                        vm.cotacao.regiao = 'FSP';
                        vm.cotacao.ope = 0;
                        vm.busca = {};
                        vm.busca_cotacoes = [];
                        break;
                    case 'remanejamento':
                        vm.state.current.title = "Criar Cotação de remanejamento de equipamento";
                        break;
                }
                    
                vm.actions = vm.cotacoesStateMachine[vm.cotacao.status].actions;
                vm.solicitado_em = new Date();

                vm.cliente = {};
                vm.tipo_acesso = 'REDE';
                vm.lista_tipo_acesso = [];
                vm.tecnologia = undefined;
                vm.topologia = undefined;
                vm.prazo = undefined;
                vm.prazos = {};
                vm.prazos_selected = [];
                vm.velocidade = undefined;
                vm.velocidades = {};
                vm.velocidades_selected = [];

                // Objetos para os componentes de endereços e mapas
                vm.pt_a = {};
                vm.pt_b = {};

                // Consulta lista de clientes
                vm.lista_clientes = [];
                vm.dataService.getClients().$promise
                .then(function(clients) {
                    vm.lista_clientes = clients;
                });

                // Consulta lista de produtos com respectivos Tipos de Acessos e velocidades
                vm.produtos_velocidades = {};
                vm.dataService.getProductsAndSpeeds({type: vm.filter('uppercase')(vm.stateParams.template)}).$promise
                .then(function(products_speeds) {
                    vm.produtos_velocidades = products_speeds;
                });
            }

            changeProduct() {
                var vm = this;
                
                vm.lista_tipo_acesso = Object.keys(vm.tecnologia.access_types);
                vm.tipo_acesso = vm.lista_tipo_acesso[0];
                vm.topologia = undefined;

                vm.velocidades = {
                    options: vm.tecnologia.access_types[vm.tipo_acesso]
                }
            }

            changeAccessType() {
                var vm = this;

                vm.velocidades = {
                    options: vm.tecnologia.access_types[vm.tipo_acesso]
                }
            }

            changePrazos(prazo) {
                var vm = this;

                vm.prazos_selected = [];
                vm.prazos[prazo] = !vm.prazos[prazo];
                angular.forEach(vm.prazos, function(checked, prazo) {
                    if (checked) vm.prazos_selected.push(prazo);
                });
            }

            speedsAreSelected() {
                var vm = this;

                if (!vm.velocidades.selected) {
                    return false
                }
                
                switch(vm.stateParams.template) {
                    case 'sp':
                        return vm.velocidades.selected.length > 0;
                        break;
                    case 'dados':
                        return Object.keys(vm.velocidades.selected).length > 0;
                        break;
                    case 'fsp':
                        return vm.velocidades.selected.length > 0;
                        break;
                }
            }

            termsAreSelected() {
                var vm = this;
                
                return vm.prazos_selected.length > 0;
            }

            updatePtA(address) {
                this.pt_a = address;
            }

            updatePtB(address) {
                this.pt_b = address;
            }

            setClient(cotacao, cliente) {
                cotacao.cliente = cliente.cliente_nome_fantasia;
                cotacao.cliente_id = cliente.id;
                cotacao.id_cliente = cliente.id;
                cotacao.icms_isencao = cliente.icms_isencao;
                cotacao.cliente_prospeccao = cliente.prospeccao;
                cotacao.gn_nome = cliente.gn_nome;
                cotacao.gn_email = cliente.gn_email;
                cotacao.gn_celular = cliente.gn_celular;
            }

            setProduct(cotacao, product_name, tipo_acesso, topologia) {
                cotacao.tecnologia = product_name;
                cotacao.tipo_acesso = tipo_acesso === 'REDE' ? '' : tipo_acesso;
                cotacao.topologia = topologia;
            }

            buildAddressPoint(cotacao, address, point) {
                var pt = {};
                pt[point + '_endereco_puro'] = address.full_address;
                pt[point + '_logradouro'] = address.logradouro;
                pt[point + '_numero'] = address.numero;
                pt[point + '_complemento'] = address.complemento;
                pt[point + '_bairro'] = address.bairro;
                pt[point + '_cidade'] = address.cidade;
                pt[point + '_estado'] =  address.estado;
                pt[point + '_cep'] = address.cep;
                pt[point + '_latitude'] = address.latitude;
                pt[point + '_longitude'] = address.longitude;

                angular.extend(cotacao, pt);
            }

            deleteAddressPoint(cotacao, point) {
                var pt = {};
                pt[point + '_endereco_puro'] = undefined;
                pt[point + '_logradouro'] = undefined;
                pt[point + '_numero'] = undefined;
                pt[point + '_complemento'] = undefined;
                pt[point + '_bairro'] = undefined;
                pt[point + '_cidade'] = undefined;
                pt[point + '_estado'] =  undefined;
                pt[point + '_cep'] =undefined;
                pt[point + '_latitude'] = undefined;
                pt[point + '_longitude'] = undefined;

                angular.extend(cotacao, pt);
            }

            setAddress(cotacao, ptA, ptB) {
                var vm = this;

                vm.buildAddressPoint(cotacao, ptA, 'pt_a');

                if (ptB.full_address) {
                    vm.buildAddressPoint(cotacao, ptB, 'pt_b');
                } else {
                    vm.buildAddressPoint(cotacao, ptA, 'pt_b');
                }            
            }

            setOptions(cotacao, prazo, vel_acesso, vel_banda) {
                cotacao.prazo = prazo;
                cotacao.vel_acesso = vel_acesso;
                cotacao.vel_banda = vel_banda;                
            }

            setPrice(cotacao, price) {
                cotacao.instalacao = price.instalacao;
                cotacao.instalacao_fac = price.instalacao_fac;
                cotacao.mensalidade = price.mensalidade;
                cotacao.mensalidade_fac = price.mensalidade_fac;
                cotacao.ac = price.area_concorrencia;
            }

            setProfile(cotacao, profile) {
                cotacao.perfil_dados = profile.getDataProfile();
                cotacao.perfil_video = profile.getVideoProfile();
                cotacao.perfil_voz = profile.getVoiceProfile();
                cotacao.perfil_dadosnp = profile.getDataNpProfile();
            }

            performQuotations() {
                var vm = this;

                if (vm.cotacao.status == 'criarCotacaoSP' && 
                    (vm.pt_a.estado != 'SP' || ( vm.pt_b.estado && vm.pt_b.estado != "" && vm.pt_b.estado != 'SP')))  {
                    
                    vm.toastr.error('Favor criar cotação FSP no formulário adequado', 'Ops! Operação não permitida');
                    return;
                }

                if (vm.cotacao.status == 'criarCotacaoFSP' && 
                    (vm.pt_a.estado == 'SP' || ( vm.pt_b.estado && vm.pt_b.estado != "" && vm.pt_b.estado == 'SP')))  {
                    
                    vm.toastr.error('Cotações dentro de SP devem ser criadas no formulário correto.');
                    return;
                }

                vm.setClient(vm.cotacao, vm.cliente);
                vm.setProduct(vm.cotacao, vm.tecnologia.product_name, vm.tipo_acesso, vm.topologia);
                vm.setAddress(vm.cotacao, vm.pt_a, vm.pt_b);
                
                vm.cotacao.solicitado_em = vm.filter('date')(vm.solicitado_em, 'yyyy-MM-dd');

                switch(vm.stateParams.template) {
                    case 'sp':
                        vm.velocidades_selected = vm.velocidades.selected;
                        vm.cotacao.id_pai = Math.round(Date.now() / 10);
                        break;
                    case 'ope':
                        vm.velocidades_selected = [vm.velocidade];
                        vm.prazos_selected = [vm.prazo];
                        break;
                    case 'dados':
                        vm.setProfile(vm.cotacao, vm.profile);
                        vm.velocidades_selected = Object.keys(vm.velocidades.selected);
                        vm.bandas_selected = vm.velocidades.selected;
                        vm.cotacao.id_pai = Math.round(Date.now() / 10);
                        break;
                    case 'fsp':
                        vm.velocidades_selected = vm.velocidades.selected;
                        vm.cotacao.id_pai = Math.round(Date.now() / 10);
                        break;
                }

                return vm.addQuotations(vm.cotacao, vm.prazos_selected, vm.velocidades_selected, vm.bandas_selected)
                    .then(function(novasCotacoes) {

                        if (novasCotacoes.length > 0) {
                            vm.cotacoes = vm.cotacoes.concat(novasCotacoes);
                        }

                        if (vm.cotacao.status == 'criarCotacaoSP') {

                            return vm.addAlternateQuotations(vm.cotacao, novasCotacoes)
                                .then(function(cotacoesAlternativas) {

                                    if (cotacoesAlternativas.length > 0) {
                                        cotacoesAlternativas = vm.filter('flatten')(cotacoesAlternativas);
                                        vm.cotacoes = vm.cotacoes.concat(cotacoesAlternativas);
                                    }

                                    vm.toastr.success('Cotações realizadas com sucesso');
                                })
                                .catch(function(error) {
                                    console.log(error);
                                    vm.toastr.error(error, 'Ops! Aconteceu algum erro ao tentar realizar uma cotação alternativa');
                                });

                        } else {

                            vm.toastr.success('Cotações realizadas com sucesso');

                        }
                    })
                    .catch(function(error) {
                        console.log(error);
                        vm.toastr.error(error, 'Ops! Aconteceu algum erro ao tentar realizar uma cotação');
                    });
            }

            addQuotations(cotacaoSolicitada, prazos, acessos, bandas) {
                var vm = this;
                
                var quotationPromises = [];

                angular.forEach(prazos, function(prazo) {
                    angular.forEach(acessos, function(acesso) {

                        if (bandas && bandas[acesso]) {

                            angular.forEach(bandas[acesso], function(banda) {
                                var novaCotacao = angular.copy(cotacaoSolicitada);
                                vm.setOptions(novaCotacao, prazo, acesso, banda);
                                quotationPromises.push(vm.newQuotation(novaCotacao, prazo, acesso, banda));
                            });

                        } else {

                            var novaCotacao = angular.copy(cotacaoSolicitada);
                            vm.setOptions(novaCotacao, prazo, acesso);
                            quotationPromises.push(vm.newQuotation(novaCotacao, prazo, acesso));

                        }
                    });
                });

                return vm.promise.all(quotationPromises)
            }

            addAlternateQuotations(cotacaoPrincipal, cotacoesSalvas) {
                var vm = this;

                var alternateQuotationPromises = [];

                if (vm.lista_produtos_gpon.includes(cotacaoPrincipal.tecnologia) &&
                    vm.pt_a.gponl2l == 1 && vm.pt_b.gponl2l == 1) {
                    alternateQuotationPromises.push(vm.addGPONL2LQuotations(cotacaoPrincipal, cotacoesSalvas));
                };

                if (vm.pt_a.gponmpls == 1) {
                    alternateQuotationPromises.push(vm.addGPONMPLSQuotations(cotacaoPrincipal, cotacoesSalvas));
                };

                return vm.promise.all(alternateQuotationPromises);

            }

            newQuotation(novaCotacao) {
                var vm = this;

                return vm.priceQuotation(novaCotacao)
                    .then(function(cotacaoPrecificada) {
                        return vm.saveQuotation(cotacaoPrecificada);
                    });
            }

            priceQuotation(cotacao) {
                var vm = this;

                return vm.precifierService.price(cotacao).$promise
                    .then(function(price) {
                        vm.setPrice(cotacao, price);
                        return cotacao;
                    }
                    ,function(error) {                        
                        throw new Error("Falha ao tentar precificar uma cotação");
                    });
            }

            saveQuotation(cotacao) {
                var vm = this;

                if (cotacao.tecnologia == 'MPLS' || cotacao.tecnologia == 'IP-Internet') {
                    vm.deleteAddressPoint(cotacao, 'pt_b');
                };

                vm.setNextAction(cotacao, vm.currentState);

                return vm.dataService.saveCotacao(cotacao).$promise
                    .then(function(cotacaoSalva) {
                        if (!cotacaoSalva.id_pai) {
                            cotacaoSalva.id_pai = cotacaoSalva.id;
                        }
                        return cotacaoSalva;
                    }
                    ,function(error) {
                        throw new Error("Falha ao tentar salvar uma cotação");
                    });
            }

            addGPONL2LQuotations(cotacaoPrincipal, cotacoesSalvas) {
                var vm = this;

                var quotationPromises = [];

                angular.forEach(cotacoesSalvas, function(cotacao) {

                    if (vm.produtos_velocidades.GPON.access_types.REDE.indexOf(cotacao.vel_acesso) !== -1) {

                        var cotacaoAlternativa = angular.copy(cotacaoPrincipal);

                        vm.setOptions(cotacaoAlternativa, cotacao.prazo, cotacao.vel_acesso);

                        cotacaoAlternativa.alternativa_a = cotacao.id;
                        vm.setProduct(cotacaoAlternativa, 'GPON', 'GPON', cotacaoPrincipal.topologia);

                        var newQuotationPromise = 
                                vm.newQuotation(cotacaoAlternativa)
                                .then(function(novaCotacao) {
                                    return novaCotacao;
                                });

                        quotationPromises.push(newQuotationPromise);
                    }
                });

                return vm.promise.all(quotationPromises);
            }

            addGPONMPLSQuotations(cotacaoPrincipal, cotacoesSalvas) {
                var vm = this;

                var quotationPromises = [];

                angular.forEach(cotacoesSalvas, function(cotacao) {

                    if (vm.produtos_velocidades.GPON.access_types.REDE.indexOf(cotacao.vel_acesso) !== -1) {

                        var cotacaoAlternativa = angular.copy(cotacaoPrincipal);

                        vm.setOptions(cotacaoAlternativa, cotacao.prazo, '100 Mbps', cotacao.vel_acesso);
                        vm.setProduct(cotacaoAlternativa, 'MPLS', 'GPON', cotacaoPrincipal.topologia);
                        vm.buildAddressPoint(cotacaoAlternativa, vm.pt_a, 'pt_b');

                        cotacaoAlternativa.alternativa_a = cotacao.id;
                        cotacaoAlternativa.acesso_igual_banda = true;
                        cotacaoAlternativa.flag_segmento = '#PEDADOS';
                        cotacaoAlternativa.perfil_dados = 80;
                        cotacaoAlternativa.perfil_voz = 0;
                        cotacaoAlternativa.perfil_video = 0;
                        cotacaoAlternativa.perfil_dadosnp = 20;
                        cotacaoAlternativa.degrau = 0;
                        cotacaoAlternativa.degrau_calculado = 0;
                        cotacaoAlternativa.regiao = 'SP';

                        var newQuotationPromise = 
                                vm.newQuotation(cotacaoAlternativa)
                                .then(function(novaCotacao) {
                                    return novaCotacao;
                                })

                        quotationPromises.push(newQuotationPromise);
                    }
                });

                return vm.promise.all(quotationPromises);
            }            

            setNextAction(cotacao, currentState) {
                var vm = this;

                var nextActionName;

                if (cotacao.flag_upgrade == 1) {
                    nextActionName = 'env_precificar';
                } else {
                    nextActionName = 'precificado';
                }

                if (currentState == 'criarCotacaoDados' && cotacao.regiao == 'FSP' && cotacao.tipo_acesso != '4G - Wireless VPN') {
                    nextActionName = 'env_precificar';
                }

                if (cotacao.flag_segmento == '#PESP' && cotacao.vel_acesso.match('Gbps')) {
                    nextActionName = 'env_analise';
                }

                if (cotacao.flag_segmento == '#PEDADOS' && cotacao.vel_banda.match('Gbps')) {
                    nextActionName = 'env_analise';
                }

                if (cotacao.flag_estudo_necessario == 1) {
                    nextActionName = 'env_analise';
                }

                var nextAction = vm.filter('filterBy')(vm.actions, ['action_name'], nextActionName)[0];
                cotacao.status = nextAction.next_state.name;
            }

            updateDisclaimer(cotacao) {
                var vm = this;

                var cotacaoForUpdate = {
                    id: cotacao.id,
                    disclaimer: cotacao.disclaimer
                }

                vm.dataService.updateCotacao(cotacaoForUpdate).$promise
                    .then(function(cotacaoSalva) {
                        vm.toastr.success('Cotação ' + cotacaoSalva.id + ' atualizada com sucesso');
                    }
                    ,function(error) {
                        vm.toastr.error("Falha ao tentar atualizar uma cotação");
                    });
            }

            deleteQuotation(cotacao) {
                var vm = this;

                vm.uibModal.open({
                        backdrop: false,
                        size: 'md',
                        component: 'actionConfirmation',
                        resolve: {
                            cotacao: function() {
                                return cotacao;
                            },
                            action: function() {
                                return 'deletar';
                            }
                        }
                    }).result
                    .then(function() {
                        vm.dataService.deleteCotacao(cotacao).$promise
                        .then(function() {
                            vm.cotacoes.splice(vm.cotacoes.indexOf(cotacao), 1);
                            return;
                        }
                        ,function(erro) {
                            vm.toastr.error('Ops! Aconteceu algum erro ao tentar deletar a cotação: ' + cotacao.id);
                        });
                    });
            }

            searchQuotations() {
                var vm = this;

                var params = {
                    pt_a_lat: vm.pt_a ? vm.pt_a.latitude : undefined,
                    pt_a_lng: vm.pt_a ? vm.pt_a.longitude : undefined,
                    pt_b_lat: vm.pt_b ? vm.pt_b.latitude : undefined,
                    pt_b_lng: vm.pt_b ? vm.pt_b.longitude : undefined,
                    cliente: vm.cliente ? vm.cliente.cliente_nome_fantasia : undefined,
                    raio: vm.busca.raio,
                    produto: vm.busca.produto,
                    todos_clientes: vm.busca.todos_clientes,
                    velocidade: vm.busca.velocidade,
                    pontas: vm.busca.pontas
                };

                vm.dataService.getCotacaoProxima(params).$promise
                .then(function(cotacoes) {
                    vm.busca_cotacoes = cotacoes;
                });
            }

            cleanQuotations() {
                var vm = this;

                vm.busca_cotacoes = [];
            }

        }
    });

})();