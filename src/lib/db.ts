
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: '195.88.211.130',
    user: 'maudigic_gg',
    password: 'B4ru123456_',
    database: 'maudigic_buku_induk_siswa', // Ganti dengan nama database Anda
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool;
