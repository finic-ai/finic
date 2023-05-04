var reportWebVitals = function (onPerfEntry) {
    if (onPerfEntry && onPerfEntry instanceof Function) {
        import('web-vitals').then(function (_a) {
            var getCLS = _a.getCLS, getFID = _a.getFID, getFCP = _a.getFCP, getLCP = _a.getLCP, getTTFB = _a.getTTFB;
            getCLS(onPerfEntry);
            getFID(onPerfEntry);
            getFCP(onPerfEntry);
            getLCP(onPerfEntry);
            getTTFB(onPerfEntry);
        });
    }
};
export default reportWebVitals;
