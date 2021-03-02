const { Sequelize } = require("sequelize");

const {
    dbName,
    user,
    password,
    host,
    port,
} = require("@config/config.js").dataBase;

const sequelize = new Sequelize(dbName, user, password, {
    dialect: "mysql",
    host,
    port,
    logging: true,
    timezone: "+08:00",
    define: {
        // sequelize自动帮助我们创建create_time  update_time delete_time三个值，委托软删除
        timestamps: true,
        paranoid: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        deletedAt: "deleted_at",
        // 将所有的驼峰换成下划线
        underscored: true,
        // 模型名和数据库表名一致
        freezeTableName: true,
        scopes: {
            bh: {
                attributes: {
                    exclude: ["updated_at", "deleted_at", "created_at"],
                },
            },
        },
    },
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
})();

// 在连接数据库后自动同步所有的model
sequelize.sync({
    // 如果为ture，则先强制删除后创建
    force: false,
});

module.exports = {
    db: sequelize,
};
