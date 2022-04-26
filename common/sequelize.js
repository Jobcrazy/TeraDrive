const { Sequelize } = require('sequelize');
const config = require('config');

let sequelize = null;

function initSequelize() {
    let config_mysql = null;
    if (process.env.PHASE === "production") {
        config_mysql = config.get('production.db.mysql');
    } else {
        config_mysql = config.get('development.db.mysql');
    }

    if (!sequelize) {
        sequelize = new Sequelize(
            config_mysql.database,
            config_mysql.username,
            config_mysql.password,
            {
                host: config_mysql.host,
                dialect: "mysql",
                engine: 'MYISAM',
                pool: {
                    max: config_mysql.max_connections,
                    min: config_mysql.min_connections,
                    acquire: config_mysql.connect_time_out,
                    evict: config_mysql.remove_idle_time
                }
            });
        console.log("Database Initialized!");
    }
    return sequelize;
}

module.exports = initSequelize();
