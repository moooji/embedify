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

const test = 'https://w.soundcloud.com/player/?url=' +
  'https%3A//api.soundcloud.com/tracks/217027580&auto_play=false&hide_related=false' +
  '&show_comments=true&show_user=true&show_reposts=false&visual=true';

get([test, test])
  .then(res => console.log(res))
  .catch(err => console.error(err));

/**
 * Gets the oEmbed information for a URL
 * or list of URLs
 *
 * @param {String|Array} urls
 * @param {Function} [callback]
 * @returns {Promise}
 */

function get(urls, callback) {
  return Promise.map(urls, url => tryResolve(url), { concurrency })
    .then(results => results.filter(r => is.existy(r)))
    .nodeify(callback);
}

function tryResolve(url) {
  return new Promise((resolve, reject) => {
    let match = null;

    providers.some(provider => {
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
      fetch(match.apiUrl, { url: match.url })
        .then(resolve)
        .catch(reject);
    } else {
      resolve(null);
    }
  });
}

// Public
module.exports = get;
