'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const server = require('./server');
const fetch = require('../lib/fetch');
const errors = require('../lib/errors');

const ContentRequestError = errors.ContentRequestError;

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

  it('should return TypeError if website url is not valid', () => {
    const contentUrl = 123;
    return expect(fetch(contentUrl))
      .to.be.rejectedWith(TypeError);
  });

  it('should return ContentRequestError if status code is >400', () => {
    const contentUrl = `${serverUrl}status/404`;
    return expect(fetch(contentUrl))
      .to.be.rejectedWith(ContentRequestError);
  });
});
