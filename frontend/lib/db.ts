import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  host: 'mysql',            // Nom du service dans docker-compose
  user: 'root',
  password: 'rootpassword',
  database: 'tp_db',
  port: 3306,
});