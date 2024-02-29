const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    console.log('GET /workouts');
    res.statusCode = 200;
    res.send('GET /workouts');
});

router.post('/', (req, res) => {
    console.log('POST /workouts');
    res.statusCode = 200;
    res.send('POST /workouts');
});

router.put('/:id', (req, res) => {
    const id = req.params.id;

    console.log(`PUT /workouts/${id}`);
    res.statusCode = 200;
    res.send(`PUT /workouts/${id}`);
});

router.delete('/:id', (req, res) => {
    const id = req.params.id;

    console.log(`DELETE /workouts/${id}`);
    res.statusCode = 200;
    res.send(`DELETE /workouts/${id}`);
});

module.exports = router;