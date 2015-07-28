"use strict";

const _ = require("lodash");
const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
const embedify = require('../main');

const InvalidArgumentError = embedify.InvalidArgumentError;
const ApiRequestError = embedify.ApiRequestError;
const UrlMatchError = embedify.UrlMatchError;

const expect = chai.expect;
const should = chai.should;
chai.use(chaiAsPromised);

describe('Get', function() {

    it('should return InvalidArgumentError if url is null', function () {

        const url = null;
        return expect(embedify.get(url)).to.be.rejectedWith(InvalidArgumentError);
    });

    it('should return InvalidArgumentError if url is undefined', function () {

        const url = undefined;
        return expect(embedify.get(url)).to.be.rejectedWith(InvalidArgumentError);
    });

    it('should return InvalidArgumentError if url is number', function () {

        const url = 123;
        return expect(embedify.get(url)).to.be.rejectedWith(InvalidArgumentError);
    });

    it('should return InvalidArgumentError if url is object', function () {

        const url = {};
        return expect(embedify.get(url)).to.be.rejectedWith(InvalidArgumentError);
    });

    it('should return InvalidArgumentError if url is array', function () {

        const url = [];
        return expect(embedify.get(url)).to.be.rejectedWith(InvalidArgumentError);
    });

    it('should return InvalidArgumentError if url is not absolute', function () {

        const url = "/embed/iOf7CsxmFCt";
        return expect(embedify.get(url)).to.be.rejectedWith(InvalidArgumentError);
    });

    it('should return InvalidArgumentError if url is malformed', function () {

        const url = "http:://embed/iOf7CsxmFCt";
        return expect(embedify.get(url)).to.be.rejectedWith(InvalidArgumentError);
    });

    it('should return result if url is valid', function () {

        const url = "https://www.youtube.com/embed/iOf7CsxmFCs";
        return expect(embedify.get(url))
            .to.eventually.be.fulfilled
            .then(function (result) {
                return expect(result.type).to.equal("video");
            });
    });
});

// Iterate through all providers
_.forOwn(embedify.providers, function(provider, providerName) {

    if (provider.tests && provider.tests.length) {

        describe('Get [' + provider.name + ']', function () {

            // Iterate through all tests defined for plugin
            for (let i = 0; i < provider.tests.length; i++) {

                const test = provider.tests[i];
                const numTest = i + 1;

                it('should pass test ' + numTest, function () {

                    if(test.match) {
                        return expect(provider.get(test.url))
                            .to.eventually.be.fulfilled
                            .then(function (result) {
                                return expect(result).to.deep.equal(test.result);
                            });
                    }
                    else {
                        return expect(provider.get(test.url))
                            .to.be.rejectedWith(UrlMatchError);
                    }
                });
            }
        });
    }
});