const apiUrl = 'http://www.youtube.com/oembed';

const regExp = [
  /https?:\/\/(?:www\.)?youtube\.com\/(?:tv#\/)?watch\?(?:[^&]+&)*v=([a-zA-Z0-9_-]+)/i,
  /https?:\/\/youtu.be\/([a-zA-Z0-9_-]+)/i,
  /https?:\/\/m\.youtube\.com\/#\/watch\?(?:[^&]+&)*v=([a-zA-Z0-9_-]+)/i,
  /https?:\/\/www\.youtube\.com\/embed\/([a-zA-Z0-9_-]+)/i,
  /https?:\/\/www\.youtube\.com\/v\/([a-zA-Z0-9_-]+)/i,
  /https?:\/\/www\.youtube\.com\/user\/[a-zA-Z0-9_-]+\?v=([a-zA-Z0-9_-]+)/i,
  /https?:\/\/www\.youtube-nocookie\.com\/v\/([a-zA-Z0-9_-]+)/i,
];

function transform(match) {
  return `https://www.youtube.com/watch?v=${match[1]}`;
}

module.exports = { apiUrl, regExp, transform };
