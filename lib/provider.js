'use strict';

const _ = require('lodash');
const Bluebird = require('bluebird');
const request = Bluebird.promisify(require('request'));

const InvalidArgumentError = require('./errors').InvalidArgumentError;
const ApiRequestError = require('./errors').ApiRequestError;

/**
 * Constructor
 * @param {String} name
 * @param {String} apiUrl
 * @param {Array} regExp
 * @param {Function} transform
 * @param {Object} [apiParameters]
 */

function provider(name, apiUrl, regExp, transform, apiParameters) {

  validateName(name);
  validateApiUrl(apiUrl);
  validateRegExp(regExp);
  validateTransform(transform);
  validateApiParameters(apiParameters);

  const _tests = [];
  const _name = name;
  const _apiUrl = apiUrl;
  const _regExp = regExp;
  const _transform = transform;
  const _apiParameters = _.isPlainObject(apiParameters) ? apiParameters : {};

  /**
   * Matches url with provider regExp
   * @param {String} matchUrl
   * @returns {Promise}
   */

  function match(matchUrl) {

    return Bluebird.resolve(matchUrl)
      .then(function(matchUrl) {

        let result = null;

        // Iterate through provided regExp
        // and return first match
        for (let re of _regExp) {

          const match = matchUrl.match(re);

          // If there is a match,
          // return from loop
          if (match && match.length) {
            result = match;
            return result;
          }
        }

        return result;
      })
      .then(transformMatch)
      .then((embedUrl) => {

        const hasEmbedUrl = _.isString(embedUrl);
        return hasEmbedUrl ? {providerName: _name, embedUrl: embedUrl} : null;
      });
  }

  function transformMatch(match) {

    const hasMatch = _.isArray(match) && match.length;
    return hasMatch ? _transform(match) : null;
  }

  /**
   * Requests oEmbed information from provider
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

      }).catch((err) => {
        throw new ApiRequestError(err);
      });
  }

  /**
   * Adds a test
   * @param {String} matchUrl
   * @param {String} embedUrl
   */

  function addTest(matchUrl, embedUrl) {

    if (!_.isString(matchUrl)) {
      throw new InvalidArgumentError('Invalid matchUrl');
    }

    if (!(_.isString(embedUrl) || embedUrl === null || embedUrl === undefined)) {
      throw new InvalidArgumentError('Invalid embedUrl');
    }

    _tests.push({matchUrl: matchUrl, embedUrl: embedUrl});
  }

  /**
   * Validates the provider name
   * @param {String} providerName
   */

  function validateName(providerName) {

    if (!_.isString(providerName)) {
      throw new InvalidArgumentError('Invalid provider name');
    }
  }

  /**
   * Validates the API Url
   * @param {String} apiUrl
   */

  function validateApiUrl(apiUrl) {

    if (!_.isString(apiUrl)) {
      throw new InvalidArgumentError('Invalid API Url');
    }
  }

  /**
   * Validates the regular expressions
   * @param {Array} regExp
   */

  function validateRegExp(regExp) {

    if (!_.isArray(regExp)) {
      throw new InvalidArgumentError('Invalid regExp - needs to be array of regExp');
    }
  }

  /**
   * Validates the transform function
   * @param {Function} transform
   */

  function validateTransform(transform) {

    if (!_.isFunction(transform)) {
      throw new InvalidArgumentError('Invalid transform function');
    }
  }

  /**
   * Validates the API parameters
   * @param {Object} apiParameters
   */

  function validateApiParameters(apiParameters) {

    if (apiParameters !== null &&
      apiParameters !== undefined && !_.isPlainObject(apiParameters)) {
      throw new InvalidArgumentError('Invalid apiParameters - needs to be plain object');
    }
  }

  /**
   * Getter for provider name
   * @returns {String}
   */

  function getName() {
    return _name;
  }

  /**
   * Getter for provider tests
   * @returns {Array}
   */

  function getTests() {
    return _tests;
  }

  return {
    name: getName(),
    fetch: fetch,
    match: match,
    tests: getTests(),
    addTest: addTest
  };
}

module.exports = provider;
