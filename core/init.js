const requireDirectory = require("require-directory");
const Router = require("koa-router");
const staticServer = require("koa-static");
const catchError = require("../middlewares/errorHander");
const path = require("path");

class InitManager {
    /**
     * 入口方法
     */
    static initCore(app) {
        InitManager.app = app;
        InitManager.initErrorHander();
        InitManager.loadConfig();
        InitManager.initLoadRouters();
        InitManager.loadHttpException();
        InitManager.loadHttpSuccess();
        InitManager.initStaticServer();
    }

    static initErrorHander() {
        InitManager.app.use(catchError);
    }

    static loadConfig() {
        const config = require("@config/config.js");
        global.config = config;
    }

    static initLoadRouters() {
        const apiDirectory = `${process.cwd()}/app/api`;
        requireDirectory(module, apiDirectory, {
            visit: whenLoadModule,
        });

        function whenLoadModule(obj) {
            if (obj instanceof Router) {
                InitManager.app.use(obj.routes());
            }
        }
    }

    static initStaticServer() {
        // koa-static 不支持相对路径和路径别名
        InitManager.app.use(staticServer(path.join(__dirname, "../static")));
    }

    static loadHttpException() {
        const errors = require("@core/http-exception");
        global.errs = errors;
    }

    static loadHttpSuccess() {
        const success = require("@core/http-success");
        global.success = success;
    }
}

module.exports = InitManager;
