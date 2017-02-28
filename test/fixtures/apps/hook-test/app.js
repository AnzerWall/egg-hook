'use strict'
/**
 * Created by anzer on 2017/2/28.
 */
module.exports = app => {

    app.beforeHook('home', function *(next) {
        console.log(this.controllerKey);//GET /   => controller.index  =>  controllerKey=>"home"
        console.log(this.actionKey);// GET /   => controller.index  =>  actionKey="index"
        this.body = "hi, ";
        yield *next;
    });
    app.afterHook('home', function *(next) {
        this.body += "hook";
        yield *next;
    })
}