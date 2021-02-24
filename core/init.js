const requireDirectory = require("require-directory");
const Router = require("koa-router");
const staticServer = require("koa-static");
const path = require("path");

class InitManager {
  /**
   * 入口方法
   */
  static initCore(app) {
    InitManager.app = app;
    InitManager.loadConfig();
    InitManager.initLoadRouters();
    InitManager.loadHttpException();
    InitManager.initStaticServer();
  }

  static loadConfig() {
    const config = require("@configjs");
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
    // const errors = require('./http-exception')
    // global.errs = errors
  }
}

module.exports = InitManager;
