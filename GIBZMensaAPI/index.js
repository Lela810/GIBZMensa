const express = require('express');
const router = express.Router();
const mongoose = require("mongoose")
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit')
const app = require('./js/app');

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 15,
})

dotenv.config();


if (!process.env.MONGODB_USERNAME || !process.env.MONGODB_PASSWORD) {
    mongoose.connect(`mongodb://${process.env.MONGODB}/GIBZMensaAPI`, { useNewUrlParser: true })
} else {
    mongoose.connect(`mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB}/GIBZMensaAPI`, { useNewUrlParser: true })
}

const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

router.use((req, res, next) => {
    res.header('Access-Control-Allow-Methods', 'GET');
    next();
});

router.get('/', (req, res) => {
    const data = {
        uptime: process.uptime(),
        message: 'Ok',
        date: new Date()
    }

    res.status(200).send(data);
});


app.listen('8080');
app.use('/', limiter, router);
console.log('API is running at http://localhost:8080/api/v1/');







//TODO Create GIBZMensaAPI Docs