const db = require('./db');

exports.tableExists = async function tableExists (name) {
    const queryString = `SHOW TABLES like '${name}'`;

    return await db.query(queryString).then(res => {
        if (res.length > 0) return true;
            else return false;
    }).catch(err => {
        throw new Error(err);
    });
}

exports.itemExists = async function itemExists (table, variable, value) {
    const queryString = `SELECT * FROM ${table} WHERE ${variable} LIKE ${value}`;

    return await db.query(queryString).then(res => {
        if (res.length > 0) return true;
            else return false;
    }).catch(err => {
        throw new Error(err);
    });
}