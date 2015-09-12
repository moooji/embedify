'use strict';

const fs = require('fs');
const _ = require('lodash');
const Bluebird = require('bluebird');

const InvalidArgumentError = require('./lib/errors').InvalidArgumentError;
const ApiRequestError = require('./lib/errors').ApiRequestError;
const UrlMatchError = require('./lib/errors').UrlMatchError;

const providers = requireProviders();

/**
 * Gets the oEmbed information for a URL
 * @param {String|Array} matchUrls
 * @param {Function} [callback]
 * @returns {Promise}
 */

function get(matchUrls, callback) {

  return Bluebird.resolve(matchUrls)
    .then(match)
    .then((matches) => {

      return _.map(matches, function(match) {

        const provider = providers[match.providerName];
        return provider.fetch(match.embedUrl);
      });
    })
    .all()
    .then((res) => {

      // Return null if there is no item
      if (res.length === 0) {
        return null;
      }

      // Return string if there is only one item
      if (res.length === 1) {
        return res[0];
      }

      return res;
    })
    .nodeify(callback);
}

/**
 * Return matching providers and transformed embed URLs
 * @param {String|Array} matchUrls
 * @param {Function} [callback]
 * @returns {Promise}
 */

function match(matchUrls, callback) {

  return Bluebird.resolve(matchUrls)
    .then(sanitizeMatchUrls)
    .then((matchUrls) => {

      return _.map(matchUrls, function(matchUrl) {
        return matchOne(matchUrl);
      });
    })
    .all()
    .then(mergeMatchResults)
    .then(sanitizeMatchResults)
    .nodeify(callback);
}

/**
 * Return matching provider and transformed embed URL
 * @param {String} matchUrl
 * @returns {Promise}
 */

function matchOne(matchUrl) {

  return Bluebird.resolve(matchUrl)
    .then((matchUrl) => {

      return _.map(_.keys(providers), (providerName) => {
        return providers[providerName].match(matchUrl);
      });
    })
    .all();
}

/**
 * Merges match results from different URLs
 * @param {Array} matchResults
 * @returns {Array}
 */

function mergeMatchResults(matchResults) {

  let result = [];

  matchResults.forEach((item) => {

    if (_.isArray(item)) {
      result = _.union(result, item);
    }
  });

  return result;
}

/**
 * Ensures that match results are unique and valid
 * @param {Array} matchResults
 * @returns {Array}
 */

function sanitizeMatchResults(matchResults) {

  const result = [];

  matchResults.forEach((matchResult) => {

    if (matchResult !== null &&
      matchResult !== undefined &&
      _.where(result, matchResult).length === 0) {
      result.push(matchResult);
    }
  });

  return result;
}

/**
 * Requires all providers
 * @returns {Object}
 */

function requireProviders() {

  const providers = {};
  const providerDir = __dirname + '/providers';
  const providerFiles = fs.readdirSync(providerDir);

  providerFiles.forEach((providerFile) => {
    const providerPath = providerDir + '/' + providerFile;
    const provider = require(providerPath);
    providers[provider.name] = provider;
  });

  return providers;
}

/**
 * Ensures that matchUrls is array of URLs
 * @param {String|Array} matchUrls
 * @returns {Array}
 */

function sanitizeMatchUrls(matchUrls) {

  if (_.isString(matchUrls)) {
    matchUrls = [matchUrls];
  }

  if (!_.isArray(matchUrls)) {
    throw new InvalidArgumentError('Invalid match URLs - should be string or array');
  }

  for (let matchUrl of matchUrls) {

    if (!_.isString(matchUrl)) {
      throw new InvalidArgumentError('Invalid match URL - should be string');
    }
  }

  return _.uniq(matchUrls);
}

/**
 * Getter for providers
 * @returns {Object}
 */

function getProviders() {
  return providers;
}

// Public
module.exports.get = get;
module.exports.match = match;
module.exports.providers = getProviders();
module.exports.InvalidArgumentError = InvalidArgumentError;
module.exports.ApiRequestError = ApiRequestError;
module.exports.UrlMatchError = UrlMatchError;
