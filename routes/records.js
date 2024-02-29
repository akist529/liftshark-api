const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    console.log('GET /records');
    res.statusCode = 200;
    res.send('GET /records');
});

router.post('/', (req, res) => {
    console.log('POST /records');
    res.statusCode = 200;
    res.send('POST /records');
});

router.put('/:id', (req, res) => {
    const id = req.params.id;

    console.log(`PUT /records/${id}`);
    res.statusCode = 200;
    res.send(`PUT /records/${id}`);
});

router.delete('/:id', (req, res) => {
    const id = req.params.id;

    console.log(`DELETE /records/${id}`);
    res.statusCode = 200;
    res.send(`DELETE /records/${id}`);
});

module.exports = router;