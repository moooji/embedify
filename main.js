"use strict";

const fs = require("fs");
const path = require("path");
const _ = require("lodash");
const Promise = require("bluebird");
const url = require("url-extended");

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

    return Promise.resolve(embedUrl)
        .then(match)
        .then(function(res) {
            return providers[res.providerName].fetch(res.embedUrl);
        })
        .nodeify(callback);
}

function match(embedUrl, callback) {

    return Promise.resolve(embedUrl)
        .then(function (embedUrl) {

            // Parse url to ensure that it is absolute and valid http(s),
            // otherwise throw InvalidArgumentError.
            //
            // Using 'url-extended' package:
            // url.parse(urlString, validateAbsolute, validateHttp)
            const parsedUrl = url.parse(embedUrl, true, true);
            return parsedUrl.href;
        })
        .catch(url.InvalidArgumentError, function (err) {

            // Wrap and rethrow
            throw new InvalidArgumentError(err);
        })
        .then(function(embedUrl) {

            return _.map(_.keys(providers), function(providerName) {

                return providers[providerName].match(embedUrl)
                    .then(function(embedUrl) {

                        return {
                            providerName: providerName,
                            embedUrl: embedUrl
                        }
                    })
            });
        })
        .any()
        .nodeify(callback);
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