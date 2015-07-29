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
 * @param {String} apiUrl
 * @param {Array} regExp
 * @param {Function} transform
 * @param {Object} [apiParameters]
 */
function provider(apiUrl, regExp, transform, apiParameters) {

    validateApiUrl(apiUrl);
    validateRegExp(regExp);
    validateTransform(transform);
    validateApiParameters(apiParameters);

    const _tests = [];
    const _apiUrl = apiUrl;
    const _regExp = regExp;
    const _transform = transform;
    const _apiParameters = _.isPlainObject(apiParameters) ? apiParameters : {};

    /**
     * Returns the oEmbed information
     * @param {String} embedUrl
     * @returns {Promise}
     */
    function get(embedUrl) {

        return Promise.resolve(embedUrl)
            .then(match)
            .then(_transform)
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

                // Iterate through provided regExp
                // and return first match
                for (let re of _regExp) {

                    const match = embedUrl.match(re);

                    // If there is a match,
                    // return from loop
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
                throw new ApiRequestError("API request failed", err);
            });
    }

    /**
     * Adds a test
     * @param {String} embedUrl
     * @param {Boolean} isMatch
     */
    function addTest(embedUrl, isMatch) {


        if(!_.isString(embedUrl)) {
            throw new InvalidArgumentError("Invalid embedUrl");
        }

        if(!_.isBoolean(isMatch)) {
            throw new InvalidArgumentError("Invalid isMatch argument");
        }

        _tests.push({ embedUrl: embedUrl, isMatch: isMatch });
    }

    /**
     * Validates the API Url
     * @param {String} apiUrl
     */
    function validateApiUrl(apiUrl) {

        if(!_.isString(apiUrl)) {
            throw new InvalidArgumentError("Invalid API Url");
        }
    }

    /**
     * Validates the regular expressions
     * @param {Array} regExp
     */
    function validateRegExp(regExp) {

        if(!_.isArray(regExp)) {
            throw new InvalidArgumentError("Invalid regExp - needs to be array of regExp");
        }
    }

    /**
     * Validates the transform function
     * @param {Function} transform
     */
    function validateTransform(transform) {

        if(!_.isFunction(transform)) {
            throw new InvalidArgumentError("Invalid transform function");
        }
    }

    /**
     * Validates the API parameters
     * @param {Object} apiParameters
     */
    function validateApiParameters(apiParameters) {

        if (apiParameters !== null &&
            apiParameters !== undefined &&
            !_.isPlainObject(apiParameters)) {
            throw new InvalidArgumentError("Invalid apiParameters - needs to be plain object");
        }
    }

    /**
     * Getter for provider tests
     * @returns {Array}
     */
    function getTests() {
        return _tests;
    }

    return {
        get: get,
        match: match,
        tests: getTests(),
        addTest: addTest
    }
}

module.exports = provider;