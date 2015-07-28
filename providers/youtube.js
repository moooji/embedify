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

const expectedResult = {
    title: "\u263c Min sommer road trip | Del 1 \u263c",
    html: "<iframe width=\"480\" height=\"270\" src=\"https://www.youtube.com/embed/iOf7CsxmFCs?feature=oembed\" frameborder=\"0\" allowfullscreen></iframe>",
    provider_name: "YouTube",
    provider_url: "https://www.youtube.com/",
    type: "video",
    version: "1.0",
    author_name: "Amanda MIDK",
    author_url: "https://www.youtube.com/user/AmandaS4G",
    height: 270,
    width: 480,
    thumbnail_height: 360,
    thumbnail_width: 480,
    thumbnail_url: "https://i.ytimg.com/vi/iOf7CsxmFCs/hqdefault.jpg"
};

const tests = [
    {
        url: 'https://www.youtube.com/embed/iOf7CsxmFCs',
        result: expectedResult,
        match: true
    },
    {
        url: 'https://www.youtube.com/watch?v=iOf7CsxmFCs',
        result: expectedResult,
        match: true
    },
    {
        url: 'https://youtu.be/iOf7CsxmFCs',
        result: expectedResult,
        match: true
    },
    {
        url: 'https://player.vimeo.com/video/132252780',
        result: null,
        match: false
    }];

function transform(match) {
    return "https://www.youtube.com/watch?v=" + match[1];
}

module.exports = provider(name, apiUrl, regExp, tests, { transform: transform });