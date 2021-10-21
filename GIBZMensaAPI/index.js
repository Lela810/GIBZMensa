const http = require('http');
const express = require('express');
const router = express.Router();

const menuTypes = [
    "Tagesmenü",
    "Vegimenü",
    "Hit",
    "Topping des Tages"
]


function splitToMenus(...menuStrings) {
    for (const menuType of menuTypes) {
        menuStrings = menuStrings.map(menu => menu.split(menuType)).flat()
    }

    menuStrings = menuStrings.slice(1).map(menu => menu.trim())

    const menus = {}

    for (let i = 0; i < menuTypes.length; i++) {
        menus[menuTypes[i]] = menuStrings[i]
    }

    return menus
}

module.exports = { splitToMenus };

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


const app = require('./app');
app.listen('8080');
app.use('/', router);
console.log('API is running at http://localhost:8080/api/v1/');