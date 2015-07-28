"use strict";

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
for (let provider of embedify.providers) {

    if (provider.tests && provider.tests.length) {

        describe('Get [' + provider.name + ']', function () {

            // Iterate through all tests defined for plugin
            for (let i = 0; i < provider.tests.length; i++) {

                const test = provider.tests[i];
                const numTest = i + 1;

                it('should pass test ' + numTest, function () {

                    if(test.isMatch) {

                        return expect(provider.get(test.embedUrl))
                            .to.eventually.be.fulfilled
                            .then(function (result) {
                                return expect(result.type).to.be.string;
                            });
                    }
                    else {

                        return expect(provider.get(test.embedUrl))
                            .to.be.rejectedWith(UrlMatchError);
                    }
                });
            }
        });
    }
}