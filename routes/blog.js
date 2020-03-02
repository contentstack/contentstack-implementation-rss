/**
 * Module dependencies.
 */

const express = require('express');

const router = express.Router();
const configVars = require('../config');
const utils = require('../utils');


router.get('/', (req, res) => {
  utils.getData(`${configVars.baseUrlContentStack}/content_types/${configVars.expressBlogSection.blogContentTypeId}/entries?environment=${configVars.env}`)
    .then((data) => {
      res.render('pages/blog.html', { blog: data.data });
    }).catch((err) => {
      console.log(err);
    });
});

router.get('/:url', (req, res) => {
  utils.getData(`${configVars.baseUrlContentStack}/content_types/${configVars.expressBlogSection.blogContentTypeId}/entries?environment=${configVars.env}`)
    .then((data) => {
      const dataContent = data.data.entries.find((blog) => blog.url === `/${req.params.url}`);
      res.render('pages/blogpage.html', { content: dataContent });
    }).catch((err) => {
      console.log(err);
    });
});


module.exports = router;
