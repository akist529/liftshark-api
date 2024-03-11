const express = require('express');
const router = express.Router();

const db = require('../db');
const { tableExists, itemExists, getTableData } = require('../helpers');

router.get('/', async (req, res) => {
    const recordsExists = await tableExists('records');

    if (!recordsExists) {
        return res.status(200).json({ message: 'No data found for personal records', data: [] });
    }

    const data = await getTableData('records');
    return res.status(200).json({ success: 'Fetched data from records database', data });
});

router.post('/', async (req, res) => {
    const recordsExists = await tableExists('records');

    if (!recordsExists) {
        const queryString = 'CREATE TABLE records (id INT AUTO_INCREMENT, date VARCHAR(255), exercise INT, max INT, PRIMARY KEY(id))';

        await db.query(queryString).then(res => {
            console.log('Created records table');
        }).catch(err => {
            throw new Error(err);
        });
    }

    const date = req.body.date;
    const exercise = req.body.exercise;
    const max = req.body.max;
    let queryString = `SELECT * FROM records WHERE date LIKE '${date}' AND exercise LIKE ${exercise}`;

    const recordExists = await db.query(queryString).then(res => {
        if (res.length > 0) return true;
            else return false;
    }).catch(err => {
        throw new Error(err);
    });

    if (recordExists) {
        console.log('Record already logged');
        return res.status(200).json({ message: 'Record already logged' });
    }

    const newRecord = ({
        date,
        exercise,
        max
    });

    queryString = 'INSERT INTO records SET ?';

    await db.query(queryString, newRecord).then(res => {
        console.log('Added new personal record');
    }).catch(err => {
        throw new Error(err);
    });

    return res.status(201).json({ success: 'Added new measurement' });
});

router.put('/:id', async (req, res) => {
    const recordsExists = await tableExists('records');

    if (!recordsExists) {
        return res.status(200).json({ error: 'No personal records exist' });
    }

    const id = req.params.id;
    let queryString = 'SELECT * FROM records WHERE id LIKE ?';

    const recordExists = await db.query(queryString, id).then(res => {
        if (res.length > 0) return true;
            else return false;
    });

    if (!recordExists) {
        return res.status(200).json({ error: 'Personal record does not exist' });
    }

    const date = req.body.date;
    const exercise = req.body.exercise;
    const max = req.body.max;
    queryString = `UPDATE records SET date = '${date}', exercise = ${exercise}, max = ${max} WHERE id = ${id}`;

    await db.query(queryString).then(res => {
        console.log(`Updated personal record with id = ${id}`);
    }).catch(err => {
        throw new Error(err);
    });

    return res.status(201).json({ success: `Updated personal record with id = ${id}` });
});

router.delete('/:id', async (req, res) => {
    const recordsExists = await tableExists('records');

    if (!recordsExists) {
        console.log('Personal records table does not exist');
        return res.status(200).json({ error: 'Personal records table does not exist' });
    }

    const id = req.params.id;
    const recordExists = await itemExists('records', 'id', id);

    if (!recordExists) {
        console.log(`Tried to delete personal record with id = ${id} which does not exist`);
        return res.status(200).json({ error: `Tried to delete personal record with id = ${id} which does not exist` });
    }

    const queryString = `DELETE FROM records WHERE id = ${id}`;

    await db.query(queryString, id).then(res => {
        console.log(`Deleted personal record with id = ${id}`);
    }).catch(err => {
        throw new Error(err);
    });

    return res.status(200).json({ success: `Deleted measurement with id = ${id}` });
});

module.exports = router;