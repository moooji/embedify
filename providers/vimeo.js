"use strict";

const provider = require("../lib/provider");

const apiUrl = "https://vimeo.com/api/oembed.json";

const regExp = [
    /https?:\/\/(?:www\.)?vimeo\.com\/\w*\/*(([a-z]{0,2}-)?\d+)/i,
    /https?:\/\/(?:player\.)?vimeo\.com\/\w*\/*(([a-z]{0,2}-)?\d+)/i
];

const transform = function (match) {
    return "https://www.vimeo.com/" + match[1];
};

const vimeo = provider(apiUrl, regExp, transform);

vimeo.addTest('https://player.vimeo.com/video/132252780', true);
vimeo.addTest('https://www.vimeo.com/video/132252780', true);
vimeo.addTest('https://youtu.be/iOf7CsxmFCs', false);

module.exports = vimeo;