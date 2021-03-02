const basicAuth = require("basic-auth");
const jwt = require("jsonwebtoken");

class Auth {
    constructor(level) {
        // 实例属性
        this.level = level || 1;
    }
    // 类静态属性
    static USER = 8;
    static ADMIN = 16;
    static SUPER_ADMIN = 32;

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

    get m() {
        return async (ctx, next) => {
            const userToken = basicAuth(ctx.req);
            let errMsg = "token不合法";

            if (!userToken || !userToken.name) {
                throw new global.errs.Forbbiden(errMsg);
            }
            try {
                var decode = jwt.verify(
                    userToken.name,
                    global.config.security.secretKey
                );
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

            // uid,scope
            ctx.auth = {
                uid: decode.uid,
                scope: decode.scope,
            };

            await next();
        };
    }
}

module.exports = {
    Auth,
};
