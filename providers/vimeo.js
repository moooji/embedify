"use strict";

function provider() {

    const url = "https://vimeo.com/api/oembed.json?url=";

    const regExp = [
        /https?:\/\/(?:www\.)?vimeo\.com\/(\w*\/)*(([a-z]{0,2}-)?\d+)/i,
        /https?:\/\/(?:player\.)?vimeo\.com\/(\w*\/)*(([a-z]{0,2}-)?\d+)/i
    ];

    const expectedResult = {
        description: "Hvis I har problemer med at se videoen, s\u00e5 pr\u00f8v at se den her: http://madeindk.dk/2015/07/video-min-sommer-road-trip-del-1/ \u273f Navn: Amanda \u273f Alder: 18 \u273f Blog: http://madeindk.dk \u273f Instagram: amandamidk \u273f Email: amandas4g@hotmail.dk \u273f Facebookside: https://www.facebook.com/pages/madeindkdk/337219669644457?ref=hl&ref_type=bookmark",
        title: "\u263c Min sommer road trip | Del 1 \u263c",
        url: "http://www.youtube.com/watch?v=iOf7CsxmFCs",
        type: "video",
        version: "1.0",
        author_name: "Amanda MIDK",
        height: 281,
        width: 500,
        thumbnail_url: "https://i.ytimg.com/vi/iOf7CsxmFCs/hqdefault.jpg"
    };

    const tests = [
        {
            url: 'https://player.vimeo.com/video/132252780',
            get: expectedResult,
            match: true
        },
        {
            url: 'https://www.vimeo.com/video/132252780',
            get: expectedResult,
            match: true
        },
        {
            url: 'https://youtu.be/iOf7CsxmFCs',
            get: null,
            match: false
        }];

    return {
        url: url,
        regExp: regExp,
        tests: tests
    }
}

module.exports = provider();