const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    console.log('GET /routines');
    res.statusCode = 200;
    res.send('GET /routines');
});

router.post('/', (req, res) => {
    console.log('POST /routines');
    res.statusCode = 200;
    res.send('POST /routines');
});

router.put('/:id', (req, res) => {
    const id = req.params.id;

    console.log(`PUT /routines/${id}`);
    res.statusCode = 200;
    res.send(`PUT /routines/${id}`);
});

router.delete('/:id', (req, res) => {
    const id = req.params.id;

    console.log(`DELETE /routines/${id}`);
    res.statusCode = 200;
    res.send(`DELETE /routines/${id}`);
});

module.exports = router;