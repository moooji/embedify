'use strict';

const _ = require('lodash');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const embedify = require('../index');

const expect = chai.expect;
chai.use(chaiAsPromised);

// Iterate through all providers
_.forOwn(embedify.providers, (provider, providerName) => {
  if (provider.tests && provider.tests.length) {
    describe(`Get [${providerName}]`, () => {
      // Iterate through all tests defined for plugin
      for (let i = 0; i < provider.tests.length; i++) {
        const test = provider.tests[i];
        const numTest = i + 1;

        it(`should pass test ${numTest}`, () => {
          if (_.isString(test.embedUrl)) {
            expect(provider.match(test.matchUrl)
              .then(match => provider.fetch(match.embedUrl)))
              .to.eventually.be.fulfilled
              .then(result => expect(result.type).to.be.string);
          }
        });
      }
    });
  }
});
