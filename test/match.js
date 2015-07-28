"use strict";

const _ = require("lodash");
const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
const oEmbed = require('../main');
const InvalidArgumentError = oEmbed.InvalidArgumentError;

const expect = chai.expect;
const should = chai.should;
chai.use(chaiAsPromised);

describe('Match', function() {

    it('should return InvalidArgumentError if url is null', function () {

        const url = null;
        return expect(oEmbed.match(url)).to.throw(InvalidArgumentError);
    });

    it('should return InvalidArgumentError if url is undefined', function () {

        const url = undefined;
        return expect(oEmbed.match(url)).to.throw(InvalidArgumentError);
    });

    it('should return InvalidArgumentError if url is number', function () {

        const url = 123;
        return expect(oEmbed.match(url)).to.throw(InvalidArgumentError);
    });

    it('should return InvalidArgumentError if url is object', function () {

        const url = {};
        return expect(oEmbed.match(url)).to.throw(InvalidArgumentError);
    });

    it('should return InvalidArgumentError if url is array', function () {

        const url = [];
        return expect(oEmbed.match(url)).to.throw(InvalidArgumentError);
    });

    it('should return InvalidArgumentError if url is not absolute', function () {

        const url = "/embed/iOf7CsxmFCt";
        return expect(oEmbed.match(url)).to.throw(InvalidArgumentError);
    });

    it('should return InvalidArgumentError if url is malformed', function () {

        const url = "http://embed/iOf7CsxmFCt";
        return expect(oEmbed.match(url)).to.throw(InvalidArgumentError);
    });
});

// Iterate through all providers
_.forOwn(oEmbed.providers, function(provider, providerName) {

    if (provider.tests && provider.tests.length) {

        describe('Provider - ' + providerName, function () {

            // Iterate through all tests defined for plugin
            for (let i = 0; i < provider.tests.length; i++) {

                const test = provider.tests[i];
                const numTest = i + 1;

                it('should pass test ' + numTest, function () {

                    if (test.match === true) {
                        const match = oEmbed.match(test.url);
                        expect(match).to.equal(providerName);
                    }
                    else {
                        expect(oEmbed.match(test.url)).to.not.equal(providerName);
                    }
                });
            }
        });
    }
});