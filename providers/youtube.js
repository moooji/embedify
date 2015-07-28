"use strict";

const _ = require("lodash");
const provider = require("../lib/provider");

const name = "youtube";
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

const tests = [
    {
        url: 'https://www.youtube.com/embed/iOf7CsxmFCs',
        match: true
    },
    {
        url: 'https://www.youtube.com/watch?v=iOf7CsxmFCs',
        match: true
    },
    {
        url: 'https://youtu.be/iOf7CsxmFCs',
        match: true
    },
    {
        url: 'https://player.vimeo.com/video/132252780',
        match: false
    }];

function transform(match) {
    return "https://www.youtube.com/watch?v=" + match[1];
}

module.exports = provider(name, apiUrl, regExp, tests, { transform: transform });