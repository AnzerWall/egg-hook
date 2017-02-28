'use strict'
/**
 * Created by anzer on 2017/2/28.
 */
module.exports = app => {

    app.beforeHook('home', function *(next) {
        this.body = "hi, ";
        yield *next;
    });
    app.afterHook('home', function *(next) {
        this.body += "hook";
        yield *next;
    })
}