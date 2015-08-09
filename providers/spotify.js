"use strict";

const provider = require("../lib/provider");

const name = "spotify";
const apiUrl = "https://embed.spotify.com/oembed/";

const regExp = [
    /https?:\/\/open\.spotify\.com\/(.*)\/(.*)/i,
    /https?:\/\/play\.spotify\.com\/(.*)\/(.*)/i,
    /https?:\/\/embed\.spotify\.com\/\?uri=spotify:(.*):(.*)/i,
    /https?:\/\/embed\.spotify\.com\/\?uri=spotify%3A(.*)%3A(.*)/i
];

const transform = function (match) {
    return "https://open.spotify.com/" + match[1] + "/" + match[2];
};

const spotify = provider(name, apiUrl, regExp, transform);

spotify.addTest('https://embed.spotify.com/?uri=spotify:track:4th1RQAelzqgY7wL53UGQt', 'https://open.spotify.com/track/4th1RQAelzqgY7wL53UGQt');
spotify.addTest('https://embed.spotify.com/?uri=spotify%3Atrack%3A4th1RQAelzqgY7wL53UGQt', 'https://open.spotify.com/track/4th1RQAelzqgY7wL53UGQt');
spotify.addTest('https://open.spotify.com/track/4th1RQAelzqgY7wL53UGQt', 'https://open.spotify.com/track/4th1RQAelzqgY7wL53UGQt');
spotify.addTest('https://play.spotify.com/track/4th1RQAelzqgY7wL53UGQt', 'https://open.spotify.com/track/4th1RQAelzqgY7wL53UGQt');
spotify.addTest('http://open.spotify.com/track/4th1RQAelzqgY7wL53UGQt', 'https://open.spotify.com/track/4th1RQAelzqgY7wL53UGQt');
spotify.addTest('http://play.spotify.com/track/4th1RQAelzqgY7wL53UGQt', 'https://open.spotify.com/track/4th1RQAelzqgY7wL53UGQt');

module.exports = spotify;