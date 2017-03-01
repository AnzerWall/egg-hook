'use strict'
/**
 * Created by anzer on 2017/2/28.
 */
module.exports = app => {

    app.controllerHook('home', function *(next) {
        console.log(this.controllerKey);//GET /   => controller.index  =>  controllerKey=>"home"
        console.log(this.actionKey);// GET /   => controller.index  =>  actionKey="index"
        this.body = "hi, ";
        yield next;

    });
    app.actionHook('home', 'index', function *(next) {
        console.log(this.controllerKey);//GET /   => controller.index  =>  controllerKey=>"home"
        console.log(this.actionKey);// GET /   => controller.index  =>  actionKey="index"
        this.body += "hook";
        yield next;
    });

}