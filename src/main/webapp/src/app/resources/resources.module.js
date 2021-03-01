/**
 * @author george.silva
 * created on 04.09.2017
 */
(function () {
    'use strict';

    angular
        .module('sga.resources', ['ngResource'])
        .provider('environment', environment) 
        .config(resourceConfig);

    function environment() {

        var environments = {};
            
        var selectedEnv = 'dev';
        var self = this;

        this.setEnvironments = function (envs) {
            if (!Object.keys(envs).length)
                throw new Error('At least one environment is required!');

            environments = envs;
        };

        this.setActive = function (env) {
            if (!environments[env])
                throw new Error('No such environment present: ' + env);

            selectedEnv = env;
            return self.getActive();
        };

        this.getEnvironment = function (env) {
            if (!env)
                throw new Error('No such environment present: ' + env);
            return environments[env];
        };

        this.getActive = function () {
            if (!selectedEnv)
                throw new Error('You must configure at least one environment');

            return environments[selectedEnv];
        };

        this.getApiRoute = function () {
            var active = self.getActive();
            return active.root + (active.port ? ':' + active.port : '') +
                active.api + (active.version ? '/' + active.version : '');
        };

        this.$get = [function () {
            return self;
        }];
    };

    function resourceConfig(environmentProvider) {

        //This even allows you to change environment in runtime.
        environmentProvider.setEnvironments({
            dev: {
                root: 'http://localhost:8090',
                api: '/sga/api',
                version: 'v1'
            },
            localonly: {
                root: 'http://localhost:8090',
                api: '/sga/api',
                version: 'v1'
            },
            prod: {
                root: 'http://10.125.170.52',
                api: '/sga/api',
                version: 'v1'
            }
        });

    //Set prod as the active schema
    //environmentProvider.setActive('dev');
    };

})();