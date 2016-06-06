'use strict';

const _ = require('lodash');
const Bluebird = require('bluebird');
const validation = require('valido');
const request = Bluebird.promisify(require('request'));
const ApiRequestError = require('./errors').ApiRequestError;

/**
 * Constructor
 *
 * @param {String} name
 * @param {String} apiUrl
 * @param {Array} regExp
 * @param {Function} transform
 * @param {Object} [apiParameters]
 * @constructor
 */

function provider(name, apiUrl, regExp, transform, apiParameters) {

  if (!validation.isString(providerName)) {
    throw new TypeError('Invalid provider name');
  }

  if (!validation.isString(apiUrl)) {
    throw new TypeError('Invalid API Url');
  }

  if (!validation.isArray(regExp)) {
    throw new TypeError('Invalid regExp - needs to be array of regExp');
  }

  if (!validation.isFunction(transform)) {
    throw new TypeError('Invalid transform function');
  }

  if (apiParameters !== null &&
    apiParameters !== undefined && !_.isPlainObject(apiParameters)) {
    throw new TypeError('Invalid apiParameters - needs to be plain object');
  }

  const tests = [];
  // const name = name;
  // const apiUrl = apiUrl;
  // const regExp = regExp;
  // const transform = transform;
  const apiParameters = _.isPlainObject(apiParameters) ? apiParameters : {};

  /**
   * Matches url with provider regExp
   *
   * @param {String} matchUrl
   * @returns {Promise}
   */

  function match(matchUrl) {
    return Bluebird.resolve()
      .then(() => {
        // Iterate through provided regExp
        // and return first match
        for (const re of regExp) {
          const result = matchUrl.match(re);

          // If there is a match,
          // return from loop
          if (result && result.length) {
            return result;
          }
        }

        return null;
      })
      .then(transformMatch)
      .then(embedUrl => {
        const hasEmbedUrl = _.isString(embedUrl);
        return hasEmbedUrl ? { providerName: name, embedUrl } : null;
      });
  }

  function transformMatch(match) {
    const hasMatch = _.isArray(match) && match.length;
    return hasMatch ? transform(match) : null;
  }

  /**
   * Requests oEmbed information from provider
   *
   * @param {String} embedUrl
   * @returns {Promise}
   */

  function fetch(embedUrl) {

    return Bluebird.resolve(embedUrl)
      .then((embedUrl) => {

        const qs = {};

        // Copy provider API parameters
        _.forOwn(_apiParameters, (value, key) => {
          qs[key] = value;
        });

        qs.url = embedUrl;

        return {
          uri: _apiUrl,
          json: true,
          followAllRedirects: true,
          useQuerystring: true,
          qs: qs,
          headers: {
            'User-Agent': 'Embedify'
          }
        };
      })
      .then(request)
      .then((contents) => {

        if (!contents || !contents.length) {
          throw new ApiRequestError('API request did not return valid response');
        }

        const statusCode = contents[0].statusCode;

        if (statusCode >= 400) {
          throw new ApiRequestError('Status code %d indicates error', statusCode);
        }

        return contents[0].body;

      });
  }

  /**
   * Adds a test
   *
   * @param {String} matchUrl
   * @param {String} embedUrl
   */

  function addTest(matchUrl, embedUrl) {

    if (!_.isString(matchUrl)) {
      throw new TypeError('Invalid matchUrl');
    }

    if (!(_.isString(embedUrl) || embedUrl === null || embedUrl === undefined)) {
      throw new TypeError('Invalid embedUrl');
    }

    _tests.push({ matchUrl, embedUrl });
  }

  function getName() {
    return _name;
  }

  function getTests() {
    return _tests;
  }

  return {
    name: getName(),
    fetch,
    match,
    tests: getTests(),
    addTest,
  };
}

module.exports = provider;
