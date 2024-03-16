const express = require('express');
const router = express.Router();

const db = require('../db');
const { tableExists, itemExists, getTableData } = require('../helpers');

router.get('/', async (req, res) => {
    const routinesExists = await tableExists('routines');

    if (!routinesExists) {
        return res.status(200).json({ message: 'No data found for workout routines', data: [] });
    }

    const data = await getTableData('routines');
    return res.status(200).json({ success: 'Fetched data from routines database', data });
});

router.post('/', async (req, res) => {
    const routinesExists = await tableExists('routines');

    if (!routinesExists) {
        const queryString = 'CREATE TABLE routines (id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(255) NOT NULL, day VARCHAR(255) NOT NULL)';

        await db.query(queryString).then(res => {
            console.log('Created personal routines table');
        }).catch(err => {
            throw new Error(err);
        });
    }

    const workoutsExists = await tableExists('workouts');

    if (!workoutsExists) {
        const queryString = 'CREATE TABLE workouts (id INT PRIMARY KEY AUTO_INCREMENT, date VARCHAR(255) NOT NULL)';

        await db.query(queryString).then(res => {
            console.log('Created personal workouts table');
        }).catch(err => {
            throw new Error(err);
        });
    }

    const entriesExists = await tableExists('entries');

    if (!entriesExists) {
        const queryString = 'CREATE TABLE entries (id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(255) NOT NULL, origin VARCHAR(255) NOT NULL, workout_id INT, routine_id INT, FOREIGN KEY (workout_id) REFERENCES workouts(id), FOREIGN KEY (routine_id) REFERENCES routines(id))';

        await db.query(queryString).then(res => {
            console.log('Created workout entries table');
        }).catch(err => {
            throw new Error(err);
        });
    }

    const setsExists = await tableExists('sets');

    if (!setsExists) {
        const queryString = 'CREATE TABLE sets (id INT PRIMARY KEY AUTO_INCREMENT, weight INT NOT NULL, reps INT NOT NULL, entry_id INT NOT NULL, routine_id INT NOT NULL, FOREIGN KEY (entry_id) REFERENCES entries(id), FOREIGN KEY (routine_id) REFERENCES routines(id))';

        await db.query(queryString).then(res => {
            console.log('Created workout sets table');
        }).catch(err => {
            throw new Error(err);
        });
    }

    const name = req.body.name;
    const day = req.body.day;
    const entries = req.body.entries;
    let queryString = `SELECT * FROM routines WHERE name LIKE '${name}' AND day LIKE '${day}'`;

    const routineExists = await db.query(queryString).then(res => {
        if (res.length > 0) return true;
            else return false;
    }).catch(err => {
        throw new Error(err);
    });

    if (routineExists) {
        console.log('Routine already logged');
        return res.status(200).json({ message: 'Routine already logged' });
    }

    const newRoutine = ({
        name,
        day
    });

    queryString = 'INSERT INTO routines SET ?';

    await db.query(queryString, newRoutine).then(res => {
        console.log('Added new personal routine');
    }).catch(err => {
        throw new Error(err);
    });

    queryString = 'SELECT LAST_INSERT_ID()';
    
    const routine_ID_response = await db.query(queryString).catch(err => {
        throw new Error(err);
    });

    const routine_ID = JSON.parse(JSON.stringify(routine_ID_response))[0]['LAST_INSERT_ID()'];

    for (const entry of entries) {
        const newEntry = ({
            name: entry.name,
            origin: 'routines',
            routine_id: routine_ID
        });

        queryString = 'INSERT INTO entries SET ?';

        await db.query(queryString, newEntry).catch(err => {
            throw new Error(err);
        });

        queryString = 'SELECT LAST_INSERT_ID()';

        const entry_ID_response = await db.query(queryString).catch(err => {
            throw new Error(err);
        });

        const entry_ID = JSON.parse(JSON.stringify(entry_ID_response))[0]['LAST_INSERT_ID()'];

        for (const set of entry.sets) {
            const newSet = ({
                weight: set.weight,
                reps: set.reps,
                entry_id: entry_ID,
                routine_id: routine_ID
            });

            queryString = 'INSERT INTO sets SET ?';

            await db.query(queryString, newSet).catch(err => {
                throw new Error(err);
            });
        }
    }

    return res.status(201).json({ success: 'Added new personal routine' });
});

router.put('/:id', async (req, res) => {
    const routinesExists = await tableExists('routines');
    const entriesExists = await tableExists('entries');
    const setsExists = await tableExists('sets');

    if (!routinesExists || !entriesExists || !setsExists) {
        return res.status(200).json({ error: 'No personal routines exist' });
    }

    const id = req.params.id;
    let queryString = 'SELECT * FROM routines WHERE id LIKE ?';

    const routineExists = await db.query(queryString, id).then(res => {
        if (res.length > 0) return true;
            else return false;
    });

    if (!routineExists) {
        return res.status(200).json({ error: 'Personal routine does not exist' });
    }

    const name = req.body.name;
    const day = req.body.day;
    const entries = req.body.entries;
    queryString = `UPDATE routines SET name = '${name}', day = '${day}' WHERE id = ${id}`;

    await db.query(queryString).catch(err => {
        throw new Error(err);
    });

    for (const entry of entries) {
        queryString = `UPDATE entries SET name = '${entry.name}' WHERE id = ${entry.id}`;

        await db.query(queryString).catch(err => {
            throw new Error(err);
        });

        for (const set of entry.sets) {
            queryString = `UPDATE sets SET weight = ${set.weight}, reps = ${set.reps} WHERE id = ${set.id}`;

            await db.query(queryString).catch(err => {
                throw new Error(err);
            });
        }
    }

    console.log(`Updated personal routine with id = ${id}`);
    return res.status(201).json({ success: `Updated personal routine with id = ${id}` });
});

router.delete('/:id', async (req, res) => {
    const routinesExists = await tableExists('routines');

    if (!routinesExists) {
        return res.status(200).json({ error: 'Personal routines table does not exist' });
    }

    const id = req.params.id;
    const recordExists = await itemExists('routines', 'id', id);

    if (!recordExists) {
        console.log(`Tried to delete personal routine with id = ${id} which does not exist`);
        return res.status(200).json({ error: `Tried to delete personal routine with id = ${id} which does not exist` });
    }

    let queryString = `DELETE from sets WHERE routine_id = ${id}`;

    await db.query(queryString).catch(err => {
        throw new Error(err);
    });

    queryString = `DELETE from entries WHERE routine_id = ${id}`;

    await db.query(queryString).catch(err => {
        throw new Error(err);
    });

    queryString = `DELETE FROM routines WHERE id = ${id}`;

    await db.query(queryString).catch(err => {
        throw new Error(err);
    });

    console.log(`Deleted personal routine with id = ${id}`);
    return res.status(200).json({ success: `Deleted personal routine with id = ${id}` });
});

module.exports = router;