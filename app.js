const Koa = require("koa");
const Router = require("koa-router");
const static = require("koa-static");
const logger = require("koa-logger");
const requireDirectory = require("require-directory");
const Moment = require("moment");
const path = require("path");

require('module-alias/register')

const app = new Koa();

app.use(
  logger((str, args) => {
    console.log(Moment().format("YYYY-MM-DD HH:mm:ss") + str);
  })
);

function whenLoadModule(router) {
  if (router instanceof Router)
    app.use(router.routes()).use(router.allowedMethods());
}

requireDirectory(module, path.join(__dirname, "/api"), {
  visit: whenLoadModule,
});

app.use(static(path.join(__dirname, "/static")));

const port = 3000;

app.listen(port);
console.log("程序已经启动，在" + port + "端口监听");
