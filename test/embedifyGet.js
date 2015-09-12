'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const embedify = require('../main');

const InvalidArgumentError = embedify.InvalidArgumentError;
const expect = chai.expect;
chai.use(chaiAsPromised);

describe('Embedify Get', function() {

  it('should return result if matchUrls is valid string', () => {

    const matchUrls = 'https://www.youtube.com/embed/iOf7CsxmFCs';
    return expect(embedify.get(matchUrls))
      .to.eventually.be.fulfilled
      .then(function(result) {
        return expect(result.type).to.equal('video');
      });
  });

  it('should return null for unknown providers', () => {

    const matchUrls = 'https://www.unknown.com/embed/iOf7CsxmFCs';
    return expect(embedify.get(matchUrls))
      .to.eventually.be.fulfilled
      .then(function(result) {
        return expect(result).to.equal.null;
      });
  });

  it('should return result if matchUrls is valid array', () => {

    const matchUrls = [
      'http://www.google.com',
      'https://www.youtube.com/embed/iOf7CsxmFCs',
      'https://www.youtube.com/watch?v=nfWlot6h_JM'
    ];

    const expectedResult = [
      {
        type: 'video',
        thumbnail_height: 360,
        thumbnail_url: 'https://i.ytimg.com/vi/iOf7CsxmFCs/hqdefault.jpg',
        provider_url: 'https://www.youtube.com/',
        provider_name: 'YouTube',
        width: 480,
        thumbnail_width: 480,
        title: '☼ Min sommer road trip | Del 1 ☼',
        author_url: 'https://www.youtube.com/user/AmandaS4G',
        version: '1.0',
        author_name: 'Amanda MIDK',
        height: 270,
        html: '<iframe width="480" height="270" ' +
        'src="https://www.youtube.com/embed/iOf7CsxmFCs?feature=oembed" ' +
        'frameborder="0" allowfullscreen></iframe>'
      },
      {
        author_name: 'TaylorSwiftVEVO',
        author_url: 'https://www.youtube.com/user/TaylorSwiftVEVO',
        height: 270,
        html: '<iframe width="480" height="270" ' +
        'src="https://www.youtube.com/embed/nfWlot6h_JM?feature=oembed" ' +
        'frameborder="0" allowfullscreen></iframe>',
        provider_name: 'YouTube',
        provider_url: 'https://www.youtube.com/',
        thumbnail_height: 360,
        thumbnail_url: 'https://i.ytimg.com/vi/nfWlot6h_JM/hqdefault.jpg',
        thumbnail_width: 480,
        title: 'Taylor Swift - Shake It Off',
        type: 'video',
        version: '1.0',
        width: 480
      }];

    return expect(embedify.get(matchUrls))
      .to.eventually.be.fulfilled
      .then(function(result) {
        return expect(result).to.deep.equal(expectedResult);
      });
  });

  it('should return one result for duplicate embedUrls', () => {

    const matchUrls = [
      'https://www.youtube.com/embed/iOf7CsxmFCs',
      'https://www.youtube.com/embed/iOf7CsxmFCs',
      'https://www.youtube.com/watch?v=iOf7CsxmFCs'
    ];

    const expectedResult = {
      type: 'video',
      thumbnail_height: 360,
      thumbnail_url: 'https://i.ytimg.com/vi/iOf7CsxmFCs/hqdefault.jpg',
      provider_url: 'https://www.youtube.com/',
      provider_name: 'YouTube',
      width: 480,
      thumbnail_width: 480,
      title: '☼ Min sommer road trip | Del 1 ☼',
      author_url: 'https://www.youtube.com/user/AmandaS4G',
      version: '1.0',
      author_name: 'Amanda MIDK',
      height: 270,
      html: '<iframe width="480" height="270" ' +
      'src="https://www.youtube.com/embed/iOf7CsxmFCs?feature=oembed" ' +
      'frameborder="0" allowfullscreen></iframe>'
    };

    return expect(embedify.get(matchUrls))
      .to.eventually.be.fulfilled
      .then(function(result) {
        return expect(result).to.deep.equal(expectedResult);
      });
  });
});

describe('Embedify Get Errors', function() {

  it('should return InvalidArgumentError if matchUrls is null', () => {

    const matchUrls = null;
    return expect(embedify.get(matchUrls))
      .to.be.rejectedWith(InvalidArgumentError);
  });

  it('should return InvalidArgumentError if matchUrls is undefined', () => {

    return expect(embedify.get())
      .to.be.rejectedWith(InvalidArgumentError);
  });

  it('should return InvalidArgumentError if matchUrls is number', () => {

    const matchUrls = 123;
    return expect(embedify.get(matchUrls))
      .to.be.rejectedWith(InvalidArgumentError);
  });

  it('should return InvalidArgumentError if matchUrls is object', () => {

    const matchUrls = {};
    return expect(embedify.get(matchUrls))
      .to.be.rejectedWith(InvalidArgumentError);
  });

  it('should return InvalidArgumentError if matchUrls is non-string array', () => {

    const matchUrls = [123, {}];
    return expect(embedify.get(matchUrls))
      .to.be.rejectedWith(InvalidArgumentError);
  });
});
