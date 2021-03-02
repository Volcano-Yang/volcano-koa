const bcrypt = require("bcryptjs");
const Router = require("koa-router");
const { RegisterValidator, LoginValidator } = require("@validator/validator");
const { User } = require("@models/user");
const { Auth } = require("@core/auth");

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

router.post("/login", async (ctx) => {
    console.log("ctx.request.body", ctx.request.body);

    const v = await new LoginValidator().validate(ctx);
    const email = v.get("body.email");
    const plainPassword = v.get("body.password");
    const user = await User.findOne({
        where: {
            email,
        },
    });

    if (!user) {
        throw new global.errs.AuthFailed("账号不存在");
    }

    const isCorrect = bcrypt.compareSync(plainPassword, user.password);
    if (!isCorrect) {
        throw new global.errs.AuthFailed("密码不正确");
    }

    const token = Auth.generateToken(user.id, Auth.USER);

    ctx.body = {
        msg: "登录成功",
        code: 200,
        token,
    };
});

module.exports = router;
