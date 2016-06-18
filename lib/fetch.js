'use strict';

const is = require('valido');
const client = require('got');
const ContentRequestError = require('./errors').ContentRequestError;

/**
 * Performs HTTP request
 *
 * @param {String} url
 * @param {String} query
 * @returns {Promise}
 */
function fetch(url, query) {
  return Promise.resolve()
    .then(() => {
      if (!is.uri(url)) {
        throw new TypeError('Invalid URL');
      }

      const options = {
        query,
        headers: { 'User-Agent': 'Embedify' },
        json: true,
      };

      return client(url, options)
        .then(res => res.body)
        .catch(err => {
          throw new ContentRequestError(err.statusMessage);
        });
    });
}

module.exports = fetch;
