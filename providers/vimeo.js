'use strict';

const provider = require('../lib/provider');

const pluginName = 'vimeo';
const apiUrl = 'https://vimeo.com/api/oembed.json';

const regExp = [
  /https?:\/\/(?:www\.)?vimeo\.com\/\w*\/*(([a-z]{0,2}-)?\d+)/i,
  /https?:\/\/(?:player\.)?vimeo\.com\/\w*\/*(([a-z]{0,2}-)?\d+)/i,
];

function transform(match) {
  return `https://www.vimeo.com/${match[1]}`;
}

const vimeo = provider(pluginName, apiUrl, regExp, transform);

vimeo.addTest('https://player.vimeo.com/video/132252780', 'https://www.vimeo.com/132252780');
vimeo.addTest('https://www.vimeo.com/video/132252780', 'https://www.vimeo.com/132252780');
vimeo.addTest('https://youtu.be/iOf7CsxmFCs', null);

module.exports = vimeo;
