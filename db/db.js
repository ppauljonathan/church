require('dotenv').config();
const mysql=require('mysql2/promise');

module.exports=mysql.createPool({
    host:process.env.MYSQL_HOST,
    user:process.env.MYSQL_USER,
    database:process.env.MYSQL_DB,
    password:process.env.MYSQL_PASSWORD,
    waitForConnections:true,
    connectionLimit:10,
    queueLimit:0
})