const { Pool } = require('pg')

module.exports = new Pool({
    user: 'postgres',
    password: 56913594,
    host: 'localhost',
    port: 5432,
    database: 'launchstore'
})