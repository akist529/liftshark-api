require('dotenv').config();
const mysql = require('mysql');
const util = require('util');

const db = mysql.createConnection({
    host        : process.env.HOST,
    port        : process.env.PORT,
    user        : process.env.USER,
    password    : process.env.PWRD,
    database    : process.env.DATABASE
});

db.query = util.promisify(db.query).bind(db);

db.connect(err => {
    if (err) {
        throw new Error(err);
    }

    console.log('Connected to MySQL Database');
});

module.exports = db;