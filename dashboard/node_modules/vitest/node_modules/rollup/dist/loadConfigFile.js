/*
  @license
	Rollup.js v2.78.1
	Fri, 19 Aug 2022 05:19:43 GMT - commit 398d0c4970b679795025f36e320f8aecb2859d24

	https://github.com/rollup/rollup

	Released under the MIT License.
*/
'use strict';

require('path');
require('process');
require('url');
const loadConfigFile_js = require('./shared/loadConfigFile.js');
require('./shared/rollup.js');
require('./shared/mergeOptions.js');
require('tty');
require('perf_hooks');
require('crypto');
require('fs');
require('events');



module.exports = loadConfigFile_js.loadAndParseConfigFile;
//# sourceMappingURL=loadConfigFile.js.map
