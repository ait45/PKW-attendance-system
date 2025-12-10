import mariaDB from "mariadb";

export const MariaDBConnection = mariaDB.createPool({
  host: process.env.MARIA_DB_HOST,
  user: process.env.MARIA_DB_USER,
  password: process.env.MARIA_DB_PASSWORD,
  database: process.env.MARIA_DB_DATABASE,
  connectTimeout: 10000,
  connectionLimit: 5,
});
