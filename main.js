"use strict";

const fs = require("fs");
const Promise = require("bluebird");
const url = require("url-extended");
const _ = require("lodash");

const createError = require("custom-error-generator");
const InvalidArgumentError = createError('InvalidArgumentError');
const providers = requireProviders();

/**
 * Get the oEmbed information for a URL
 * @param {String} embedUrl
 * @param {Function} [callback]
 * @returns {Promise}
 */
function get(embedUrl, callback) {

    return Promise.resolve(embedUrl)
        .then(match)
        .then(function(providerName) {

            if (providerName) {

                const provider = providers[providerName];
                return provider.url;
            }
        })
        .nodeify(callback);
}

/**
 * Match url with provider regExp
 * @param {String} embedUrl
 * @returns {String}
 */
function match(embedUrl) {

    return Promise.resolve(embedUrl)
        .then(function (embedUrl) {

            let result = null;
            const parsedUrl = url.parse(embedUrl, true, true, true);

            // Iterate through all providers
            // and match url against regExp

            _.forOwn(providers, function(provider, providerName) {

                // Iterate through provider's regExp
                for (let re of provider.regExp) {

                    const match = parsedUrl.href.match(re);

                    if (match && match.length) {
                        result = providerName;
                        return;
                    }
                }

                // Return after first match
                if (result) {
                    return result;
                }
            });

            return result;
        })
        .catch(url.InvalidArgumentError, function (err) {

            // Wrap an rethrow url argument errors
            throw new InvalidArgumentError(err);
        });
}

/**
 * Requires all providers
 * @returns {Object}
 */
function requireProviders() {

    let result = {};
    const providerDir = "./providers";
    const providerFiles = fs.readdirSync(providerDir);

    for (let providerFile of providerFiles) {

        const providerName = providerFile.split(".")[0].toLowerCase();
        const providerPath = providerDir + "/" + providerFile;
        result[providerName] = require(providerPath);
    }

    return result;
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

// Errors
module.exports.InvalidArgumentError = InvalidArgumentError;