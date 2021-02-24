const Router = require("koa-router");
const Moment = require("moment");

const router = new Router();

router.get("/api2", async (ctx, next) => {
  ctx.body = `${Moment().format("YYYY-MM-DD HH:mm:ss")} api2`;
});

module.exports = router;
