'use strict';

const is = require('valido');
const Promise = require('bluebird');
const fetch = require('./lib/fetch');

const soundcloud = require('./providers/soundcloud');
const spotify = require('./providers/spotify');
const vimeo = require('./providers/vimeo');
const youtube = require('./providers/youtube');
const providers = [soundcloud, spotify, vimeo, youtube];

const concurrency = 10;

/**
 * Gets the oEmbed information for a URL
 * or list of URLs
 *
 * @param {String|Array} urls
 * @param {Function} [callback]
 * @returns {Promise}
 */

function get(urls, callback) {
  return Promise.map(ensureUrls(urls), url => tryResolve(url), { concurrency })
    .then(results => results.filter(r => is.existy(r)))
    .nodeify(callback);
}

function tryResolve(url) {
  console.log(url);
  return new Promise((resolve, reject) => {
    let match = null;

    providers.some(provider => {
      console.log(provider.apiUrl);

      provider.regExp.some(re => {
        const reMatch = url.match(re);

        if (is.array(reMatch) && reMatch.length) {
          match = {
            url: provider.transform(reMatch),
            apiUrl: provider.apiUrl,
          };
        }

        return is.existy(match);
      });

      return is.existy(match);
    });

    if (match) {
      console.log(match);
      fetch(match.apiUrl, { url: match.url })
        .then(resolve)
        .catch(reject);
    } else {
      resolve(null);
    }
  });
}

function ensureUrls(urls) {
  if (is.all.uri(urls)) {
    return urls;
  } else if (is.uri(urls)) {
    return [urls];
  }

  throw new TypeError('Invalid URL or list of URLs');
}

// Public
module.exports = get;
module.exports.providers = providers;
