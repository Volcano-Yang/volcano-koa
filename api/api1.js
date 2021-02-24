const Router = require("koa-router");
const { User } = require("../model/user");
const router = new Router();

router.get("/api1", async (ctx, next) => {
  User.create({
    nickname: "sparkyang",
    email: "648941183@qq.com",
    password: "1111",
    opendId: "222",
  });
  ctx.body = "api1";
});

module.exports = router;
