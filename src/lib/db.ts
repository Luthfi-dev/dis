
import mysql from 'mysql2/promise';

// This configuration is now a factory function to ensure fresh config for each pool instance.
const dbConfig = {
    host: '195.88.211.130',
    user: 'maudigic_gg',
    password: 'B4ru123456_',
    database: 'maudigic_buku_induk_siswa',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // Enable keep-alive packets to prevent timeout issues
    connectTimeout: 20000, 
};

// Create a single, shared pool instance
const pool = mysql.createPool(dbConfig);

// Export the pool directly. It's designed to handle connection management.
export default pool;
