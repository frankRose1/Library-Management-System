module.exports = {
  "development": {
    "username": process.env.POSTGRES_USER || "root",
    "password": process.env.POSTGRES_PASSWORD || null,
    "database": process.env.POSTGRES_DB || "dev",
    "host": process.env.POSTGRES_HOST || "127.0.0.1",
    "dialect": "postgres"
  },
  "test": {
    "username": process.env.POSTGRES_USER || "root",
    "password": process.env.POSTGRES_PASSWORD || null,
    "database": process.env.POSTGRES_DB || "test",
    "host": process.env.POSTGRES_HOST || "127.0.0.1",
    "dialect": "postgres",
    "logging": false
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "postgres"
  }
};