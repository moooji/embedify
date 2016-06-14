'use strict';

const _ = require('lodash');
const Bluebird = require('bluebird');

const providers = new Map();
providers.set('soundcloud', require('./plugins/soundcloud'));
providers.set('spotify', require('./plugins/spotify'));
providers.set('vimeo', require('./plugins/vimeo'));
providers.set('youtube', require('./plugins/youtube'));

/**
 * Gets the oEmbed information for a URL
 * or list of URLs
 *
 * @param {String|Array} urls
 * @param {Function} [callback]
 * @returns {Promise}
 */

function getMulti(urls, callback) {
  return Bluebird.resolve(urls)
    .then(() => urls.map(url => this.get(url)))
    .settle()
    .then(results => {
      // results is a PromiseInspection array
      // this is reached once the operations are all done, regardless if
      // they're successful or not.

      const oEmbeds = [];

      results.forEach(result => {
        if (result.isFulfilled()) {
          // Return the oEmbed information
          oEmbeds.push(result.value());

        } else if (result.isRejected()) {
          // TODO: Do something with 404s etc.
          //result.reason()
        }
      });

      return oEmbeds;
    })
    .nodeify(callback);
}


function get(url) {
  return Bluebird.resolve()
    .then(() => providers.map(provider => provider.get(url)))
    .settle()
    .then(results => {
      // results is a PromiseInspection array
      // this is reached once the operations are all done, regardless if
      // they're successful or not.

      const oEmbeds = [];

      results.forEach(result => {
        if (result.isFulfilled()) {
          oEmbeds.push(result.value());
        } else if (result.isRejected()) {
          // TODO: Do something with 404s etc.
          // result.reason()
        }
      });

      return oEmbeds;
    });
}

// Public
module.exports.get = getMulti;
module.exports.providers = providers;
