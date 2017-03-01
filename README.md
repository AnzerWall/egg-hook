# egg-hook

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-hook.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-hook
[travis-image]: https://img.shields.io/travis/eggjs/egg-hook.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/egg-hook
[codecov-image]: https://img.shields.io/codecov/c/github/eggjs/egg-hook.svg?style=flat-square
[codecov-url]: https://codecov.io/github/eggjs/egg-hook?branch=master
[david-image]: https://img.shields.io/david/eggjs/egg-hook.svg?style=flat-square
[david-url]: https://david-dm.org/eggjs/egg-hook
[snyk-image]: https://snyk.io/test/npm/egg-hook/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-hook
[download-image]: https://img.shields.io/npm/dm/egg-hook.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-hook

添加controller级别或者action级别中间件。

提供控制器级别 __before和__after这两个前后置action。

## 安装

```bash
$ npm i egg-hook --save
```

## 用法
启用插件

```js
// {app_root}/config/plugin.js
exports.hook = {
  enable: true,
  package: 'egg-hook',
};
```

启动自定义文件中添加hook
### app.controllerHook(controllerKey,hook)

```js
 //app.js
app.controllerHook('home', function *(next) {
    console.log(this.controllerKey);//GET /   => controller.index  =>  controllerKey=>"home"
    console.log(this.actionKey);// GET /   => controller.index  =>  actionKey="index"
    this.body = "hi, ";
    yield next;
});
```

### app.actionHook(controllerKey,actionKey,hook)


```javascript
  //app.js
app.actionHook('home', 'index', function *(next) {
    console.log(this.controllerKey);//GET /   => controller.index  =>  controllerKey=>"home"
    console.log(this.actionKey);// GET /   => controller.index  =>  actionKey="index"
    this.body += "hook";
    yield next;
});
```

控制器前后置钩子

```javascript
//app/controller/home.js
module.exports = app => {
    return class home extends app.Controller {
        __before(){
            console.log("before");

            const {ctx}=this;
            if(!ctx.isLogin){
                return ctx.preventNext();//skip index() and __after()
            }

        }
        *index() {
            console.log("action");
            //ctx.preventNext()      //skip __after()
        }
        __after(){
            console.log("after");
        }
    }
}
```
## 应用场景


<!--
## 配置

```js
// {app_root}/config/config.default.js
exports.hook = {
};
```

see [config/config.default.js](config/config.default.js) for more detail.
 -->
<!-- ## Example  -->

<!-- example here -->

## Questions & Suggestions

Please open an issue [here](https://github.com/eggjs/egg/issues).

## License

[MIT](LICENSE)
