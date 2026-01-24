import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "0610",
  database: "e_commerce",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
