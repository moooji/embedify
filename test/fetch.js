'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const embedify = require('../index');
const server = require('./server');

const serverPort = 3200;
const serverUrl = `http://127.0.0.1:${serverPort}/`;

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('Fetch', () => {
  let app;

  before(() => {
    app = server(serverPort);
  });

  after(() => app.close());

  it('should return null if status is 404 and failSoft -> true', () => {
    const url = `${serverUrl}status/404`;
    const oEmbed = embedify.create({ failSoft: true });

    return expect(oEmbed.fetch(url))
      .to.be.eventually.fulfilled
      .then(res => expect(res).to.deep.equal(null));
  });

  it('should be rejected with ProviderRequestError if status is 404 and failSoft -> false', () => {
    const url = `${serverUrl}status/404`;
    const oEmbed = embedify.create({ failSoft: false });

    return expect(oEmbed.fetch(url))
      .to.be.rejectedWith(oEmbed.ProviderRequestError);
  });

  it('should be rejected with ProviderRequestError if status is 500 and failSoft -> true', () => {
    const url = `${serverUrl}status/500`;
    const oEmbed = embedify.create({ failSoft: true });

    return expect(oEmbed.fetch(url))
      .to.be.rejectedWith(oEmbed.ProviderRequestError);
  });

  it('should be rejected with ProviderRequestError if status is 500 and failSoft -> false', () => {
    const url = `${serverUrl}status/500`;
    const oEmbed = embedify.create({ failSoft: false });

    return expect(oEmbed.fetch(url))
      .to.be.rejectedWith(oEmbed.ProviderRequestError);
  });
});
