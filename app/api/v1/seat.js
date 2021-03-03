const Router = require("koa-router");
const { Auth } = require("@core/auth");
const Moment = require("moment");

const router = new Router({
    prefix: "/v1/seat",
});

router.get("/book", new Auth(Auth.USER).verifyScope, async (ctx, next) => {
    ctx.body = `${Moment().format("YYYY-MM-DD HH:mm:ss")} book a seat`;
});

router.get("/delete", new Auth(Auth.ADMIN).verifyScope, async (ctx, next) => {
    ctx.body = `${Moment().format("YYYY-MM-DD HH:mm:ss")} book a seat`;
});

module.exports = router;
