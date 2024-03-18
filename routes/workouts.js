const express = require('express');
const router = express.Router();

const db = require('../db');
const { tableExists, itemExists, getTableData } = require('../helpers');

router.get('/', async (req, res) => {
    const workoutsExists = await tableExists('workouts');

    if (!workoutsExists) {
        return res.status(200).json({ message: 'No data found for workouts', data: [] });
    }

    const data = await getTableData('workouts');
    return res.status(200).json({ success: 'Fetched data from workouts database', data });
});

router.post('/', async (req, res) => {
    const workoutsExists = await tableExists('workouts');

    if (!workoutsExists) {
        const queryString = 'CREATE TABLE workouts (id INT PRIMARY KEY AUTO_INCREMENT, date VARCHAR(255) NOT NULL)';

        await db.query(queryString).then(res => {
            console.log('Created personal workouts table');
        }).catch(err => {
            throw new Error(err);
        });
    }

    const routinesExists = await tableExists('routines');

    if (!routinesExists) {
        const queryString = 'CREATE TABLE routines (id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(255) NOT NULL, day VARCHAR(255) NOT NULL)';

        await db.query(queryString).then(res => {
            console.log('Created personal routines table');
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
        const queryString = 'CREATE TABLE sets (id INT PRIMARY KEY AUTO_INCREMENT, weight INT NOT NULL, reps INT NOT NULL, entry_id INT NOT NULL, routine_id INT, workout_id INT, FOREIGN KEY (entry_id) REFERENCES entries(id), FOREIGN KEY (routine_id) REFERENCES routines(id), FOREIGN KEY (workout_id) REFERENCES workouts(id))';

        await db.query(queryString).then(res => {
            console.log('Created workout sets table');
        }).catch(err => {
            throw new Error(err);
        });
    }

    const date = req.body.date;
    const entries = req.body.entries;
    let queryString = `SELECT * FROM workouts WHERE date LIKE '${date}'`;

    const workoutsLogged = await db.query(queryString).then(res => {
        if (res.length === 2) return true;
            else return false;
    }).catch(err => {
        throw new Error(err);
    });

    if (workoutsLogged) {
        console.log(`Max number of workouts already logged for date ${date}`);
        return res.status(200).json({ error: `Max number of workouts already logged for date ${date}` });
    }

    const newWorkout = ({
        date
    });

    queryString = 'INSERT INTO workouts SET ?';

    await db.query(queryString, newWorkout).then(res => {
        console.log('Added new workout');
    }).catch(err => {
        throw new Error(err);
    });

    queryString = 'SELECT LAST_INSERT_ID()';

    const workout_ID_response = await db.query(queryString).catch(err => {
        throw new Error(err);
    });

    const workout_ID = JSON.parse(JSON.stringify(workout_ID_response))[0]['LAST_INSERT_ID()'];

    for (const entry of entries) {
        const newEntry = ({
            name: entry.name,
            origin: 'workouts',
            workout_id: workout_ID
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
                workout_id: workout_ID
            });

            queryString = 'INSERT INTO sets SET ?';

            await db.query(queryString, newSet).catch(err => {
                throw new Error(err);
            });
        }
    }

    return res.status(201).json({ success: 'Added new workout' });
});

router.put('/:id', async (req, res) => {
    const workoutsExists = await tableExists('workouts');
    const entriesExists = await tableExists('entries');
    const setsExists = await tableExists('sets');

    if (!workoutsExists || !entriesExists || !setsExists) {
        return res.status(200).json({ error: 'No workouts exist' });
    }

    const id = req.params.id;
    let queryString = 'SELECT * FROM workouts WHERE id LIKE ?';

    const workoutExists = await db.query(queryString, id).then(res => {
        if (res.length > 0) return true;
            else return false;
    })

    if (!workoutExists) {
        return res.status(200).json({ error: 'Workout does not exist' });
    }

    const date = req.body.date;
    const entries = req.body.entries;
    queryString = `UPDATE workouts SET date = '${date}' WHERE id = ${id}`;

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

    console.log(`Updated workout with id = ${id}`);
    return res.status(200).json({ success: `Updated workout with id = ${id}` });
});

router.delete('/:id', async (req, res) => {
    const workoutsExists = await tableExists('workouts');

    if (!workoutsExists) {
        return res.status(200).json({ error: 'No workouts exist' });
    }

    const id = req.params.id;
    const workoutExists = await itemExists('workouts', 'id', id);

    if (!workoutExists) {
        console.log(`Tried to delete workout with id = ${id} which does not exist`);
        return res.status(200).json({ error: `Tried to delete workout with id = ${id} which does not exist` });
    }

    let queryString = `DELETE FROM sets WHERE workout_id = ${id}`;

    await db.query(queryString).catch(err => {
        throw new Error(err);
    });

    queryString = `DELETE FROM entries WHERE workout_id = ${id}`;

    await db.query(queryString).catch(err => {
        throw new Error(err);
    });

    queryString = `DELETE FROM workouts WHERE id = ${id}`;

    await db.query(queryString).catch(err => {
        throw new Error(err);
    });

    console.log(`Deleted workout with id = ${id}`);
    return res.status(200).json({ success: `Deleted workout with id = ${id}` });
});

module.exports = router;