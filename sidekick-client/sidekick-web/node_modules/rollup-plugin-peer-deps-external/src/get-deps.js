const { resolve } = require('path');

export default function getDeps(
  path = resolve(process.cwd(), 'package.json'),
  type = 'peerDependencies'
) {
  try {
    const pkg = require(path);
    return Object.keys(pkg[type]);
  } catch (err) {
    return [];
  }
}
