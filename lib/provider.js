'use strict';

const _ = require('lodash');
const is = require('valido');
const Bluebird = require('bluebird');
const request = Bluebird.promisify(require('request'));
const createError = require('custom-error-generator');

/**
 * Factory that returns new Provider instance
 */
function create(apiUrl, regExp, transform, apiParameters) {
  return new Provider(apiUrl, regExp, transform, apiParameters);
}

/**
 * Constructor
 *
 * @param {String} apiUrl
 * @param {Array} regExp
 * @param {Function} transform
 * @param {Object} [apiParameters]
 * @constructor
 */

function Provider(apiUrl, regExp, transform, apiParameters) {
  if (!is.uri(apiUrl)) {
    throw new TypeError('Invalid API Url');
  }
/*
  if (!is.all.regExp(regExp)) {
    throw new TypeError('Invalid regExp - needs to be array of regExp');
  }
*/
  if (!is.function(transform)) {
    throw new TypeError('Invalid transform function');
  }

  if (!is.existy(apiParameters) && !is.plainObject(apiParameters)) {
    throw new TypeError('Invalid apiParameters - needs to be plain object');
  }

  this.client = request;
  this.apiUrl = apiUrl;
  this.regExp = regExp;
  this.transform = transform;
  this.apiParameters = apiParameters || {};
  this.ContentRequestError = createError('ContentRequestError');
}

Provider.prototype.get = function get(url) {
  return Bluebird.resolve()
    .then(() => {
      // Iterate through provider regExp
      // and return first match
      for (const re of this.regExp) {
        const result = url.match(re);

        // If there is a match,
        // return from loop and fetch oEmbed info
        if (is.array(result) && result.length) {
          const embedUrl = this.transform(result);
          return this.fetch(embedUrl);
        }
      }

      return null;
    });
};

/**
 * Requests oEmbed information from provider
 *
 * @param {String} url
 * @returns {Promise}
 */
Provider.prototype.fetch = function fetch(url) {
  return this.client.request({
    json: true,
    method: 'get',
    uri: this.apiUrl,
    followAllRedirects: true,
    useQuerystring: true,
    qs: Object.assign({}, this.apiParameters, { url }),
    headers: { 'User-Agent': 'Embedify' },
  })
  .then(res => {
    if (!res || !res.length) {
      throw new this.ContentRequestError('API request did not return valid response');
    }

    const statusCode = res[0].statusCode;

    if (statusCode >= 400) {
      throw new this.ContentRequestError('Status code %d indicates error', statusCode);
    }
console.log(res[0].body);
    return res[0].body;
  });
};

module.exports.create = create;
