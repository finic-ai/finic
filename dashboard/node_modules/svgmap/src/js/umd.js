(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['svg-pan-zoom'], function (svgPanZoom) {
      return (root.svgMap = factory(svgPanZoom));
    });
  } else if (typeof module === 'object' && module.exports) {
    module.exports = root.svgMap = factory(require('svg-pan-zoom'));
  } else {
    root.svgMap = factory(root.svgPanZoom);
  }
})(this, function (svgPanZoom) {
  var svgMap = svgMapWrapper(svgPanZoom);
  return svgMap;
});
