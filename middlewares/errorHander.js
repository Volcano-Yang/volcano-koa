const { HttpException } = require("../core/http-exception");

const catchError = async (ctx, next) => {
    try {
        await next();
    } catch (error) {
        const isHttpException = error instanceof HttpException;
        const isDev = global.config.environment === "dev";

        /**
         * 1. 开发过程中我们经常会遇到一些奇怪的错误，这些是我们是我们之前没有想到的错误情况，都是非HttpException的。
         * 2. 在开发环境中，遇到错误不抛出，只是返回500，没有错误报告的打印，这样会不便于我们的开发。
         */
        
        if (isDev && !isHttpException) {
            throw error;
        }

        if (isHttpException) {
            // 意料之中的情况
            ctx.body = {
                msg: error.msg,
                error_code: error.errorCode,
                request: `${ctx.method} ${ctx.path}`,
            };
            ctx.status = error.code;
        } else {
            // 意料之外的情况
            ctx.body = {
                msg: "we made a mistake O(∩_∩)O~~",
                error_code: 999,
                request: `${ctx.method} ${ctx.path}`,
            };
            ctx.status = 500;
        }
    }
};

module.exports = catchError;
