require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const errorHandler = require('./middleware/errorHandler');

const indexRouter = require('./routes/index.js');
const exploreRouter = require('./routes/explore.js');

const app = express();
const PORT = process.env.PORT;

const corsConfig = {
    origin: process.env.CLIENT_ORIGIN_URL,
    credentials: true,
};

const DB_URI = process.env.DB_URI;

mongoose.connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB Connection Error:'));

app.use(cors(corsConfig));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/', indexRouter);
app.use('/explore', exploreRouter);

app.use('*', function (req, res) {
    res.status(404);
    return res.json({ message: '404: Page not found' });
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Discover Server listening on ${PORT}`);
});

module.exports = app;
