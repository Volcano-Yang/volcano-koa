const { Sequelize, Model } = require("sequelize");

const { db } = require("@core/db");

class User extends Model {
    static async verifyEmailPassword(email, plainPassword) {
        const user = await User.findOne({
            where: {
                email,
            },
        });
        if (!user) {
            throw new global.errs.AuthFailed("账号不存在");
        }
        // user.password === plainPassword
        const correct = bcrypt.compareSync(plainPassword, user.password);
        if (!correct) {
            throw new global.errs.AuthFailed("密码不正确");
        }
        return user;
    }
}

User.init(
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nickname: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.STRING,
        openId: {
            type: Sequelize.STRING(64),
            unique: true,
        },
    },
    {
        sequelize: db,
        tableName: "user",
    }
);

module.exports = {
    User,
};
