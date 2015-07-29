"use strict";

const _ = require("lodash");
const provider = require("../lib/provider");

const apiUrl = "http://www.youtube.com/oembed";

const regExp = [
    /https?:\/\/(?:www\.)?youtube\.com\/(?:tv#\/)?watch\?(?:[^&]+&)*v=([a-zA-Z0-9_-]+)/i,
    /https?:\/\/youtu.be\/([a-zA-Z0-9_-]+)/i,
    /https?:\/\/m\.youtube\.com\/#\/watch\?(?:[^&]+&)*v=([a-zA-Z0-9_-]+)/i,
    /https?:\/\/www\.youtube\.com\/embed\/([a-zA-Z0-9_-]+)/i,
    /https?:\/\/www\.youtube\.com\/v\/([a-zA-Z0-9_-]+)/i,
    /https?:\/\/www\.youtube\.com\/user\/[a-zA-Z0-9_-]+\?v=([a-zA-Z0-9_-]+)/i,
    /https?:\/\/www\.youtube-nocookie\.com\/v\/([a-zA-Z0-9_-]+)/i
];

const transform = function (match) {
    return "https://www.youtube.com/watch?v=" + match[1];
};

const youtube = provider(apiUrl, regExp, transform);

youtube.addTest('https://www.youtube.com/embed/iOf7CsxmFCs', "https://www.youtube.com/watch?v=iOf7CsxmFCs");
youtube.addTest('https://www.youtube.com/watch?v=iOf7CsxmFCs', "https://www.youtube.com/watch?v=iOf7CsxmFCs");
youtube.addTest('https://youtu.be/iOf7CsxmFCs', "https://www.youtube.com/watch?v=iOf7CsxmFCs");
youtube.addTest('https://player.vimeo.com/video/132252780', null);

module.exports = youtube;