'use strict';

const _ = require('lodash');
const Bluebird = require('bluebird');

const plugins = new Map();
plugins.set('soundcloud', require('./plugins/soundcloud'));
plugins.set('spotify', require('./plugins/spotify'));
plugins.set('vimeo', require('./plugins/vimeo'));
plugins.set('youtube', require('./plugins/youtube'));

/**
 * Gets the oEmbed information for a URL
 *
 * @param {String|Array} matchUrls
 * @param {Function} [callback]
 * @returns {Promise}
 */

function get(matchUrls, callback) {
  return Bluebird.resolve(matchUrls)
    .then(match)
    .then(matches => {
      return matches.map(match => {
        const provider = providers[match.providerName];
        return provider.fetch(match.embedUrl);
      });
    })
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

/**
 * Return matching providers and transformed embed URLs
 *
 * @param {String|Array} matchUrls
 * @param {Function} [callback]
 * @returns {Promise}
 */

function match(matchUrls, callback) {
  return Bluebird.resolve(matchUrls)
    .then(sanitizeMatchUrls)
    .then(matchUrls => matchUrls.map(matchUrl => matchOne(matchUrl)))
    .all()
    .then(mergeMatchResults)
    .then(sanitizeMatchResults)
    .nodeify(callback);
}

/**
 * Return matching provider and transformed embed URL
 *
 * @param {String} matchUrl
 * @returns {Promise}
 */

function matchOne(matchUrl) {
  return Bluebird.resolve(matchUrl)
    .then(matchUrl => {
      return _.map(_.keys(providers), providerName => {
        return providers[providerName].match(matchUrl);
      });
    })
    .all();
}

/**
 * Merges match results from different URLs
 *
 * @param {Array} matchResults
 * @returns {Array}
 */

function mergeMatchResults(matchResults) {
  let result = [];

  matchResults.forEach(item => {
    if (_.isArray(item)) {
      result = _.union(result, item);
    }
  });

  return result;
}

/**
 * Ensures that match results are unique and valid
 *
 * @param {Array} matchResults
 * @returns {Array}
 */

function sanitizeMatchResults(matchResults) {
  const result = [];

  matchResults.forEach(matchResult => {
    if (matchResult !== null &&
      matchResult !== undefined &&
      _.where(result, matchResult).length === 0) {
      result.push(matchResult);
    }
  });

  return result;
}

/**
 * Ensures that matchUrls is array of URLs
 *
 * @param {String|Array} matchUrls
 * @returns {Array}
 */

function sanitizeMatchUrls(matchUrls) {
  if (_.isString(matchUrls)) {
    matchUrls = [matchUrls];
  }

  if (!_.isArray(matchUrls)) {
    throw new TypeError('Invalid match URLs - should be string or array');
  }

  for (let matchUrl of matchUrls) {
    if (!_.isString(matchUrl)) {
      throw new TypeError('Invalid match URL - should be string');
    }
  }

  return _.uniq(matchUrls);
}

// Public
module.exports.get = get;
module.exports.match = match;
module.exports.plugins = plugins;
