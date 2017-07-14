'use strict';
/**
 * Created by anzer on 2017/2/28.
 */
const is = require('is-type-of');
const assert = require('assert');
const compose = require('koa-compose');
module.exports = app => {
    const controllerHooks = app.controllerHooks = {};
    const actionHooks = app.actionHooks = {};

    function wrapAction(action) {
        return function* controllerAction(next) {
            yield action;
            if (!this.__preventNext) {
                yield* next;
            }
        };
    }

    function wrapHook(action, ctrlKey, actionKey, ctrl) {
        return function* ctrlHook() {
            this.controllerKey = ctrlKey;
            this.actionKey = actionKey;
            let hooks = [];
            if (controllerHooks[ctrlKey]) {
                hooks = hooks.concat(controllerHooks[ctrlKey]);
            }
            if (actionHooks[ctrlKey] && actionHooks[ctrlKey][actionKey]) {
                hooks = hooks.concat(actionHooks[ctrlKey][actionKey]);
            }
            if (ctrl.__before) {
                hooks.push(wrapAction(ctrl.__before));
            }
            hooks.push(wrapAction(action));
            if (ctrl.__after) {
                hooks.push(wrapAction(ctrl.__after));
            }

            yield compose(hooks);
        };
    }

    app.controllerHook = function controllerHook(ctrlKey, fn) {
        assert(is.generatorFunction(fn), 'hook must be a generator function');
        if (!controllerHooks[ctrlKey]) {
            controllerHooks[ctrlKey] = [];
        }
        controllerHooks[ctrlKey].push(fn);
    };
    app.actionHook = function actionHook(ctrlKey, actionKey, fn) {
        assert(is.generatorFunction(fn), 'hook must be a generator function');
        if (!actionHooks[ctrlKey]) {
            actionHooks[ctrlKey] = {};
        }
        if (!actionHooks[ctrlKey][actionKey]) {
            actionHooks[ctrlKey][actionKey] = [];
        }

        actionHooks[ctrlKey][actionKey].push(fn);

    };

    const loadRouter = app.loader.loadRouter;
    app.loader.loadRouter = function() {
        init();
        loadRouter.call(this, ...arguments);
    };
    function init() {
        if (is.object(app.controller)) {
            const ctrlKeys = Object.keys(app.controller);

            ctrlKeys.forEach(ctrlKey => {
                const ctrl = app.controller[ctrlKey];
                const actionKeys = Object.keys(ctrl);
                actionKeys.forEach(actionKey => {
                    if (!actionKey.startsWith('_')) {
                        ctrl[actionKey] = wrapHook(ctrl[actionKey], ctrlKey, actionKey, ctrl);
                    }
                });

            });
        }

    }
};
