'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const embedify = require('../index');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('Embedify', () => {
  let oEmbed;

  before(() => {
    oEmbed = embedify.create();
  });

  it('should return TypeError if url is invalid', () => {
    const urls = 123;

    return expect(oEmbed.get(urls))
      .to.be.rejectedWith(TypeError);
  });

  it('should return [] for unknown providers', () => {
    const url = 'https://www.unknown.com/embed/iOf7CsxmFCs';

    return expect(oEmbed.get(url))
      .to.eventually.be.fulfilled
      .then(result => expect(result).to.deep.equal([]));
  });

  it('should ensure list of valid URLs', () => {
    const url = 'https://www.test.com/embed/iOf7CsxmFCs';

    return expect(oEmbed.ensureUrls([url]))
      .to.eventually.be.fulfilled
      .then(result => expect(result).to.deep.equal([url]));
  });

  it('should ensure list of valid URLs from URL', () => {
    const url = 'https://www.test.com/embed/iOf7CsxmFCs';

    return expect(oEmbed.ensureUrls(url))
      .to.eventually.be.fulfilled
      .then(result => expect(result).to.deep.equal([url]));
  });

  it('should be rejected with TypeError for invalid URL', () => {
    const url = 123;

    return expect(oEmbed.ensureUrls(url))
      .to.be.rejectedWith(TypeError);
  });

  /*
  it('should return result if matchUrls is valid string', () => {
    const matchUrls = 'https://www.youtube.com/embed/iOf7CsxmFCs';

    return expect(embedify.get(matchUrls))
      .to.eventually.be.fulfilled
      .then(result => expect(result[0].type).to.equal('video'));
  });

  it('should return result if matchUrls is valid array', () => {
    const matchUrls = [
      'http://www.google.com',
      'https://www.youtube.com/embed/iOf7CsxmFCs',
      'https://www.youtube.com/watch?v=nfWlot6h_JM',
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
        width: 480,
      }];

    return expect(embedify.get(matchUrls))
      .to.eventually.be.fulfilled
      .then((result) => {
        return expect(result).to.deep.equal(expectedResult);
      });
  });

  it('should return result if some matchUrls have provider but throw 404', () => {
    const matchUrls = [
      'http://www.google.com',
      'https://www.youtube.com/embed/iOf7CsxmFCs',
      'https://www.youtube.com/embed/iOf7CsxmFCsWillThrow404',
      'https://www.youtube.com/watch?v=nfWlot6h_JM',
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
        'frameborder="0" allowfullscreen></iframe>',
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
        width: 480,
      }];

    return expect(embedify.get(matchUrls))
      .to.eventually.be.fulfilled
      .then((result) => {
        return expect(result).to.deep.equal(expectedResult);
      });
  });

  it('should return one result for duplicate embedUrls', () => {
    const matchUrls = [
      'https://www.youtube.com/embed/iOf7CsxmFCs',
      'https://www.youtube.com/embed/iOf7CsxmFCs',
      'https://www.youtube.com/watch?v=iOf7CsxmFCs',
    ];

    const expectedResult = [{
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
      'frameborder="0" allowfullscreen></iframe>',
    }];

    return expect(embedify.get(matchUrls))
      .to.eventually.be.fulfilled
      .then((result) => {
        return expect(result).to.deep.equal(expectedResult);
      });
  });
  */
});
