"use strict";

function provider() {

    const url = "http://www.youtube.com/oembed?url=http%3A//youtube.com/watch%3Fv%3DM3r2XDceM6A&format=json";

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
            url: 'https://www.youtube.com/embed/iOf7CsxmFCs',
            get: expectedResult,
            match: true
        },
        {
            url: 'https://www.youtube.com/watch?v=iOf7CsxmFCs',
            get: expectedResult,
            match: true
        },
        {
            url: 'https://youtu.be/iOf7CsxmFCs',
            get: expectedResult,
            match: true
        },
        {
            url: 'https://player.vimeo.com/video/132252780',
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