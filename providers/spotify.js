const apiUrl = 'https://embed.spotify.com/oembed/';

const regExp = [
  /https?:\/\/open\.spotify\.com\/(.*)\/(.*)/i,
  /https?:\/\/play\.spotify\.com\/(.*)\/(.*)/i,
  /https?:\/\/embed\.spotify\.com\/\?uri=spotify:(.*):(.*)/i,
  /https?:\/\/embed\.spotify\.com\/\?uri=spotify%3A(.*)%3A(.*)/i,
];

function transform(match) {
  return `https://open.spotify.com/${match[1]}/${match[2]}`;
}

module.exports = { apiUrl, regExp, transform };
