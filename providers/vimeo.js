"use strict";

const provider = require("../lib/provider");

const name = "vimeo";
const apiUrl = "https://vimeo.com/api/oembed.json";

const regExp = [
    /https?:\/\/(?:www\.)?vimeo\.com\/\w*\/*(([a-z]{0,2}-)?\d+)/i,
    /https?:\/\/(?:player\.)?vimeo\.com\/\w*\/*(([a-z]{0,2}-)?\d+)/i
];

const expectedResult = {
    author_name: "We Are Royale",
    author_url: "https://vimeo.com/weareroyale",
    description: "We are a design company.\nA creative production company.\nA digital production company.\nWe are here to help connect people to the brands they love. \nWe focus on the idea, and let design lead the technique. \nWe are a group of diverse artists.\nWe’re lead by our common love for creative problem solving...\nAnd compulsive late night archery.\nWe’re kind of like Voltron.\nWe work as a team, slaying creative problems with our mech-tiger swords.\nWe can do a lot of things.\nNot all of them involving swords.\nBut above all, we’re here to help.\nAnd make sure we all have fun while we’re at it.\nWe do what we do.\nBecause we love what we do.\n\nThank-you EchoLab for providing an AMAZING soundtrack. http://www.echolab.tv",
    duration: 92,
    width: 1920,
    height: 1080,
    html: "<iframe src=\"https://player.vimeo.com/video/132252780\" width=\"1920\" height=\"1080\" frameborder=\"0\" title=\"We Are Royale - Manifesto\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>",
    is_plus: "0",
    provider_name: "Vimeo",
    provider_url: "https://vimeo.com/",
    thumbnail_height: 720,
    thumbnail_url: "https://i.vimeocdn.com/video/525977663_1280.jpg",
    thumbnail_width: 1280,
    title: "We Are Royale - Manifesto",
    type: "video",
    uri: "/videos/132252780",
    version: "1.0",
    video_id: 132252780
};

const tests = [
    {
        url: 'https://player.vimeo.com/video/132252780',
        result: expectedResult,
        match: true
    },
    {
        url: 'https://www.vimeo.com/video/132252780',
        result: expectedResult,
        match: true
    },
    {
        url: 'https://youtu.be/iOf7CsxmFCs',
        result: null,
        match: false
    }];

function transform(match) {
    return "https://www.vimeo.com/" + match[1];
}

module.exports = provider(name, apiUrl, regExp, tests, { transform: transform });