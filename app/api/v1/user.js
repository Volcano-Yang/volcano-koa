const bcrypt = require("bcryptjs");
const Router = require("koa-router");
const { RegisterValidator } = require("@validator/validator");
const { User } = require("@models/user");

const router = new Router({
    prefix: "/v1/user",
});

router.post("/register", async (ctx) => {
    console.log("ctx.request.body", ctx.request.body);

    const v = await new RegisterValidator().validate(ctx);

    // 密码需要进行盐加密
    const salt = bcrypt.genSaltSync(10);
    const bcryptPsw = bcrypt.hashSync(v.get("body.password2"), salt);

    const user = {
        email: v.get("body.email"),
        password: bcryptPsw,
        nickname: v.get("body.nickname"),
    };

    console.log("user", user);

    await User.create(user);
    throw new global.success.HttpSuccess("注册成功");
});

module.exports = router;
