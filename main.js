"use strict";

const fs = require("fs");
const Promise = require("bluebird");
const _ = require("lodash");

const createError = require("custom-error-generator");
const InvalidArgumentError = createError('InvalidArgumentError');
const plugins = requirePlugins();

/**
 * Get the oEmbed information for a URL
 * @param {String} url
 * @param {Function} [callback]
 * @returns {Promise}
 */
function get(url, callback) {

    return Promise.resolve(url)
        .nodeify(callback);
}

/**
 * Requires all plugins in the plugin directory
 * @returns {Array}
 */
function requirePlugins() {

    let plugins = [];
    const pluginDir = "./plugins";
    const pluginFiles = fs.readdirSync(pluginDir);

    for (let pluginFile of pluginFiles) {
        const pluginPath = pluginDir + "/" + pluginFile;
        plugins.push(require(pluginPath));
    }

    return plugins;
}

/**
 * Getter for plugins
 * @returns {Array}
 */
function getPlugins() {
    return plugins;
}

// Public
module.exports.get = get;
module.exports.plugins = getPlugins();

// Errors
module.exports.InvalidArgumentError = InvalidArgumentError;