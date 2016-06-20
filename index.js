'use strict';

const is = require('valido');
const axios = require('axios');
const Promise = require('bluebird');
const createError = require('custom-error-generator');

const soundcloud = require('./providers/soundcloud');
const spotify = require('./providers/spotify');
const vimeo = require('./providers/vimeo');
const youtube = require('./providers/youtube');
const providers = [soundcloud, spotify, vimeo, youtube];

const ProviderRequestError = createError('ProviderRequestError');

/**
 * Factory that return Embedify instance
 *
 * @param {Object} [options]
 * @returns {Embedify}
 */
function create(options) {
  return new Embedify(options);
}

/**
 * Constructor
 *
 * @param {Object} [options]
 */
function Embedify(options) {
  this.providers = providers;
  this.ProviderRequestError = ProviderRequestError;
  this.parse = !(options && options.parse === false);
  this.failSoft = options && options.failSoft === true;
  this.client = options && options.client ? options.client : axios;
  this.concurrency = options && is.natural(options.concurrency) ? options.concurrency : 10;
}

/**
 * Gets the oEmbed information for a URL
 * or list of URLs
 *
 * @param {String|Array} urls
 * @returns {Promise}
 */
Embedify.prototype.get = function get(urls) {
  const concurrency = this.concurrency;

  return Promise.map(this.ensureUrls(urls), url => this.tryResolve(url), { concurrency })
    .then(results => results.filter(r => is.existy(r)));
};

/**
 * Tries to resolve oEmbed information for a URL
 *
 * @param {String} url
 * @returns {Promise<Object>}
 */
Embedify.prototype.tryResolve = function tryResolve(url) {
  return Promise.resolve()
    .then(() => {
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

      return match ? this.fetch(match.apiUrl, match.url) : null;
    });
};

/**
 * Ensures that URLs are valido
 *
 * @param {String|Array} urls
 * @returns {Promise<Array>}
 */
Embedify.prototype.ensureUrls = function ensureUrls(urls) {
  return Promise.resolve()
    .then(() => {
      if (is.all.string(urls)) {
        return urls;
      } else if (is.string(urls)) {
        return [urls];
      }

      throw new TypeError('Invalid URL or list of URLs');
    });
};

/**
 * Performs HTTP request
 *
 * @param {String} apiUrl
 * @param {String} matchUrl
 * @returns {Promise}
 */
Embedify.prototype.fetch = function fetch(apiUrl, matchUrl) {
  return Promise.resolve()
    .then(() => {
      const options = {
        params: { url: matchUrl },
        headers: { 'User-Agent': 'Embedify' },
        json: true,
      };

      return this.client.get(apiUrl, options)
        .then(res => this.parseResponse(res))
        .catch(err => {
          // Return empty result for 404
          // if false option is set
          if (err.status === 404 && this.failSoft) {
            return null;
          }

          const message = `Item does not exist [${matchUrl}]. Set 'failSoft' option to ignore.`;
          throw new this.ProviderRequestError(message);
        });
    });
};

/**
 * Parses the oEmbed response
 *
 * @param {Object} response
 * @param {boolean} shouldBePretty
 * @returns {Object}
 */
Embedify.prototype.parseResponse = function parseResponse(response) {
  const oEmbed = response.data;

  if (!this.parse) {
    return oEmbed;
  }

  return {
    type: oEmbed.type || null,
    version: oEmbed.version ? oEmbed.version.toString() : null,
    title: oEmbed.title || null,
    html: oEmbed.html || null,
    author: {
      name: oEmbed.author_name || null,
      url: oEmbed.author_url || null,
    },
    provider: {
      name: oEmbed.provider_name || null,
      url: oEmbed.provider_url || null,
    },
    image: {
      url: oEmbed.thumbnail_url || null,
      width: parseInt(oEmbed.thumbnail_width, 10) || null,
      height: parseInt(oEmbed.thumbnail_height, 10) || null,
    },
    width: parseInt(oEmbed.width, 10) || null,
    height: parseInt(oEmbed.height, 10) || null,
  };
};

// Public
module.exports.create = create;
