const express = require('express');
const router = express.Router();

const db = require('../db');
const { tableExists, itemExists, getTableData } = require('../helpers');

router.get('/', async (req, res) => {
    const measurementsExists = await tableExists('measurements');

    if (!measurementsExists) {
        return res.status(200).json({ message: 'No measurements data exists', data: [] });
    }

    const data = await getTableData('measurements');
    return res.status(200).json({ success: 'Fetched data from measurements', data });
});

router.post('/', async (req, res) => {
    const measurementsExists = await tableExists('measurements');

    if (!measurementsExists) {
        const queryString = 'CREATE TABLE measurements (id INT AUTO_INCREMENT, date VARCHAR(255), muscle VARCHAR(255), measurement INT, PRIMARY KEY(id))';

        await db.query(queryString).then(res => {
            console.log('Created measurements table');
        }).catch(err => {
            throw new Error(err);
        });
    }

    const date = req.body.date;
    const muscle = req.body.muscle;
    const measurement = req.body.measurement;
    let queryString = `SELECT * FROM measurements WHERE date LIKE '${date}' AND measurement LIKE '${measurement}'`;

    const measurementExists = await db.query(queryString).then(res => {
        if (res.length > 0) return true;
            else return false;
    }).catch(err => {
        throw new Error(err);
    });

    if (measurementExists) {
        console.log('Measurement already logged');
        return res.status(200).json({ message: 'Measurement already logged' });
    }

    const newMeasurement = ({
        date,
        muscle,
        measurement
    });

    queryString = 'INSERT INTO measurements SET ?';

    await db.query(queryString, newMeasurement).then(res => {
        console.log('Added new measurement');
    }).catch(err => {
        throw new Error(err);
    })

    return res.status(201).json({ success: 'Added new measurement' });
});

router.put('/:id', async (req, res) => {
    const measurementsExists = await tableExists('measurements');

    if (!measurementsExists) {
        return res.status(200).json({ error: 'No measurements exist' });
    }

    const id = req.params.id;
    let queryString = 'SELECT * FROM measurements WHERE id LIKE ?';

    const measurementExists = await db.query(queryString, id).then(res => {
        if (res.length > 0) return true;
            else return false;
    });

    if (!measurementExists) {
        return res.status(200).json({ error: 'Measurement does not exist' });
    }

    const date = req.body.date;
    const muscle = req.body.muscle;
    const measurement = req.body.measurement;
    queryString = `UPDATE measurements SET date = '${date}', muscle = '${muscle}', measurement = ${measurement} WHERE id = ${id}`;

    await db.query(queryString).then(res => {
        console.log(`Updated measurement with id = ${id}`);
    }).catch(err => {
        throw new Error(err);
    });

    return res.status(201).json({ success: `Updated measurement with id = ${id}` });
});

router.delete('/:id', async (req, res) => {
    const measurementsExists = await tableExists('measurements');

    if (!measurementsExists) {
        console.log('Measurements table does not exist');
        return res.status(200).json({ error: 'Measurements table does not exist' });
    }

    const id = req.params.id;
    const measurementExists = await itemExists('measurements', 'id', id);

    if (!measurementExists) {
        console.log(`Tried to delete measurement with id = ${id} which does not exist`);
        return res.status(200).json({ error: `Tried to delete measurement with id = ${id} which does not exist` });
    }

    const queryString = `DELETE FROM measurements WHERE id = ${id}`;

    await db.query(queryString, id).then(res => {
        console.log(`Deleted measurement with id = ${id}`);
    }).catch(err => {
        throw new Error(err);
    });

    return res.status(200).json({ success: `Deleted measurement with id = ${id}` });
});

module.exports = router;