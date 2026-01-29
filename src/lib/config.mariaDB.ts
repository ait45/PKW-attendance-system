import mariaDB from "mariadb";

if (!process.env.MARIA_DB_HOST) throw new Error("MARIA_DB_HOST is not defined");
if (!process.env.MARIA_DB_USER) throw new Error("MARIA_DB_USER is not defined");
if (!process.env.MARIA_DB_PASSWORD)
  throw new Error("MARIA_DB_PASSWORD is not defined");
if (!process.env.MARIA_DB_DATABASE)
  throw new Error("MARIA_DB_DATABASE is not defined");

export const MariaDBConnection: mariaDB.Pool = mariaDB.createPool({
  host: process.env.MARIA_DB_HOST as string,
  user: process.env.MARIA_DB_USER as string,
  password: process.env.MARIA_DB_PASSWORD as string,
  database: process.env.MARIA_DB_DATABASE as string,
  connectTimeout: 10000,
  connectionLimit: 5,
});
