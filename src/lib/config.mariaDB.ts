import mariaDB from "mariadb";

export const MariaDBConnection: mariaDB.Pool = mariaDB.createPool({
  host: process.env.MARIA_DB_HOST as string,
  user: process.env.MARIA_DB_USER as string,
  password: process.env.MARIA_DB_PASSWORD as string,
  database: process.env.MARIA_DB_DATABASE as string,
  connectTimeout: 10000,
  connectionLimit: 5,
});
