const express = require('express');
const router = express.Router();

const db = require('../db');
const { tableExists, itemExists, getTableData } = require('../helpers');

router.get('/', async (req, res) => {
    const data = await getTableData('favorites');
    return res.status(200).json({ success: 'Fetched data from favorites', data });
});

router.post('/:id', async (req, res) => {
    const favoritesExists = await tableExists('favorites');

    if (!favoritesExists) {
        queryString = 'CREATE TABLE favorites (id INT AUTO_INCREMENT, exercise INT, PRIMARY KEY(id))';

        await db.query(queryString).then(res => {
            console.log('Created favorites table');
        }).catch(err => {
            throw new Error(err);
        });
    }

    const itemFavorited = await itemExists('favorites', 'exercise', req.params.id);

    if (itemFavorited) {
        console.log('Exercise already favorited')
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

router.delete('/:id', async (req, res) => {
    const favoritesExists = await tableExists('favorites');

    if (!favoritesExists) {
        console.log('Favorites table does not exist');
        return res.status(200).json({ error: 'Favorites table does not exist' });
    }

    const itemFavorited = await itemExists('favorites', 'exercise', req.params.id);

    if (!itemFavorited) {
        console.log('Exercise not favorited');
        return res.status(200).json({ error: 'Exercise not favorited' });
    }

    const queryString = 'DELETE FROM favorites WHERE exercise = ?';

    await db.query(queryString, req.params.id).then(res => {
        console.log('Removed exercise from favorites');
    }).catch(err => {
        throw new Error(err);
    });

    return res.status(200).json({ success: 'Removed exercise from favorites' });
});

module.exports = router;