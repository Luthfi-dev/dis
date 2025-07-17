
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: '192.73.27.11',
    user: 'maudigic_gg',
    password: 'maudig123',
    database: 'maudigic_eduarchive', // Ganti dengan nama database Anda
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool;
