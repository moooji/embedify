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

describe('Embedify Match', function() {

    it('should return result if matchUrls is valid string', function () {

        const matchUrls = "https://www.youtube.com/embed/iOf7CsxmFCs";
        const expectedResult = [{
            providerName: "youtube",
            embedUrl: "https://www.youtube.com/watch?v=iOf7CsxmFCs"
        }];

        return expect(embedify.match(matchUrls))
            .to.eventually.be.fulfilled
            .then(function(result) {
                return expect(result).to.deep.equal(expectedResult);
            });
    });

    it('should return result if matchUrls is valid array', function () {

        const matchUrls = [
            "https://www.youtube.com/embed/iOf7CsxmFCs",
            "https://www.youtube.com/watch?v=nfWlot6h_JM"
        ];

        const expectedResult = [
            {
                providerName: "youtube",
                embedUrl: "https://www.youtube.com/watch?v=iOf7CsxmFCs"
            },
            {
                providerName: "youtube",
                embedUrl: "https://www.youtube.com/watch?v=nfWlot6h_JM"
            }];

        return expect(embedify.match(matchUrls))
            .to.eventually.be.fulfilled
            .then(function(result) {
                return expect(result).to.deep.equal(expectedResult);
            });
    });
});

describe('Embedify Match Errors', function() {

    it('should return InvalidArgumentError if embedUrl is null', function () {

        const embedUrl = null;
        return expect(embedify.match(embedUrl)).to.be.rejectedWith(InvalidArgumentError);
    });

    it('should return InvalidArgumentError if embedUrl is undefined', function () {

        const embedUrl = undefined;
        return expect(embedify.match(embedUrl)).to.be.rejectedWith(InvalidArgumentError);
    });

    it('should return InvalidArgumentError if embedUrl is number', function () {

        const embedUrl = 123;
        return expect(embedify.match(embedUrl)).to.be.rejectedWith(InvalidArgumentError);
    });

    it('should return InvalidArgumentError if embedUrl is object', function () {

        const embedUrl = {};
        return expect(embedify.match(embedUrl)).to.be.rejectedWith(InvalidArgumentError);
    });

    it('should return InvalidArgumentError if embedUrl is non-string array', function () {

        const embedUrl = [123, {}];
        return expect(embedify.match(embedUrl)).to.be.rejectedWith(InvalidArgumentError);
    });
});