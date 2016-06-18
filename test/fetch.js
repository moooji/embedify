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
  let oEmbed;

  before(() => {
    app = server(serverPort);
    oEmbed = embedify.create();
  });

  after(() => app.close());

  it('should be rejected with ContentRequestError if status code is >400', () => {
    const url = `${serverUrl}status/404`;

    return expect(oEmbed.fetch(url))
      .to.be.rejectedWith(oEmbed.ContentRequestError);
  });
});
