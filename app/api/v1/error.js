const Router = require("koa-router");
const router = new Router();

router.get("/error", async (ctx, next) => {
  throw new global.errs.NotFound();
});

module.exports = router;
