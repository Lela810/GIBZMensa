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
const archive = require('../models/archive.js');




const archivePath = join(__dirname, '../archive')


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

async function loadFromArchive(date) {
    let archiveEntry
    try {
        archiveEntry = await archive.find({ 'date': date }, { _id: 0, __v: 0 })
        return (archiveEntry[0])
    } catch (err) {
        console.error(err);
        return err;
    }
}


app.get('/api/v1/archive', async(req, res) => {
    try {
        const archiveEntries = await archive.find()
        res.status(200).json(archiveEntries)
    } catch {
        res.status(500).json({ message: err.message })
    }
});


app.use(cors({
    origin: '*'
}));

app.get('/api/v1/', async(req, res) => {
    const date = req.query.date;
    const url = 'https://zfv.ch/de/microsites/restaurant-treff/menuplan#' + moment(date).format('YYYY-MM-DD'); //Date must be in format -> 2021-10-22
    console.log('Date "' + date + '" requested')

    // Decide if menu is already in the archive
    const dayOfTheWeek = moment(date).format('d')
    if (!["6", "0"].includes(dayOfTheWeek) && moment(date).isValid() && (moment(date).week() - (moment().week())) < 2) {
        try {
            const cachedMenu = await loadFromArchive(date)
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