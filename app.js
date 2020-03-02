/**
 * Module dependencies.
 */

const app = require('express')();
const nunjucks = require('nunjucks');
const path = require('path');


const sitemapFunction = require('./rss');
const configVars = require('./config');


app.set('view engine', 'html');

nunjucks.configure(['views/'], {
  autoescape: false,
  express: app,
});

// Routes

require('./routes')(app);

sitemapFunction.initialSynCall();

setInterval(sitemapFunction.updateCall, 100000); // 1 min interval change per your need

app.get('/rssfeed', (req, res) => {
  res.contentType('application/xml');
  res.sendFile(path.join(__dirname, 'rss.xml'));
});

// load port on 4000

app.listen(configVars.port, () => {
  console.log(`Start your browser on port ${configVars.port}`);
});
