const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const { writeFileSync, statSync, readFileSync } = require('fs');
const moment = require('moment');
const { join } = require('path');
const app = express();
const index = require('./index.js');


const archivePath = join(__dirname, '/archive')

app.get('/api/v1/', (req, res) => {
    const date = req.query.date;
    const filePath = `${join(archivePath, date)}.json`
    const url = 'https://zfv.ch/de/microsites/restaurant-treff/menuplan#' + date; //Date must be in format -> 2021-10-22
    console.log('Date "' + date + '" requested')

    // Decide if menu is already in the archive
    const dayOfTheWeek = moment(date).format('d')
    if (!["6", "0"].includes(dayOfTheWeek)) {
        try {
            statSync(filePath)
            const cachedMenu = JSON.parse(readFileSync(filePath, 'utf-8'))
            res.status(200).send(cachedMenu)
        } catch (err) {
            request(url, (error, response, html) => {
                if (!error) {
                    console.log('URL "' + url + '" requested')
                    const $ = cheerio.load(html);
                    $(`tr[data-date=${date}] > td div[class=txt-slide]`).remove();
                    const menuData = $(`tr[data-date=${date}] > td`)
                        .text()
                        .replace(/\n/g, ' ')
                        .replace(/\s\s+/g, ' ')
                        .replace(/News.*/, '')
                        .trim()



                    const menu = index.splitToMenus(menuData)


                    const response = {
                        date,
                        menu
                    }
                    res.status(200).send(response);

                    // Save to archive
                    writeFileSync(filePath, JSON.stringify(response, null, 2))
                } else {
                    res.status(500).send({ error: error.message })
                }
            });
        }
    } else {
        res.status(400).send({ error: "Day of the week must not be on the weekend" })
    }
});

module.exports = app;