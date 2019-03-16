import axios from 'axios';
import cheerio from 'cheerio';
import db from '../db';


//grab html from github
export async function getHTML(url) {
    let {data: html} = await axios.get(url);
    return html;
}

export async function getBlogs(html) {
    const $ = cheerio.load(html);
    let idCount = 0;
    let blogs = [];

    //loop over the UL and grab the first child, 
    //delete the first child, 
    //and repeat until UL is empty.
    while($('.markdown-body').find('li').html() !== null) {  
        let currentChild = $('.markdown-body ul').children().first();
        blogs.push({id: idCount, name: currentChild.find('a').html(), url: currentChild.find('a').attr('href'),});
        $('.markdown-body ul').children().first().remove();
        idCount++
    }
    //returns an array of all blogs.
    return blogs;
}

export async function runCron() {
    let HTML = await getHTML("https://github.com/jkup/awesome-personal-blogs/blob/master/readme.md");
    let blogs = await getBlogs(HTML);

    db
    .set('blogs', blogs)
    .set('total', blogs.length)
    .set('updated', Date.now())
    .write()

    console.log('done');
}
