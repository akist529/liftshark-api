const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    console.log('GET /favorites');
    res.statusCode = 200;
    res.send('GET /favorites');
});

router.post('/', (req, res) => {
    console.log('POST /favorites');
    res.statusCode = 200;
    res.send('POST /favorites');
});

router.put('/:id', (req, res) => {
    const id = req.params.id;

    console.log(`PUT /favorites/${id}`);
    res.statusCode = 200;
    res.send(`PUT /favorites/${id}`);
})

router.delete('/:id', (req, res) => {
    const id = req.params.id;

    console.log(`DELETE /favorites/${id}`);
    res.statusCode = 200;
    res.send(`DELETE /favorites/${id}`);
});

module.exports = router;