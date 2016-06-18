const createError = require('custom-error-generator');
const ContentRequestError = createError('ContentRequestError');

module.exports = { ContentRequestError };
