const jwt = require("jsonwebtoken");

class Auth {
    constructor(level) {
        // 实例属性
        this.level = level || 8;
    }
    // 类静态属性
    static USER = 8;
    static ADMIN = 16;
    static SUPER_ADMIN = 32;

    // scope 是登录角色权限等级
    static generateToken(uid, scope) {
        const secretKey = global.config.security.secretKey;
        const expiresIn = global.config.security.expiresIn;
        const token = jwt.sign(
            {
                uid,
                scope,
            },
            secretKey,
            {
                expiresIn,
            }
        );
        return token;
    }

    static verifyToken(token) {
        try {
            jwt.verify(token, global.config.security.secretKey);
            return true;
        } catch (error) {
            return false;
        }
    }

    get verifyScope() {
        return async (ctx, next) => {
            const userToken = ctx.request.header.authorization;
            console.log("auth.js userToken", userToken);
            let errMsg = "token缺失";
            let decode;

            if (!userToken) {
                throw new global.errs.Forbbiden(errMsg);
            }
            try {
                decode = jwt.verify(
                    userToken,
                    global.config.security.secretKey
                );
                console.log("auth.js decode", decode);
            } catch (error) {
                if (error.name == "TokenExpiredError") {
                    errMsg = "token已过期";
                }
                throw new global.errs.Forbbiden(errMsg);
            }

            if (decode.scope < this.level) {
                errMsg = "权限不足";
                throw new global.errs.Forbbiden(errMsg);
            }

            await next();
        };
    }
}

module.exports = {
    Auth,
};
