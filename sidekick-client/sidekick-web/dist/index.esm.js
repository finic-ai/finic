import { useState, useEffect } from 'react';

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

function useNotionOAuth(connector_id, connection_id, public_key) {
    var _a = useState(null), authCode = _a[0], setAuthCode = _a[1];
    var windowObjectReference = null;
    function authorize() {
        return __awaiter(this, void 0, void 0, function () {
            var authorizeResult, url, strWindowFeatures;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, authorizeConnection(null, connector_id, connection_id, public_key)];
                    case 1:
                        authorizeResult = _a.sent();
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
        // handlePopState({} as PopStateEvent)
        console.log("hello");
        // window.addEventListener('hashchange', handleHashChange);
        // window.addEventListener('popstate', handlePopState);
        function handleMessage(event) {
            console.log(event);
            if (event.origin !== "http://localhost:5173") {
                console.log('wrong origin');
                return;
            }
            var data = event.data;
            if (data) {
                setAuthCode(data.code);
            }
        }
        window.addEventListener('message', handleMessage, false);
        return function () {
            window.removeEventListener('message', handleMessage);
            // window.removeEventListener('popstate', handlePopState);
            //   window.removeEventListener('hashchange', handleOAuthMessage);
        };
    }, []);
    return { authorize: authorize, authCode: authCode };
}
function authorizeConnection(auth_code, connector_id, connection_id, public_key) {
    return __awaiter(this, void 0, void 0, function () {
        var baseUrl, url, payload, response, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    baseUrl = "http://localhost:8080";
                    url = baseUrl + '/add-oauth-connection';
                    payload = {
                        connection_id: connection_id,
                        connector_id: connector_id
                    };
                    if (auth_code) {
                        payload.auth_code = auth_code;
                    }
                    return [4 /*yield*/, fetch(url, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer ".concat(public_key) },
                            body: JSON.stringify(payload),
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("Authorization failed with status: ".concat(response.status));
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    return [2 /*return*/, data.result];
            }
        });
    });
}

export { useNotionOAuth };
//# sourceMappingURL=index.esm.js.map
