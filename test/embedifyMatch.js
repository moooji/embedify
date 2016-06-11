'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const embedify = require('../index');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('Embedify Match', () => {
  it('should return result if matchUrls is valid string', () => {
    const matchUrls = 'https://www.youtube.com/embed/iOf7CsxmFCs';
    const expectedResult = [{
      providerName: 'youtube',
      embedUrl: 'https://www.youtube.com/watch?v=iOf7CsxmFCs',
    }];

    return expect(embedify.match(matchUrls))
      .to.eventually.be.fulfilled
      .then(result => expect(result).to.deep.equal(expectedResult));
  });

  it('should return result if matchUrls is valid array', () => {
    const matchUrls = [
      'https://www.youtube.com/embed/iOf7CsxmFCs',
      'https://www.youtube.com/watch?v=nfWlot6h_JM',
    ];

    const expectedResult = [
      {
        providerName: 'youtube',
        embedUrl: 'https://www.youtube.com/watch?v=iOf7CsxmFCs',
      },
      {
        providerName: 'youtube',
        embedUrl: 'https://www.youtube.com/watch?v=nfWlot6h_JM',
      }];

    return expect(embedify.match(matchUrls))
      .to.eventually.be.fulfilled
      .then(result => expect(result).to.deep.equal(expectedResult));
  });

  it('should return one result for duplicate matchUrls', () => {
    const matchUrls = [
      'https://www.youtube.com/embed/iOf7CsxmFCs',
      'https://www.youtube.com/embed/iOf7CsxmFCs',
    ];

    const expectedResult = [
      {
        providerName: 'youtube',
        embedUrl: 'https://www.youtube.com/watch?v=iOf7CsxmFCs',
      }];

    return expect(embedify.match(matchUrls))
      .to.eventually.be.fulfilled
      .then(result => expect(result).to.deep.equal(expectedResult));
  });
});

describe('Embedify Match Errors', () => {
  it('should return TypeError if matchUrls is null', () => {
    const matchUrls = null;

    return expect(embedify.match(matchUrls))
      .to.be.rejectedWith(TypeError);
  });

  it('should return TypeError if embedUrl is undefined', () => {
    return expect(embedify.match())
      .to.be.rejectedWith(TypeError);
  });

  it('should return TypeError if embedUrl is number', () => {
    const matchUrls = 123;

    return expect(embedify.match(matchUrls))
      .to.be.rejectedWith(TypeError);
  });

  it('should return TypeError if embedUrl is object', () => {
    const matchUrls = {};

    return expect(embedify.match(matchUrls))
      .to.be.rejectedWith(TypeError);
  });

  it('should return TypeError if embedUrl is non-string array', () => {
    const matchUrls = [123, {}];

    return expect(embedify.match(matchUrls))
      .to.be.rejectedWith(TypeError);
  });
});
