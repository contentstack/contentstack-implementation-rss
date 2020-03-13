/**
 * Module dependencies.
 */

const async = require('async');
const configVars = require('../config');
const utils = require('../utils');

module.exports = function (req, res, next) {
  async.parallel(
    [
      function (callback) {
        utils.getData(`${configVars.baseUrlContentStack}/content_types/${configVars.headerSection.headerContentTypeId}/entries/${configVars.headerSection.headerEnrtyId}?environment=${configVars.env}`)
          .then((data) => {
            callback(null, data.data);
          })
          .catch((err) => {
            console.log(err);
          });
      },
      function (callback) {
        utils.getData(`${configVars.baseUrlContentStack}/content_types/${configVars.footerSection.footerContentTypeId}/entries/${configVars.footerSection.footerEnrtyId}?environment=${configVars.env}`)
          .then((data) => {
            callback(null, data.data);
          })
          .catch((err) => {
            console.log(err);
          });
      },
    ],
    (error, success) => {
      if (error) return next(error);
      res.locals.header = success[0];
      res.locals.footer = success[1];
      next();
    },
  );
};
