const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const app     = express();

app.get('/', (req, res) => {
    let date = req.query.date;
    let url = 'https://zfv.ch/de/microsites/restaurant-treff/menuplan#' + date; //Date must be in format -> 2021-10-22
    console.log('Date "' + date + '" requested')
    console.log('URL "' + url + '" requested')

    request(url, (error, response, html) => {
        if (!error) {
            var $ = cheerio.load(html);
            var menu = $(`[data-date="${date}"] > div > txt-hold`).text();
            res.status(200).send({
                date,
                menu
            });
        } else {
            res.status(500).send({ error: error.message })
        }
    });
});
app.listen('8080');
console.log('API is running on http://localhost:8080');
module.exports = app;
