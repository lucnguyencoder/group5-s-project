//done
const Sequelize = require("sequelize");
const { consola } = require("consola");

const getLoggingConfig = () => {
  const env = process.env.NODE_ENV || 'development';

  if (env === 'production') {
    return false;
  } else if (env === 'test') {
    return false;
  } else {
    return false;
  }
};

const sequelize = new Sequelize(
  process.env.DB_NAME || "swp391_db",
  process.env.DB_USER || "user",
  process.env.DB_PASSWORD || "password",
  {
    host: process.env.DB_HOST || "db",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: getLoggingConfig(),
    timezone: '+07:00',
    dialectOptions: {
      charset: 'utf8mb4',
      timezone: '+07:00',
      dateStrings: true,
      typeCast: true
    },
    define: {
      timestamps: true,
      underscored: true
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    retry: {
      max: 5,
      match: [/Deadlock/i, /SequelizeConnectionError/],
    },
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    consola.success("Database connection established successfully.");
  } catch (error) {
    consola.error("Unable to connect to the database:", error);
    throw error;
  }
};

const syncDB = async (force = false, alter = true) => {
  try {
    await sequelize.sync({ force, alter });
  } catch (error) {
    consola.error("[DB] Error syncing:", error);
    throw error;
  }
};


module.exports = {
  sequelize,
  connectDB,
  syncDB,
};
