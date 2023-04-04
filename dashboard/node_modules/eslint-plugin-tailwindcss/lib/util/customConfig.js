'use strict';

const fs = require('fs');
const path = require('path');
const resolveConfig = require('tailwindcss/resolveConfig');

const CHECK_REFRESH_RATE = 1_000;
let previousConfig = null;
let lastCheck = null;
let mergedConfig = null;
let lastModifiedDate = null;

/**
 * @see https://stackoverflow.com/questions/9210542/node-js-require-cache-possible-to-invalidate
 * @param {string} module The path to the module
 * @returns the module's export
 */
function requireUncached(module) {
  delete require.cache[require.resolve(module)];
  return require(module);
}

function loadConfig(config) {
  let loadedConfig = null;
  if (typeof config === 'string') {
    const resolvedPath = path.isAbsolute(config) ? config : path.join(path.resolve(), config);
    try {
      const stats = fs.statSync(resolvedPath);
      if (stats === null) {
        loadedConfig = {};
      } else if (lastModifiedDate !== stats.mtime) {
        lastModifiedDate = stats.mtime;
        loadedConfig = requireUncached(resolvedPath);
      } else {
        loadedConfig = null;
      }
    } catch (err) {
      loadedConfig = {};
    } finally {
      return loadedConfig;
    }
  } else {
    if (typeof config === 'object' && config !== null) {
      return config;
    }
    return {};
  }
}

function convertConfigToString(config) {
  switch (typeof config) {
    case 'string':
      return config;
    case 'object':
      return JSON.stringify(config);
    default:
      return config.toString();
  }
}

function resolve(twConfig) {
  const now = new Date().getTime();
  const newConfig = convertConfigToString(twConfig) !== convertConfigToString(previousConfig);
  const expired = now - lastCheck > CHECK_REFRESH_RATE;
  if (newConfig || expired) {
    previousConfig = twConfig;
    lastCheck = now;
    const userConfig = loadConfig(twConfig);
    // userConfig is null when config file was not modified
    if (userConfig !== null) {
      mergedConfig = resolveConfig(userConfig);
    }
  }
  return mergedConfig;
}

module.exports = {
  resolve,
};
