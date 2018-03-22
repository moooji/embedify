'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const embedify = require('../index');

const expect = chai.expect;
chai.use(chaiAsPromised);

// Mock client
function MockClient(apiUrl, matchUrl) {
  this.apiUrl = apiUrl;
  this.matchUrl = matchUrl;
}

MockClient.prototype.get = function get(apiUrl, options) {
  return Promise.resolve()
    .then(() => {
      if (apiUrl !== this.apiUrl || options.params.url !== this.matchUrl) {
        throw new Error();
      }

      return { data: {} };
    });
};

describe('Spotify provider', () => {
  const apiUrl = 'https://embed.spotify.com/oembed/';
  const matchUrl = 'https://open.spotify.com/track/4th1RQAelzqgY7wL53UGQt';
  const client = new MockClient(apiUrl, matchUrl);
  const oEmbed = embedify.create({ client });

  it('should match URL 1', () => {
    const url = 'https://embed.spotify.com/?uri=spotify:track:4th1RQAelzqgY7wL53UGQt';

    return expect(oEmbed.get(url))
      .to.be.eventually.fulfilled;
  });

  it('should match URL 2', () => {
    const url = 'https://embed.spotify.com/?uri=spotify%3Atrack%3A4th1RQAelzqgY7wL53UGQt';

    return expect(oEmbed.get(url))
      .to.be.eventually.fulfilled;
  });

  it('should match URL 3', () => {
    const url = 'https://open.spotify.com/track/4th1RQAelzqgY7wL53UGQt';

    return expect(oEmbed.get(url))
      .to.be.eventually.fulfilled;
  });

  it('should match URL 4', () => {
    const url = 'https://play.spotify.com/track/4th1RQAelzqgY7wL53UGQt';

    return expect(oEmbed.get(url))
      .to.be.eventually.fulfilled;
  });

  it('should match URL 5', () => {
    const url = 'http://open.spotify.com/track/4th1RQAelzqgY7wL53UGQt';

    return expect(oEmbed.get(url))
      .to.be.eventually.fulfilled;
  });

  it('should match URL 6', () => {
    const url = 'http://play.spotify.com/track/4th1RQAelzqgY7wL53UGQt';

    return expect(oEmbed.get(url))
      .to.be.eventually.fulfilled;
  });
});


describe('Soundcloud provider 1', () => {
  const apiUrl = 'http://soundcloud.com/oembed';
  const matchUrl = 'https://api.soundcloud.com/tracks/217027580';
  const client = new MockClient(apiUrl, matchUrl);
  const oEmbed = embedify.create({ client });

  it('should match URL 1', () => {
    const url = 'https://w.soundcloud.com/player/?url=' +
      'https%3A//api.soundcloud.com/tracks/217027580&auto_play=false&hide_related=false' +
      '&show_comments=true&show_user=true&show_reposts=false&visual=true';

    return expect(oEmbed.get(url))
      .to.be.eventually.fulfilled;
  });
});

describe('Soundcloud provider 2', () => {
  const apiUrl = 'http://soundcloud.com/oembed';
  const matchUrl = 'https://soundcloud.com/zedsdead/zeds-dead-twin-shadow-lost';
  const client = new MockClient(apiUrl, matchUrl);
  const oEmbed = embedify.create({ client });

  it('should match URL 1', () => {
    const url = 'https://soundcloud.com/zedsdead/zeds-dead-twin-shadow-lost';

    return expect(oEmbed.get(url))
      .to.be.eventually.fulfilled;
  });

  it('should match URL 2', () => {
    const url = 'http://soundcloud.com/zedsdead/zeds-dead-twin-shadow-lost';

    return expect(oEmbed.get(url))
      .to.be.eventually.fulfilled;
  });
});

describe('Vimeo', () => {
  const apiUrl = 'https://vimeo.com/api/oembed.json';
  const matchUrl = 'https://www.vimeo.com/132252780';
  const client = new MockClient(apiUrl, matchUrl);
  const oEmbed = embedify.create({ client });

  it('should match URL 1', () => {
    const url = 'https://player.vimeo.com/video/132252780';

    return expect(oEmbed.get(url))
      .to.be.eventually.fulfilled;
  });

  it('should match URL 2', () => {
    const url = 'https://www.vimeo.com/video/132252780';

    return expect(oEmbed.get(url))
      .to.be.eventually.fulfilled;
  });
});

describe('Youtube', () => {
  const apiUrl = 'http://www.youtube.com/oembed';
  const matchUrl = 'https://www.youtube.com/watch?v=iOf7CsxmFCs';
  const client = new MockClient(apiUrl, matchUrl);
  const oEmbed = embedify.create({ client });

  it('should match URL 1', () => {
    const url = 'https://www.youtube.com/embed/iOf7CsxmFCs';

    return expect(oEmbed.get(url))
      .to.be.eventually.fulfilled;
  });

  it('should match URL 2', () => {
    const url = 'https://www.youtube.com/watch?v=iOf7CsxmFCs';

    return expect(oEmbed.get(url))
      .to.be.eventually.fulfilled;
  });

  it('should match URL 3', () => {
    const url = 'https://youtu.be/iOf7CsxmFCs';

    return expect(oEmbed.get(url))
      .to.be.eventually.fulfilled;
  });
});

describe("Mixcloud", () => {
  const apiUrl = "https://www.mixcloud.com/oembed";
  const matchUrl =
    "https://www.mixcloud.com/plxplxplx/plx-live-09-77-2017-no-advice-sssichtbeton";
  const client = new MockClient(apiUrl, matchUrl);
  const oEmbed = embedify.create({ client });

  it("should match URL 1", () => {
    const url =
      "https://www.mixcloud.com/plxplxplx/plx-live-09-77-2017-no-advice-sssichtbeton";

    return expect(oEmbed.get(url)).to.be.eventually.fulfilled;
  });

  it("should match URL 2", () => {
    const url =
      "https://www.mixcloud.com/widget/iframe/?hide_cover=1&feed=https://www.mixcloud.com/plxplxplx/plx-live-09-77-2017-no-advice-sssichtbeton";

    return expect(oEmbed.get(url)).to.be.eventually.fulfilled;
  });
});
