const http = require('http');
const express = require('express');
const router = express.Router();





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


const app = require('./js/app');
app.listen('8080');
app.use('/', router);
console.log('API is running at http://localhost:8080/api/v1/');