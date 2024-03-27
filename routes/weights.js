const express = require('express');
const router = express.Router();

const db = require('../db');
const { tableExists, itemExists, getTableData } = require('../helpers');

router.get('/', async (req, res) => {
    const weightsExists = await tableExists('weights');

    if (!weightsExists) {
        return res.status(200).json({ data: [] });
    }

    const data = await getTableData('weights');
    return res.status(200).json({ data });
});

router.post('/', async (req, res) => {
    const weightsExists = await tableExists('weights');

    if (!weightsExists) {
        const queryString = 'CREATE TABLE weights (id INT PRIMARY KEY AUTO_INCREMENT, date VARCHAR(255) NOT NULL, measurement INT NOT NULL)';

        await db.query(queryString).then(res => {
            console.log('Created weights table');
        }).catch(err => {
            throw new Error(err);
        });
    }

    const date = req.body.date;
    const measurement = req.body.measurement;
    let queryString = `SELECT * FROM weights WHERE date LIKE '${date}' AND measurement LIKE ${measurement}`;

    const weightExists = await db.query(queryString).then(res => {
        if (res.length > 0) return true;
            else return false;
    }).catch(err => {
        throw new Error(err);
    });

    if (weightExists) {
        console.log('Weight already logged');
        return res.status(200).json({ error: 'Weight already logged' });
    }

    const newWeight = ({
        date,
        measurement
    });

    queryString = 'INSERT INTO weights SET *';

    await db.query(queryString, newWeight).then(res => {
        console.log('Added new weight');
    }).catch(err => {
        throw new Error(err);
    });

    return res.status(201).json({ success: 'Added new weight' });
});

router.put('/:id', async (req, res) => {
    const weightsExists = await tableExists('weights');

    if (!weightsExists) {
        return res.status(200).json({ error: 'No weights exist' });
    }

    const id = req.params.id;
    let queryString = 'SELECT * FROM weights WHERE id LIKE ?';

    const weightExists = await db.query(queryString, id).then(res => {
        if (res.length > 0) return true;
            else return false;
    });

    if (!weightExists) {
        return res.status(200).json({ error: 'Weight does not exist' });
    }

    const date = req.body.date;
    const measurement = req.body.measurement;
    queryString = `UPDATE weights SET date = '${date}', measurement = ${measurement} WHERE id = ${id}`;

    await db.query(queryString).then(res => {
        console.log(`Updated weight with id = ${id}`);
    }).catch(err => {
        throw new Error(err);
    });

    return res.status(201).json({ success: `Updated weight with id = ${id}` });
});

router.delete('/:id', async (req, res) => {
    const weightsExists = await tableExists('weights');

    if (!weightsExists) {
        return res.status(200).json({ error: 'No weights exist' });
    }

    const id = req.params.id;
    const weightExists = await itemExists('weights', 'id', id);

    if (!weightExists) {
        console.log(`Tried to delete weight with id = ${id} which does not exist`);
        return res.status(200).json({ error: `Tried to delete weight with id = ${id} which does not exist` });
    }

    const queryString = `DELETE FROM weights WHERE id = ${id}`;

    await db.query(queryString).then(res => {
        console.log(`Deleted weight with id = ${id}`);
    }).catch(err => {
        throw new Error(err);
    });

    return res.status(201).json({ success: `Deleted weight with id = ${id}` });
});

module.exports = router;