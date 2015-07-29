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

// Iterate through all providers
_.forOwn(embedify.providers, function(provider, providerName) {

    if (provider.tests && provider.tests.length) {

        describe('Get [' + providerName + ']', function () {

            // Iterate through all tests defined for plugin
            for (let i = 0; i < provider.tests.length; i++) {

                const test = provider.tests[i];
                const numTest = i + 1;

                it('should pass test ' + numTest, function () {

                    if(_.isString(test.embedUrl)) {

                        return expect(provider.match(test.matchUrl).then(provider.fetch))
                            .to.eventually.be.fulfilled
                            .then(function (result) {
                                return expect(result.type).to.be.string;
                            });
                    }
                    else {

                        return expect(provider.match(test.matchUrl).then(provider.fetch))
                            .to.be.rejectedWith(UrlMatchError);
                    }
                });
            }
        });
    }
});