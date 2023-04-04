var fs = require('fs');

// Check if asset exists
function checkForAsset(path) {
  var pathFound = true;
  try {
    fs.accessSync(path);
  } catch (e) {
    pathFound = false;
  }
  return pathFound;
}

// Check for default files
for (let extension of ['.js', '.min.js', '.css', '.min.css']) {
  test('Asset svgMap' + extension + ' exists', () => {
    expect(checkForAsset('./dist/svgMap' + extension)).toBe(true);
  });
}
