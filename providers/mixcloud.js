const apiUrl = 'https://www.mixcloud.com/oembed';

const regExp = [
  /https?:\/\/(?:www\.)?mixcloud\.com\/.+feed=(.*)/i,
  /(https?:\/\/((?:www\.)?mixcloud\.com\/(.*)))/i,
];

function transform(match) {
  return match[1].replace('%3A//', '://').replace('http:', 'https:');
}

module.exports = { apiUrl, regExp, transform };
