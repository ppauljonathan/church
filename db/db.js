const mysql=require('mysql2/promise');

module.exports=mysql.createConnection({
    host:'localhost',
    user:'paul',
    database:'test',
    waitForConnections:true,
    connectionLimit:10,
    queueLimit:0
})