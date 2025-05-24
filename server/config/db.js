const sql = require('mssql');
require('dotenv').config();

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT, 10),
    options: {
        encrypt: process.env.DB_ENCRYPT === 'true', // Convertir a booleano
        trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true' // Convertir a booleano
    }
};

const poolPromise = new sql.ConnectionPool(dbConfig)
    .connect()
    .then(pool => {
        console.log('Conexión a la base de datos establecida');
        return pool;
    })
    .catch(err => {
        console.error('Error al conectar con la base de datos:', err);
        throw err;
    });

module.exports = {
    sql,
    poolPromise
};
