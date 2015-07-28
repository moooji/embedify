"use strict";

const fs = require("fs");
const _ = require("lodash");
const Promise = require("bluebird");

const InvalidArgumentError = require("./lib/errors").InvalidArgumentError;
const ApiRequestError = require("./lib/errors").ApiRequestError;
const UrlMatchError = require("./lib/errors").UrlMatchError;

const providers = requireProviders();

/**
 * Gets the oEmbed information for a URL
 * @param {String} embedUrl
 * @param {Function} [callback]
 * @returns {Promise|Function}
 */
function get(embedUrl, callback) {

    let result = null;

    return Promise.resolve(providers)
        .each(function(provider) {

            if(result) {
                return;
            }

            return provider.get(embedUrl)
                .then(function(providerResult) {
                    result = providerResult;
                })
                .catch(UrlMatchError, function(err) {
                    // Just continue with next provider...
                });
        })
        .then(function() {
            return result;
        })
        .nodeify(callback);
}

/**
 * Requires all providers
 * @returns {Object}
 */
function requireProviders() {

    let result = [];
    const providerDir = "./providers";
    const providerFiles = fs.readdirSync(providerDir);

    for (let providerFile of providerFiles) {

        const providerPath = providerDir + "/" + providerFile;
        const provider = require(providerPath);
        result.push(provider);
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
module.exports.providers = getProviders();
module.exports.InvalidArgumentError = InvalidArgumentError;
module.exports.ApiRequestError = ApiRequestError;
module.exports.UrlMatchError = UrlMatchError;