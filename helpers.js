const db = require('./db');

const tableExists = async function (name) {
    const queryString = `SHOW TABLES like '${name}'`;

    return await db.query(queryString).then(res => {
        if (res.length > 0) return true;
            else return false;
    }).catch(err => {
        throw new Error(err);
    });
}

const itemExists = async function (table, variable, value) {
    const queryString = `SELECT * FROM ${table} WHERE ${variable} LIKE ${value}`;

    return await db.query(queryString).then(res => {
        if (res.length > 0) return true;
            else return false;
    }).catch(err => {
        throw new Error(err);
    });
}

const getTableData = async function (table) {
    const queryString = `SELECT * FROM ${table}`;

    const tableExistsVar = await tableExists(table);

    if (!tableExistsVar) {
        return res.status(200).json({ success: `No data exists in ${table}`, data: [] })
    } else {
        return db.query(queryString).then(res => {
            console.log(`Fetched data from ${table}`);
            return res;
        });
    }
}

exports.tableExists = tableExists;
exports.itemExists = itemExists;
exports.getTableData = getTableData;