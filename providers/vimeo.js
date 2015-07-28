"use strict";

const provider = require("../lib/provider");

const name = "vimeo";
const apiUrl = "https://vimeo.com/api/oembed.json";

const regExp = [
    /https?:\/\/(?:www\.)?vimeo\.com\/\w*\/*(([a-z]{0,2}-)?\d+)/i,
    /https?:\/\/(?:player\.)?vimeo\.com\/\w*\/*(([a-z]{0,2}-)?\d+)/i
];

const tests = [
    {
        url: 'https://player.vimeo.com/video/132252780',
        match: true
    },
    {
        url: 'https://www.vimeo.com/video/132252780',
        match: true
    },
    {
        url: 'https://youtu.be/iOf7CsxmFCs',
        match: false
    }];

function transform(match) {
    return "https://www.vimeo.com/" + match[1];
}

module.exports = provider(name, apiUrl, regExp, tests, { transform: transform });