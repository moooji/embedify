const apiUrl = 'https://vimeo.com/api/oembed.json';

const regExp = [
  /https?:\/\/(?:www\.)?vimeo\.com\/\w*\/*(([a-z]{0,2}-)?\d+)/i,
  /https?:\/\/(?:player\.)?vimeo\.com\/\w*\/*(([a-z]{0,2}-)?\d+)/i,
];

function transform(match) {
  return `https://www.vimeo.com/${match[1]}`;
}

module.exports = { apiUrl, regExp, transform };
