const Koa = require("koa");
const logger = require("koa-logger");
const bodyParser = require("koa-bodyparser");
const Moment = require("moment");
const InitManager = require("./core/init");

require("module-alias/register");

const app = new Koa();

app.use(
    logger((str, args) => {
        console.log(Moment().format("YYYY-MM-DD HH:mm:ss") + str);
    })
);

app.use(bodyParser());

InitManager.initCore(app);

app.listen(global.config.port);
console.log("程序已经启动，在" + global.config.port + "端口监听");
