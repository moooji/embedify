'use strict';

const createError = require('custom-error-generator');

const InvalidArgumentError = createError('InvalidArgumentError');
const ApiRequestError = createError('ApiRequestError');
const UrlMatchError = createError('UrlMatchError');

module.exports = {
  InvalidArgumentError: InvalidArgumentError,
  ApiRequestError: ApiRequestError,
  UrlMatchError: UrlMatchError
};
