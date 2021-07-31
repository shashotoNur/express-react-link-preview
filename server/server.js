const express = require('express');

const cheerio = require('cheerio');
const cors = require('cors');
const getUrls = require('get-urls');
const fetch = require('node-fetch');

// Utils
const scrapeMetatags = (text) =>
    {
        try
        {
            const urls = Array.from( getUrls(text) );

            const requests = urls.map(async (url) =>
                {
                    const res = await fetch(url);

                    const html = await res.text();
                    const loadedHTML = cheerio.load(html);
                    
                    const title = loadedHTML('title').first().text();
                    const favicon = loadedHTML('link[rel="shortcut icon"]').attr('href');

                    const getMetatag = ( name ) =>  
                        loadedHTML(`meta[name=${ name }]`).attr('content') ||  
                        loadedHTML(`meta[property="og:${ name }"]`).attr('content') ||  
                        loadedHTML(`meta[property="twitter:${ name }"]`).attr('content');
                    
                    const description = getMetatag('description');
                    const image = getMetatag('image');
                    const author = getMetatag('author');

                    return { url, title, favicon, description, image, author };
                }
            );

            return Promise.all(requests);
        }
        catch(error) { console.log(error.message); res.send(error.message); };
    };

// Controllers
const getLinkPreview = async (req, res) =>
    {
        try
        {
            const body = req.body;
            const data = await scrapeMetatags(body.text);

            res.send(data);
        }
        catch(error) { console.log(error.message); };
    };

// Initialize express
const app = express();
const PORT = 5000;

// Parse requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// enable cors
const corsOptions = { origin: 'http://localhost:3000', credentials: true };
app.use(cors(corsOptions));

// Routes
app.use('/preview', getLinkPreview);

// Run server
app.listen(PORT, () => console.log(`Server listening on port ${ PORT }`));