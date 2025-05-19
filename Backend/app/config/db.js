import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const connection = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DB,
  port: process.env.MYSQL_PORT,
  dateStrings: true,
});

connection.query("SELECT 1 + 1 AS solution")
  .then(([results]) => {
    console.log("Database connected. Test result:", results[0].solution);
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });

export default connection;
