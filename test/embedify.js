'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const embedify = require('../index');

const expect = chai.expect;
chai.use(chaiAsPromised);

const rawData = {
  type: 'video',
  thumbnail_width: 480,
  thumbnail_height: 360,
  provider_name: 'YouTube',
  title: '☼ Min sommer road trip | Del 1 ☼',
  provider_url: 'https://www.youtube.com/',
  version: '1.0',
  author_name: 'Amanda MIDK',
  height: 270,
  author_url: 'https://www.youtube.com/user/AmandaS4G',
  html: '<iframe width="480" height="270" src="https://www.youtube.com/embed/iOf7CsxmFCs?feature=oembed" frameborder="0" allowfullscreen></iframe>',
  width: 480,
  thumbnail_url: 'https://i.ytimg.com/vi/iOf7CsxmFCs/hqdefault.jpg',
};

const parsedData = {
  type: 'video',
  thumbnailWidth: 480,
  thumbnailHeight: 360,
  providerName: 'YouTube',
  title: '☼ Min sommer road trip | Del 1 ☼',
  providerUrl: 'https://www.youtube.com/',
  version: '1.0',
  authorName: 'Amanda MIDK',
  height: 270,
  authorUrl: 'https://www.youtube.com/user/AmandaS4G',
  html: '<iframe width="480" height="270" src="https://www.youtube.com/embed/iOf7CsxmFCs?feature=oembed" frameborder="0" allowfullscreen></iframe>',
  width: 480,
  thumbnailUrl: 'https://i.ytimg.com/vi/iOf7CsxmFCs/hqdefault.jpg',
};

// Mock client
function MockClient(body) {
  this.body = body;
}

MockClient.prototype.get = function fetch() {
  return Promise.resolve()
    .then(() => {
      return { data: this.body };
    });
};

describe('Embedify', () => {
  const oEmbed = embedify.create();

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
});

describe('Embedify - Parse oEmbed', () => {
  const client = new MockClient(rawData);
  const url = 'https://play.spotify.com/track/4th1RQAelzqgY7wL53UGQt';

  it('should return raw oEmbed', () => {
    const oEmbed = embedify.create({ client, parse: false });

    return expect(oEmbed.get(url))
      .to.be.eventually.fulfilled
      .then(res => expect(res).to.deep.equal([rawData]));
  });

  it('should return parsed oEmbed', () => {
    const oEmbed = embedify.create({ client, parse: true });

    return expect(oEmbed.get(url))
      .to.be.eventually.fulfilled
      .then(res => expect(res).to.deep.equal([parsedData]));
  });
});
