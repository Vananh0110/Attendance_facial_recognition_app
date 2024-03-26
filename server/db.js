const Pool = require('pg').Pool;

const pool = new Pool({
    user: "postgres",
    password: "250802",
    host: "localhost",
    database: "attendance_facial_recognition_db"
})

module.exports = pool;