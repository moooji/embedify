"use strict";

const fs = require("fs");
const Promise = require("bluebird");
const _ = require("lodash");

const createError = require("custom-error-generator");
const InvalidArgumentError = createError('InvalidArgumentError');
const providers = requireProviders();

/**
 * Get the oEmbed information for a URL
 * @param {String} url
 * @param {Function} [callback]
 * @returns {Promise}
 */
function get(url, callback) {

    return Promise.resolve(url)
        .then(function(url) {

            /*
            for (let provider of providers) {

                if(provider.match(url)) {
                    return plugin.get(url);
                }
            }
            */
        })
        .nodeify(callback);
}

/**
 * Match url with provider regExp
 * @param {String} url
 * @returns {String}
 */
function match(url) {

    let result = null;

    // Iterate through all providers
    // and match url against regExp

    _.forOwn(providers, function(provider, providerName) {

        // Iterate through provider's regExp
        for (let re of provider.regExp) {

            const match = url.match(re);

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