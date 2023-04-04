'use strict';

const fg = require('fast-glob');
const fs = require('fs');
const postcss = require('postcss');
const removeDuplicatesFromArray = require('./removeDuplicatesFromArray');

let previousGlobsResults = [];
let lastUpdate = null;
let classnamesFromFiles = [];

/**
 * Read CSS files and extract classnames
 * @param {Array} patterns Glob patterns to locate files
 * @param {Number} refreshRate Interval
 * @returns {Array} List of classnames
 */
const generateClassnamesListSync = (patterns, refreshRate = 5_000) => {
  const now = new Date().getTime();
  const files = fg.sync(patterns);
  const newGlobs = previousGlobsResults.flat().join(',') != files.flat().join(',');
  const expired = lastUpdate === null || now - lastUpdate > refreshRate;
  if (newGlobs || expired) {
    previousGlobsResults = files;
    lastUpdate = now;
    let detectedClassnames = [];
    for (const file of files) {
      const data = fs.readFileSync(file, 'utf-8');
      const root = postcss.parse(data);
      root.walkRules((rule) => {
        const regexp = /\.([^\.\,\s\n\:\(\)\[\]\'~\+\>\*\\]*)/gim;
        const matches = [...rule.selector.matchAll(regexp)];
        const classnames = matches.map((arr) => arr[1]);
        detectedClassnames.push(...classnames);
      });
      detectedClassnames = removeDuplicatesFromArray(detectedClassnames);
    }
    classnamesFromFiles = detectedClassnames;
  }
  return classnamesFromFiles;
};

module.exports = generateClassnamesListSync;
