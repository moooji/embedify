'use strict';

const createError = require('custom-error-generator');

const ApiRequestError = createError('ApiRequestError');
const UrlMatchError = createError('UrlMatchError');

module.exports = {
  ApiRequestError,
  UrlMatchError,
};
