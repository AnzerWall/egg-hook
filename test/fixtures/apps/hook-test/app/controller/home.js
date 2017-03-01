'use strict'
/**
 * Created by anzer on 2017/2/28.
 */
module.exports = app => {
    return class home extends app.Controller {
        __before() {
            console.log("before");

            const {ctx}=this;
            if (!ctx.isLogin) {
                return ctx.preventNext();//skip index() and __after()
            }

        }
        *index() {
            console.log("action");
            //ctx.preventNext()      //skip __after()
        }

        __after() {
            console.log("after");
        }
    }
}