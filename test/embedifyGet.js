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

describe('Embedify Get', function() {

    it('should return result if embedUrl is valid string', function () {

        const embedUrl = "https://www.youtube.com/embed/iOf7CsxmFCs";
        return expect(embedify.get(embedUrl))
            .to.eventually.be.fulfilled
            .then(function (result) {
                return expect(result.type).to.equal("video");
            });
    });
});

describe('Embedify Get Errors', function() {

    it('should return InvalidArgumentError if embedUrl is null', function () {

        const embedUrl = null;
        return expect(embedify.get(embedUrl)).to.be.rejectedWith(InvalidArgumentError);
    });

    it('should return InvalidArgumentError if embedUrl is undefined', function () {

        const embedUrl = undefined;
        return expect(embedify.get(embedUrl)).to.be.rejectedWith(InvalidArgumentError);
    });

    it('should return InvalidArgumentError if embedUrl is number', function () {

        const embedUrl = 123;
        return expect(embedify.get(embedUrl)).to.be.rejectedWith(InvalidArgumentError);
    });

    it('should return InvalidArgumentError if embedUrl is object', function () {

        const embedUrl = {};
        return expect(embedify.get(embedUrl)).to.be.rejectedWith(InvalidArgumentError);
    });

    it('should return InvalidArgumentError if embedUrl is array', function () {

        const embedUrl = [];
        return expect(embedify.get(embedUrl)).to.be.rejectedWith(InvalidArgumentError);
    });

    it('should return InvalidArgumentError if embedUrl is not absolute', function () {

        const embedUrl = "/embed/iOf7CsxmFCt";
        return expect(embedify.get(embedUrl)).to.be.rejectedWith(InvalidArgumentError);
    });

    it('should return InvalidArgumentError if embedUrl is malformed', function () {

        const embedUrl = "http:://embed/iOf7CsxmFCt";
        return expect(embedify.get(embedUrl)).to.be.rejectedWith(InvalidArgumentError);
    });
});