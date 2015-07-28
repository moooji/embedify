"use strict";

const _ = require("lodash");
const Promise = require("bluebird");
const url = require("url-extended");
const request = Promise.promisify(require("request"));
const InvalidArgumentError = require("./errors").InvalidArgumentError;
const ApiRequestError = require("./errors").ApiRequestError;
const UrlMatchError = require("./errors").UrlMatchError;

/**
 * Constructor
 * @param {String} name
 * @param {String} apiUrl
 * @param {Array} regExp
 * @param {Array} tests
 * @param {Object} [options]
 */
function provider(name, apiUrl, regExp, tests, options) {

    if(!(_.isString(name) && name.length)) {
        throw new InvalidArgumentError("Invalid provider name");
    }

    if(!_.isString(apiUrl)) {
        throw new InvalidArgumentError("Invalid API Url");
    }

    if(!_.isArray(regExp)) {
        throw new InvalidArgumentError("Invalid regExp - needs to be array of regExp");
    }

    if(!_.isArray(tests)) {
        throw new InvalidArgumentError("Invalid tests - needs to be array of tests");
    }

    if (options !== null &&
        options !== undefined &&
        !_.isPlainObject(options)) {
        throw new InvalidArgumentError("Invalid options - needs to be plain object");
    }

    const _name = name;
    const _regExp = regExp;
    const _apiUrl = apiUrl;
    const _tests = tests;
    const _apiParameters = options && _.isPlainObject(options.apiParameters) ? options.apiParameters : {};
    const _transform = options && _.isFunction(options.transform) ? options.transform : null;

    /**
     * Returns the oEmbed information
     * @param {String} embedUrl
     * @returns {Promise}
     */
    function get(embedUrl) {

        return Promise.resolve(embedUrl)
            .then(match)
            .then(transform)
            .then(fetch)
    }

    /**
     * Matches url with provider regExp
     * @param {String} embedUrl
     * @returns {Promise}
     */
    function match(embedUrl) {

        return Promise.resolve(embedUrl)
            .then(function (embedUrl) {

                // Parse url to ensure that it is absolute and valid http(s),
                // otherwise throw InvalidArgumentError.
                //
                // Using 'url-extended' package:
                // url.parse(urlString, validateAbsolute, validateHttp)
                const parsedUrl = url.parse(embedUrl, true, true);

                // Iterate through provided regExp
                // and return first match
                for (let re of _regExp) {

                    const match = parsedUrl.href.match(re);

                    if (match && match.length) {
                        return match;
                    }
                }

                // If there was no match, throw error
                throw UrlMatchError("Url does not match provider");
            })
            .catch(url.InvalidArgumentError, function (err) {

                // Wrap and rethrow
                throw new InvalidArgumentError(err);
            });
    }

    /**
     * Transform function for embedUrl
     * @param match
     * @returns {String}
     */
    function transform(match) {

        if (_transform) {
           return _transform(match);
        }

        return match[0];
    }

    /**
     * Requests oEmbed information from provider
     * @param {String} embedUrl
     * @returns {Promise}
     */
    function fetch(embedUrl) {

        return Promise.resolve(embedUrl)
            .then(function(embedUrl) {

                _apiParameters.url = embedUrl;

                return {
                    uri: _apiUrl,
                    json: true,
                    useQuerystring: true,
                    qs: _apiParameters
                }
            })
            .then(request)
            .then(function(contents) {

                if(!contents || !contents.length) {
                    throw new ApiRequestError("API request did not return valid response");
                }

                // Check status code to be 200 OK
                const statusCode = contents[0].statusCode;

                if (statusCode !== 200) {
                    throw new ApiRequestError("Status code %d indicates error", statusCode);
                }

                return contents[0].body;

            }).catch(function(err) {
                console.log(err);
                throw new ApiRequestError("API request failed", err);
            });
    }

    /**
     * Getter for provider tests
     * @returns {Array}
     */
    function getTests() {
        return _tests;
    }

    /**
     * Getter for provider name
     * @returns {String}
     */
    function getName() {
        return _name;
    }

    return {
        get: get,
        tests: getTests(),
        name: getName()
    }
}

module.exports = provider;