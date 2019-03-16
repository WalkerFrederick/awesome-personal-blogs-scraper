import express from 'express';
import db from './db'
import { getHTML, getBlogs } from './lib/scraper';
import './lib/cron'

const app = express(); 

app.get('/blogs', async (req,res, next) => {

    console.log('running...')

    let HTML = await getHTML("https://github.com/jkup/awesome-personal-blogs/blob/master/readme.md");
    let blogs = await getBlogs(HTML);

    res.json(db)

    console.log('done...')


});

app.listen(1505, () => console.log('running on port 1505'));