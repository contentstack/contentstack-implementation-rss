/**
 * Module dependencies.
 */

const express = require('express');

const router = express.Router();

const configVars = require('../config');
const utils = require('../utils');

router.get('/', (req, res) => {
  utils.getData(`${configVars.baseUrlContentStack}/content_types/${configVars.homeSection.homeContentTypeId}/entries/${configVars.homeSection.homeEnrtyId}?environment=${configVars.env}`)
    .then((data) => {
      res.render('pages/home.html', { home: data.data });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
