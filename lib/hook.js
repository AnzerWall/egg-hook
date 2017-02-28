'use strict';
/**
 * Created by anzer on 2017/2/28.
 */
const is = require('is-type-of');
const assert = require('assert');
const compose = require('koa-compose');
module.exports = app => {
    const hook = app.hook = {};
    function wrapAction(action) {
        return function *controllerAction(next) {
            yield action;
            yield *next;
        }
    }
    function wrapHook(action, ctrlKey, actionKey) {
        return function* ctrlHook() {
            this.actionKey = actionKey;
            this.controllerKey = ctrlKey;
            yield compose([...hook[ctrlKey].before, wrapAction(action),...hook[ctrlKey].after]);
        };
    }

    app.beforeHook = function beforeHook(key, fn) {
        assert(is.generatorFunction(fn), 'hook must be a generator function');
        if (!hook[key]) {
            hook[key] = {
                before: [],
                after: [],
            };
        }
        hook[key].before.push(fn);
    };
    app.afterHook = function afterHook(key, fn) {
        assert(is.generatorFunction(fn), 'hook must be a generator function');
        if (!hook[key]) {
            hook[key] = {
                before: [],
                after: [],
            };
        }
        hook[key].after.push(fn);

    };

    const loadRouter = app.loader.loadRouter;
    app.loader.loadRouter = function () {
        init();
        loadRouter.call(this, ...arguments);
    };
    function init() {
        if (is.object(app.controller)) {
            const ctrlKeys = Object.keys(app.controller);

            ctrlKeys.forEach(ctrlKey => {
                const ctrl = app.controller[ctrlKey];
                const actionKeys = Object.keys(ctrl);
                if (!hook[ctrlKey]) {
                    hook[ctrlKey] = {
                        before: [],
                        after: [],
                    };
                }
                actionKeys.forEach(actionKey => {
                    if (!actionKey.startsWith("_")) {
                        ctrl[actionKey] = wrapHook(ctrl[actionKey], ctrlKey, actionKey);
                    }
                });

            });
        }

    }
};
