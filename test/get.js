"use strict";

const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
const oEmbed = require('../main');
const InvalidArgumentError = oEmbed.InvalidArgumentError;

const expect = chai.expect;
const should = chai.should;
chai.use(chaiAsPromised);

describe('Get', function() {

    it('should return InvalidArgumentError if url is null', function () {

        const url = null;
        return expect(oEmbed.get(url)).to.be.rejectedWith(InvalidArgumentError);
    });

    it('should return InvalidArgumentError if url is undefined', function () {

        const url = undefined;
        return expect(oEmbed.get(url)).to.be.rejectedWith(InvalidArgumentError);
    });

    it('should return InvalidArgumentError if url is number', function () {

        const url = 123;
        return expect(oEmbed.get(url)).to.be.rejectedWith(InvalidArgumentError);
    });

    it('should return InvalidArgumentError if url is object', function () {

        const url = {};
        return expect(oEmbed.get(url)).to.be.rejectedWith(InvalidArgumentError);
    });

    it('should return InvalidArgumentError if url is array', function () {

        const url = [];
        return expect(oEmbed.get(url)).to.be.rejectedWith(InvalidArgumentError);
    });

    it('should return InvalidArgumentError if url is not absolute', function () {

        const url = "/embed/iOf7CsxmFCt";
        return expect(oEmbed.get(url)).to.be.rejectedWith(InvalidArgumentError);
    });

    it('should return InvalidArgumentError if url is malformed', function () {

        const url = "http://embed/iOf7CsxmFCt";
        return expect(oEmbed.get(url)).to.be.rejectedWith(InvalidArgumentError);
    });

    it('should return result if url is valid', function () {

        const url = "http://www.youtube.com/embed/iOf7CsxmFCt";
        return expect(oEmbed.get(url)).to.eventually.be.fulfilled;
    });
});

// Iterate through all plugins
for (let plugin of oEmbed.plugins) {

    if (plugin.tests && plugin.tests.length) {

        describe('Plugin - ' + plugin.name, function () {

            // Iterate through all tests defined for plugin
            for (let i = 0; i < plugin.tests.length; i++) {

                const test = plugin.tests[i];
                const numTest = i + 1;

                it('should pass test ' + numTest, function () {

                    return expect(oEmbed.get(test.url, test.options))
                        .to.eventually.be.fulfilled
                        .then(function (result) {
                            expect(result).to.deep.equal(test.result);
                        });
                });
            }
        });
    }
}