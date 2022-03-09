// requests library
const axios = require("axios");

const cheerio = require("cheerio");

const BASE_URL = 'http://quotes.toscrape.com';

const express = require("express");

const slug = (str) => {

    str = str.replace(" ", '-');
    str = str.replace(" ", '-');
    str = str.replace(".", '-');
    str = str.replace(".", '-');
    str = str.replace(" ", '-');
    str = str.replace(".", '-');
    str = str.replace('é', 'e');
    str = str.replace("'", '');

    str = str.replace("--", '-');

    if (str.endsWith('-'))
        str = str.substring(0, str.length - 1);

    return str;
};

const createService = () => {
    const app = express();

    function parseQuotes(data){
        const $ = cheerio.load(data);
        return $(".container > div:nth-child(2) > div.col-md-8").find("div.quote").map(function() {
            const tagStr = $(this).find('.keywords').attr('content').trim()
            return {
                author : $(this).find('.author').text().trim(),
                text   : $(this).find('.text').text().trim().slice(0, 50),
                tags   : tagStr !== "" ? tagStr.split(',') : []
            };
        }).get();
    }

    function fetch(pageId){
        return axios.get(BASE_URL + '/page/' + pageId).then((response) => {
            return parseQuotes(response.data);
        });
    }

    function fetchQuotes(){
        let promises = []

        for(let i = 1; i <= 10; i++ )
            promises.push(fetch(i));

        return Promise.all(promises);
    }

    async function fetchAuthor(name){
        const authorUrl = BASE_URL + "/author/" + slug(name);
        const $ = cheerio.load((await axios.get(authorUrl)).data);

        const authorName = $(".author-title").text().trim();
        const bornDate = $(".author-born-date").text().trim();
        const location = $(".author-born-location").text().trim();
        const description = $(".author-description").text().trim().slice(0,50);

        return !authorName ? null : {
            name: authorName,
            biography: description,
            birthdate: bornDate,
            location: location
        } ;

    }

    async function fetchAuthors(){
        return Promise.all(Array.from(new Set(([].concat.apply([], await fetchQuotes())).map((e) => e.author))).map(async e => fetchAuthor(e)));
    }

    app.get('/quotes', async function(req, res) {

        let result = [].concat.apply([], await fetchQuotes())

        if (req.query.author)
            result = result.filter( e => e.author === req.query.author);

        if (req.query.tag)
            result = result.filter(e => e.tags.includes(req.query.tag));

        res.json({ data: result }).status(200);

    });

    app.get('/authors', async function(req, res) {

        let result = [];

        if (req.query.name !== undefined){
            let author = await fetchAuthor(req.query.name);
            if (author != null)
                result = [author];
        } else
            result = await fetchAuthors();

        res.json({ data: result }).status(200);
    });

    return app;
};

module.exports = { createService };
