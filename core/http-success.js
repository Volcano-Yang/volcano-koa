const { HttpException } = require("./http-exception");

class HttpSuccess extends HttpException {
    constructor(msg = "成功", errorCode = 200, code = 200) {
        super();
        this.errorCode = errorCode;
        this.code = code;
        this.msg = msg;
    }
}

module.exports = {
    HttpSuccess,
};
