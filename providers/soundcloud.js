"use strict";

const provider = require("../lib/provider");

const name = "soundcloud";
const apiUrl = "http://soundcloud.com/oembed";

const regExp = [
    /(https?:\/\/(soundcloud.com|snd.sc)\/(.*))/i,
    /https?:\/\/.+\.soundcloud\.com\/player\/\?url=(https?%3A\/\/.+\.soundcloud\.com\/tracks\/.+?)&/i
];

const transform = function (match) {

    let result = match[1];
    result = result.replace("%3A//", "://");
    console.log
    return result;
};

const soundcloud = provider(name, apiUrl, regExp, transform);

soundcloud.addTest('https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/217027580&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&visual=true',
    'https://api.soundcloud.com/tracks/217027580');
soundcloud.addTest('https://soundcloud.com/zedsdead/zeds-dead-twin-shadow-lost-you-feat-dangelo-lacy',
    'https://soundcloud.com/zedsdead/zeds-dead-twin-shadow-lost-you-feat-dangelo-lacy');
soundcloud.addTest('http://soundcloud.com/zedsdead/zeds-dead-twin-shadow-lost-you-feat-dangelo-lacy',
    'http://soundcloud.com/zedsdead/zeds-dead-twin-shadow-lost-you-feat-dangelo-lacy');

module.exports = soundcloud;