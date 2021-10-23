const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const { writeFileSync, statSync, readFileSync, accessSync, mkdirSync } = require('fs');
const moment = require('moment');
const { join } = require('path');
const app = express();
const splitToMenus = require('./splitToMenus.js');
const { now } = require('moment');
const cors = require('cors');



const archivePath = join(__dirname, '../archive')


app.use(cors({
    origin: '*'
}));

app.get('/api/v1/', (req, res) => {
    const date = req.query.date;
    const filePath = `${join(archivePath,moment(date).format('YYYY-MM'), moment(date).format('YYYY-MM-DD'))}.json`
    const url = 'https://zfv.ch/de/microsites/restaurant-treff/menuplan#' + moment(date).format('YYYY-MM-DD'); //Date must be in format -> 2021-10-22
    console.log('Date "' + date + '" requested')

    // Decide if menu is already in the archive
    const dayOfTheWeek = moment(date).format('d')
    if (!["6", "0"].includes(dayOfTheWeek) && moment(date).isValid() && (moment(date).week() - (moment().week())) < 2) {
        try {
            statSync(filePath)
            const cachedMenu = JSON.parse(readFileSync(filePath, 'utf-8'))
            if (Object.keys(cachedMenu.menu).length === 0) {
                res.status(500).send({ error: "There is no data about that menu" });
            } else {
                res.status(200).send(cachedMenu);
            }
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


                    const menu = splitToMenus.split(menuData)

                    const response = {
                        date,
                        menu
                    }

                    if (!menuData) {
                        res.status(500).send({ error: "There is no data about that menu" });
                    } else {
                        res.status(200).send(response);
                    }


                    // Save to archive
                    try {
                        accessSync(join(archivePath, moment(date).format('YYYY-MM')))
                    } catch {
                        mkdirSync(join(archivePath, moment(date).format('YYYY-MM')))
                    }
                    writeFileSync(filePath, JSON.stringify(response, null, 2))

                } else {
                    res.status(500).send({ error: error.message })
                }
            });
        }
    } else {
        res.status(400).send({ error: "The date requested is not valid or on weekends" })
    }
});

module.exports = app;