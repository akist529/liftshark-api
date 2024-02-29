const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    console.log('GET /measurements');
    res.statusCode = 200;
    res.send('GET /measurements');
});

router.post('/', (req, res) => {
    console.log('POST /measurements');
    res.statusCode = 200;
    res.send('POST /measurements');
});

router.put('/:id', (req, res) => {
    const id = req.params.id;

    console.log(`PUT /measurements/${id}`);
    res.statusCode = 200;
    res.send(`PUT /measurements/${id}`);
});

router.delete('/:id', (req, res) => {
    const id = req.params.id;

    console.log(`DELETE /measurements/${id}`);
    res.statusCode = 200;
    res.send(`DELETE /measurements/${id}`);
});

module.exports = router;