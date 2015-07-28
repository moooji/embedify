"use strict";

function provider() {

    const url = "https://vimeo.com/api/oembed.json?url=";

    const regExp = [
        /https?:\/\/(?:www\.)?vimeo\.com\/(\w*\/)*(([a-z]{0,2}-)?\d+)/i,
        /https?:\/\/(?:player\.)?vimeo\.com\/(\w*\/)*(([a-z]{0,2}-)?\d+)/i
    ];

    const tests = [
        {
            url: 'https://player.vimeo.com/video/132252780',
            get: {},
            match: true
        },
        {
            url: 'https://www.vimeo.com/video/132252780',
            get: {},
            match: true
        }];

    return {
        url: url,
        regExp: regExp,
        tests: tests
    }
}

module.exports = provider();