
/**
 * Module dependencies.
 */

const axios = require('axios');
const fs = require('fs');
const configVars = require('./config');

function createRssFile(mapping) {
  const stream = fs.createWriteStream('rss.xml');
  stream.write('<?xml version="1.0" encoding="UTF-8" ?>');
  stream.write('\n<rss version="2.0">');
  stream.write('\n<channel>');
  stream.write('\n<title>Contentstck Blog Page Rss</title>');
  stream.write('\n<link>https://localhost:4000/</link>');
  stream.write('\n<description>Guide to build rss</description>');
  mapping.map((index) => {
    stream.write('\n  <item>\n');
    stream.write(`    <title>${index.title}</title>\n`);
    stream.write(`    <description>${index.description}</description>\n`);
    stream.write(`    <link>${`${configVars.rootPath.path}/blog${index.link}`}</link>\n`);
    stream.write(`    <pubDate>${index.publishDate}</pubDate>\n`);
    stream.write(`    <language>${index.language}</language>\n`);
    stream.write('  </item>');
  });
  stream.write('\n</channel>');
  stream.write('\n</rss>');
  stream.end();
}


// Write SyncFile with SyncToken

function syncTokenGenerator(syncTokenVar) {
  fs.writeFileSync('./syncToken.txt', syncTokenVar, (err) => {
    if (err) {
      console.log(err);
    } else {
      // console.log('Mapped file created');
    }
  });
}

// Axios wrapper

function getData(url) {
  const headerData = {
    headers: {
      api_key: configVars.apiKey,
      access_token: configVars.accessToken,
    },
  };
  return axios.get(url, headerData);
}

// export library

module.exports = {
  getData,
  syncTokenGenerator,
  createRssFile,
};
