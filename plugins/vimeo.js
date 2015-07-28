"use strict";

const _ = require("lodash");

const name = "vimeo";

function get(url) {

    const regExp = [
        /https?:\/\/(?:www\.)?vimeo\.com\/(\w*\/)*(([a-z]{0,2}-)?\d+)/i,
        /https?:\/\/(?:player\.)?vimeo\.com\/(\w*\/)*(([a-z]{0,2}-)?\d+)/i
    ];

    // Iterate through all regExp
    // and match against "a" href
    for (let re of regExp) {

        const match = url.match(re);

        if (match && match.length) {
            vimeo.push({
                id: match[2],
                url: match[0]
            });
        }
    }

    return result;
}

const tests = [
    {
        url: '<iframe src="https://player.vimeo.com/video/132252780" width="600" height="338" frameborder="0" title="We Are Royale - Manifesto"></iframe>',
        result: [{ id: "132252780", url: "https://player.vimeo.com/video/132252780"}]
    },
    {
        url: '<a href="https://player.vimeo.com/video/132252780">Video</a>',
        result: [{ id: "132252780", url: "https://player.vimeo.com/video/132252780"}]
    },
    {
        url: '<a href="https://player.vimeo.com/video/132252780">Video</a><a href="https://player.vimeo.com/video/132252781">Video</a>',
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
        url: '<a href="https://player.vimeo.com/video/132252780">Video</a><a href="https://www.vimeo.com/video/132252780">Video</a>',
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