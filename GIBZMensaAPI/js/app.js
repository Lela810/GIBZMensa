const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const moment = require('moment');
const rateLimit = require('express-rate-limit')
const app = express();
const splitToMenus = require('./splitToMenus.js');
const cors = require('cors');
const archive = require('../models/archive.js');


const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 15,
})




async function saveToArchive(json) {
    const archiveEntry = new archive(json)
    try {
        const newArchive = await archiveEntry.save()
        return;
    } catch (err) {
        console.error(err);
        return err;
    }
}

async function loadFromArchive(dateNorm) {
    let archiveEntry
    try {
        archiveEntry = await archive.find({ 'date': dateNorm }, { _id: 0, __v: 0 })
        return (archiveEntry[0])
    } catch (err) {
        console.error(err);
        return err;
    }
}

app.use(cors({
    origin: '*'
}));

//TODO Add more comprehensive HTTP Codes 
// assignees: lela810

app.get('/api/v1/', limiter, async(req, res) => {
    const date = req.query.date;
    let dateNorm;

    if (moment(date).isValid()) {
        dateNorm = moment(date).format('YYYY-MM-DD')
    } else {
        res.status(418).send({ error: "The date requested is not valid" })

    }

    const url = 'https://zfv.ch/de/microsites/restaurant-treff/menuplan#' + dateNorm; //Date must be in format -> 2021-10-22 
    console.log('Date "' + date + '" requested')

    // Decide if menu is already in the archive
    const dayOfTheWeek = moment(dateNorm).format('d')
    if (!["6", "0"].includes(dayOfTheWeek) && (moment(dateNorm).week() - (moment().week())) < 2) {
        try {
            const cachedMenu = await loadFromArchive(dateNorm)
            if ('menu' in cachedMenu) {
                res.status(200).send(cachedMenu);
            } else {
                res.status(500).send({ error: "There is no data about that menu" });
            }
        } catch (err) {
            request(url, (error, response, html) => {
                if (!error) {
                    console.log('URL "' + url + '" requested')
                    const $ = cheerio.load(html);
                    $(`tr[data-date=${dateNorm}] > td div[class=txt-slide]`).remove();
                    const menuData = $(`tr[data-date=${dateNorm}] > td`)
                        .text()
                        .replace(/\n/g, ' ')
                        .replace(/\s\s+/g, ' ')
                        .replace(/News.*/, '')
                        .trim()


                    const menu = splitToMenus.split(menuData)

                    const response = {
                        ['date']: dateNorm,
                        menu
                    }


                    if (!menuData) {
                        res.status(500).send({ error: "There is no data about that menu" });
                    } else {
                        res.status(200).send(response);
                    }


                    // Save to archive
                    saveToArchive(response)

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