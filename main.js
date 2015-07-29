"use strict";

const fs = require("fs");
const path = require("path");
const _ = require("lodash");
const Promise = require("bluebird");

const InvalidArgumentError = require("./lib/errors").InvalidArgumentError;
const ApiRequestError = require("./lib/errors").ApiRequestError;
const UrlMatchError = require("./lib/errors").UrlMatchError;

const providers = requireProviders();

/**
 * Gets the oEmbed information for a URL
 * @param {String|Array} matchUrls
 * @param {Function} [callback]
 * @returns {Promise|Function}
 */
function get(matchUrls, callback) {

    return Promise.resolve(matchUrls)
        .then(match)
        .then(function(matches) {

            const uniqueMatches = [];
            const promiseCollection = [];

            for (let match of matches) {

                if (!_.where(uniqueMatches, match).length) {

                    const provider = providers[match.providerName];
                    const fetchPromise = provider.fetch(match.embedUrl);

                    uniqueMatches.push(match);
                    promiseCollection.push(fetchPromise);
                }
            }

            return promiseCollection;
        })
        .all()
        .nodeify(callback);
}

/**
 * Return matching providers and transformed embed URLs
 * @param {String|Array} matchUrls
 * @param {Function} [callback]
 * @returns {Promise}
 */
function match(matchUrls, callback) {

    return Promise.resolve(matchUrls)
        .then(sanitizeMatchUrls)
        .then(function(matchUrls) {

            return _.map(matchUrls, function(matchUrl) {
                return matchOne(matchUrl);
            });
        })
        .all()
        .nodeify(callback);
}

/**
 * Return matching provider and transformed embed URL
 * @param {String} matchUrl
 * @returns {Promise}
 */
function matchOne(matchUrl) {

    return Promise.resolve(matchUrl)
        .then(function(matchUrl) {

            return _.map(_.keys(providers), function(providerName) {

                return providers[providerName].match(matchUrl)
                    .then(function(embedUrl) {

                        return {
                            providerName: providerName,
                            embedUrl: embedUrl
                        }
                    });
            });
        })
        .any()
}

/**
 * Requires all providers
 * @returns {Object}
 */
function requireProviders() {

    const result = {};
    const providerDir = __dirname + "/providers";
    const providerFiles = fs.readdirSync(providerDir);

    for (let providerFile of providerFiles) {

        const providerPath = providerDir + "/" + providerFile;
        const parsedPath = path.parse(providerPath);

        result[parsedPath.name] = require(providerPath);
    }

    return result;
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
        throw new InvalidArgumentError("Invalid match URLs - should be string or array");
    }

    for (let matchUrl of matchUrls) {

        if (!_.isString(matchUrl)) {
            throw new InvalidArgumentError("Invalid match URL - should be string");
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