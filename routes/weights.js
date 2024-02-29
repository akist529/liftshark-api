const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    console.log('GET /weights');
    res.statusCode = 200;
    res.send('GET /weights');
});

router.post('/', (req, res) => {
    console.log('POST /weights');
    res.statusCode = 200;
    res.send('POST /weights');
});

router.put('/:id', (req, res) => {
    const id = req.params.id;

    console.log(`PUT /weights/${id}`);
    res.statusCode = 200;
    res.send(`PUT /weights/${id}`);
});

router.delete('/:id', (req, res) => {
    const id = req.params.id;

    console.log(`DELETE /weights/${id}`);
    res.statusCode = 200;
    res.send(`DELETE /weights/${id}`);
});

module.exports = router;