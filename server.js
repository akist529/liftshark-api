const express = require('express');

const app = express();

app.get('/', (req, res) => {
    console.log('Index');
    res.statusCode = 200;
    res.send('Index');
});

const favoritesRouter = require('./routes/favorites');
const measurementsRouter = require('./routes/measurements');
const recordsRouter = require('./routes/records');
const routinesRouter = require('./routes/routines');
const weightsRouter = require('./routes/weights');
const workoutsRouter = require('./routes/workouts');

app.use('/favorites', favoritesRouter);
app.use('/measurements', measurementsRouter);
app.use('/records', recordsRouter);
app.use('/routines', routinesRouter);
app.use('/weights', weightsRouter);
app.use('/workouts', workoutsRouter);

app.listen(3000);