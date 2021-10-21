const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const app     = express();


app.get('/', function(req, res){
    let date = req.query.date;
    let url = 'https://zfv.ch/de/microsites/restaurant-treff/menuplan#' + date + '/'; //Date must be in format -> 2021-10-22
    console.log('Date "' + date + '" requested')
    console.log('URL "' + url + '" requested')

    request(url, function(error, response, html) {
        console.log(error)
        if (!error) {var $ = cheerio.load(html);}
    });
    console.log($)
    var menu = $('[data-date=' + date + '] > div.txthold').text();
    var json = {
        date: date,
        menu: menu
    };

    res.send(json);

});
app.listen('8080');
console.log('API is running on http://localhost:8080');
module.exports = app;
