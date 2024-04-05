const { DataSource } = require("typeorm");

const AppDataSource = new DataSource({
  type: "postgres",
  port: process.env.PGPORT,
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  entities: [
    "dist/models/*.js",
    "node_modules/@medusajs/medusa/dist/models/!(*.index.js)",
  ],
  migrations: [
    "dist/migrations/*.js",
    "node_modules/@medusajs/medusa/dist/migrations/*.js",
  ],
});

module.exports = {
  datasource: AppDataSource,
};
