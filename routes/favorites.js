const express = require('express');
const router = express.Router();

const db = require('../db');

router.get('/', (req, res) => {
    let sql = 'SELECT * FROM favorites';

    db.query(sql, (err, result) => {
        if (err) {
            if (err.code === 'ER_NO_SUCH_TABLE') {
                console.log('No favorites exist');
                return res.json({ error: 'No favorites exist' });
            } else {
                throw err;
            }
        }

        console.log('Sent favorites');
        return res.status(200).json({ success: 'Sent favorites', data: result });
    });
});

router.post('/:id', async (req, res) => {
    let queryString = "SHOW TABLES like 'favorites'";

    const tableExists = await db.query(queryString).then((res => {
        if (res.length > 0) {
            return true;
        } else {
            return false;
        }
    })).catch(err => {
        throw new Error(err);
    });

    if (!tableExists) {
        queryString = 'CREATE TABLE favorites (id INT AUTO_INCREMENT, exercise INT, PRIMARY KEY(id))';

        await db.query(queryString).then(res => {
            console.log('Created favorites table');
        }).catch(err => {
            throw new Error(err);
        });
    }

    queryString = 'SELECT * FROM favorites WHERE exercise LIKE ?';
    const id = req.params.id;

    const alreadyFavorited = await db.query(queryString, id).then(res => {
        if (res.length > 0) return true;
            else return false;
    }).catch(err => {
        throw new Error(err);
    });

    if (alreadyFavorited) {
        console.log('Exercise already favorited');
        return res.status(200).json({ success: 'Exercise already favorited' });
    }

    let favorite = ({ exercise: req.params.id });
    queryString = 'INSERT INTO favorites SET ?';

    await db.query(queryString, favorite).then(res => {
        console.log('Added new favorite exercise');
    }).catch(err => {
        throw new Error(err);
    });

    return res.status(201).json({ success: 'Added new favorite exercise' });
});

router.delete('/:id', (req, res) => {
    let sql = "SHOW TABLES like 'favorites'";

    const tableExists = db.query(sql, (err, result) => {
        if (err) {
            throw err;
        }

        return result.length;
    });

    if (!tableExists) {
        console.log('Favorites table does not exist');
        return res.status(200).json({ success: 'Favorites table does not exist' });
    }

    sql = `DELETE FROM favorites WHERE exercise = ${req.params.id}`;

    db.query(sql, (err, result) => {
        if (err) {
            throw err;
        }

        console.log('Removed exercise from favorites');
        return res.status(200).json({ success: 'Removed exercise from favorites' });
    })

    console.log(`DELETE /favorites/${id}`);
    res.statusCode = 200;
    res.send(`DELETE /favorites/${id}`);
});

module.exports = router;