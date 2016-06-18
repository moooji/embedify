const apiUrl = 'http://soundcloud.com/oembed';

const regExp = [
  /(https?:\/\/(soundcloud.com|snd.sc)\/(.*))/i,
  /https?:\/\/.+\.soundcloud\.com\/player\/\?url=(https?%3A\/\/.+\.soundcloud\.com\/tracks\/.+?)&/i,
];

function transform(match) {
  return match[1].replace('%3A//', '://').replace('http:', 'https:');
}

module.exports = { apiUrl, regExp, transform };
