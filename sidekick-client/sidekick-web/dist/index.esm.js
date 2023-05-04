import { useState, useRef, useEffect } from 'react';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function useSidekickAuth(public_key, sidekick_url) {
    var _a = useState(false), authorized = _a[0], setAuthorized = _a[1];
    var _b = useState(false), loading = _b[0], setLoading = _b[1];
    var _c = useState(null), newConnection = _c[0], setNewConnection = _c[1];
    var _d = useState(null), error = _d[0], setError = _d[1];
    var windowObjectReference = null;
    var authCodeHandled = useRef(false);
    var connectorId = useRef("");
    var connectionId = useRef("");
    function authorize(connector_id, connection_id) {
        return __awaiter(this, void 0, void 0, function () {
            var authorizeResult, url, strWindowFeatures;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setLoading(true);
                        setAuthorized(false);
                        setError(null);
                        setNewConnection(null);
                        connectorId.current = connector_id;
                        connectionId.current = connection_id;
                        return [4 /*yield*/, authorizeConnection(null, connectorId.current, connectionId.current, public_key, sidekick_url, setError)];
                    case 1:
                        authorizeResult = _a.sent();
                        if (!authorizeResult) {
                            setLoading(false);
                            return [2 /*return*/];
                        }
                        url = authorizeResult.auth_url;
                        if (windowObjectReference === null || windowObjectReference.closed) {
                            strWindowFeatures = 'toolbar=no,menubar=no,width=600,height=700,top=100,left=100';
                            windowObjectReference = window.open(url, 'NotionOAuth', strWindowFeatures);
                        }
                        else {
                            windowObjectReference.focus();
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    useEffect(function () {
        function handleMessage(event) {
            console.log(event);
            // check if oigin is not http://localhost:5173 or app.getsidekick.ai
            if (event.origin !== "http://localhost:5173" && event.origin !== "https://app.getsidekick.ai") {
                return;
            }
            var data = event.data;
            if (data && data.code && !authCodeHandled.current) {
                authCodeHandled.current = true;
                completeAuthWithCode(data.code);
            }
        }
        function completeAuthWithCode(code) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, authorizeConnection(code, connectorId.current, connectionId.current, public_key, sidekick_url, setError)];
                        case 1:
                            result = _a.sent();
                            if (!result) {
                                setLoading(false);
                                return [2 /*return*/];
                            }
                            console.log(result);
                            setAuthorized(result.authorized);
                            setNewConnection(result.connection.connection_id);
                            setLoading(false);
                            return [2 /*return*/];
                    }
                });
            });
        }
        window.addEventListener('message', handleMessage, false);
        return function () {
            window.removeEventListener('message', handleMessage);
            // window.removeEventListener('popstate', handlePopState);
            //   window.removeEventListener('hashchange', handleOAuthMessage);
        };
    }, []);
    return { authorize: authorize, authorized: authorized, loading: loading, newConnection: newConnection, error: error };
}
function authorizeConnection(auth_code, connector_id, connection_id, public_key, sidekick_url, setError) {
    return __awaiter(this, void 0, void 0, function () {
        var baseUrl, url, payload, response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    baseUrl = sidekick_url;
                    console.log(baseUrl);
                    console.log(auth_code);
                    console.log(connector_id);
                    console.log(connection_id);
                    console.log(public_key);
                    console.log(sidekick_url);
                    url = baseUrl + '/add-oauth-connection';
                    payload = {
                        connection_id: connection_id,
                        connector_id: connector_id
                    };
                    if (auth_code) {
                        payload.auth_code = auth_code;
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch(url, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer ".concat(public_key) },
                            body: JSON.stringify(payload),
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) {
                        setError("Authorization failed with status: ".concat(response.status));
                    }
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    return [2 /*return*/, data.result];
                case 4:
                    error_1 = _a.sent();
                    setError("Authorization failed with error: ".concat(error_1));
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}

export { useSidekickAuth };
//# sourceMappingURL=index.esm.js.map
