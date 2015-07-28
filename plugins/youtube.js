"use strict";

const _ = require("lodash");

const name = "youtube";
const regExp = [
    /https?:\/\/(?:www\.)?youtube\.com\/(?:tv#\/)?watch\?(?:[^&]+&)*v=([a-zA-Z0-9_-]+)/i,
    /https?:\/\/youtu.be\/([a-zA-Z0-9_-]+)/i,
    /https?:\/\/m\.youtube\.com\/#\/watch\?(?:[^&]+&)*v=([a-zA-Z0-9_-]+)/i,
    /https?:\/\/www\.youtube\.com\/embed\/([a-zA-Z0-9_-]+)/i,
    /https?:\/\/www\.youtube\.com\/v\/([a-zA-Z0-9_-]+)/i,
    /https?:\/\/www\.youtube\.com\/user\/[a-zA-Z0-9_-]+\?v=([a-zA-Z0-9_-]+)/i,
    /https?:\/\/www\.youtube-nocookie\.com\/v\/([a-zA-Z0-9_-]+)/i
];

function get(url) {

    // Iterate through all regExp
    // and match against "a" href
    for (let re of regExp) {

        const match = url.match(re);

        if (match && match.length) {
            //--
        }
    }

    return result;
}

const tests = [
    {
        content: '<iframe src="https://player.vimeo.com/video/132252780" width="600" height="338" frameborder="0" title="We Are Royale - Manifesto"></iframe>',
        result: [{ id: "132252780", url: "https://player.vimeo.com/video/132252780"}]
    },
    {
        content: '<a href="https://player.vimeo.com/video/132252780">Video</a>',
        result: [{ id: "132252780", url: "https://player.vimeo.com/video/132252780"}]
    },
    {
        content: '<a href="https://player.vimeo.com/video/132252780">Video</a><a href="https://player.vimeo.com/video/132252781">Video</a>',
        result: [
            {
                id: "132252780",
                url: "https://player.vimeo.com/video/132252780"
            },
            {
                id: "132252781",
                url: "https://player.vimeo.com/video/132252781"
            }]
    },
    {
        content: '<a href="https://player.vimeo.com/video/132252780">Video</a><a href="https://www.vimeo.com/video/132252780">Video</a>',
        result: [
            {
                id: "132252780",
                url: "https://player.vimeo.com/video/132252780"
            },
            {
                id: "132252780",
                url: "https://www.vimeo.com/video/132252780"
            }]
    }
];

module.exports.name = name;
module.exports.get = get;
module.exports.tests = tests;