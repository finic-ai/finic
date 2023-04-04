import { pathToFileURL, fileURLToPath as fileURLToPath$1, URL as URL$1 } from 'url';
import fs, { promises, statSync, existsSync, realpathSync, Stats } from 'fs';
import { b as resolve$1, r as relative } from './chunk-utils-env.03f840f2.js';
import 'acorn';
import { builtinModules } from 'module';
import path from 'path';
import assert from 'assert';
import { format, inspect } from 'util';

const TRAILING_SLASH_RE = /\/$|\/\?/;
function hasTrailingSlash(input = "", queryParameters = false) {
  if (!queryParameters) {
    return input.endsWith("/");
  }
  return TRAILING_SLASH_RE.test(input);
}
function withTrailingSlash(input = "", queryParameters = false) {
  if (!queryParameters) {
    return input.endsWith("/") ? input : input + "/";
  }
  if (hasTrailingSlash(input, true)) {
    return input || "/";
  }
  const [s0, ...s] = input.split("?");
  return s0 + "/" + (s.length > 0 ? `?${s.join("?")}` : "");
}
function hasLeadingSlash(input = "") {
  return input.startsWith("/");
}
function withoutLeadingSlash(input = "") {
  return (hasLeadingSlash(input) ? input.slice(1) : input) || "/";
}
function isNonEmptyURL(url) {
  return url && url !== "/";
}
function joinURL(base, ...input) {
  let url = base || "";
  for (const index of input.filter((url2) => isNonEmptyURL(url2))) {
    url = url ? withTrailingSlash(url) + withoutLeadingSlash(index) : index;
  }
  return url;
}

function normalizeWindowsPath(input = "") {
  if (!input || !input.includes("\\")) {
    return input;
  }
  return input.replace(/\\/g, "/");
}

const _UNC_REGEX = /^[/\\]{2}/;
const _IS_ABSOLUTE_RE = /^[/\\](?![/\\])|^[/\\]{2}(?!\.)|^[A-Za-z]:[/\\]/;
const _DRIVE_LETTER_RE = /^[A-Za-z]:$/;
const normalize = function(path) {
  if (path.length === 0) {
    return ".";
  }
  path = normalizeWindowsPath(path);
  const isUNCPath = path.match(_UNC_REGEX);
  const isPathAbsolute = isAbsolute(path);
  const trailingSeparator = path[path.length - 1] === "/";
  path = normalizeString(path, !isPathAbsolute);
  if (path.length === 0) {
    if (isPathAbsolute) {
      return "/";
    }
    return trailingSeparator ? "./" : ".";
  }
  if (trailingSeparator) {
    path += "/";
  }
  if (_DRIVE_LETTER_RE.test(path)) {
    path += "/";
  }
  if (isUNCPath) {
    if (!isPathAbsolute) {
      return `//./${path}`;
    }
    return `//${path}`;
  }
  return isPathAbsolute && !isAbsolute(path) ? `/${path}` : path;
};
const join = function(...arguments_) {
  if (arguments_.length === 0) {
    return ".";
  }
  let joined;
  for (const argument of arguments_) {
    if (argument && argument.length > 0) {
      if (joined === void 0) {
        joined = argument;
      } else {
        joined += `/${argument}`;
      }
    }
  }
  if (joined === void 0) {
    return ".";
  }
  return normalize(joined.replace(/\/\/+/g, "/"));
};
const resolve = function(...arguments_) {
  arguments_ = arguments_.map((argument) => normalizeWindowsPath(argument));
  let resolvedPath = "";
  let resolvedAbsolute = false;
  for (let index = arguments_.length - 1; index >= -1 && !resolvedAbsolute; index--) {
    const path = index >= 0 ? arguments_[index] : process.cwd().replace(/\\/g, "/");
    if (!path || path.length === 0) {
      continue;
    }
    resolvedPath = `${path}/${resolvedPath}`;
    resolvedAbsolute = isAbsolute(path);
  }
  resolvedPath = normalizeString(resolvedPath, !resolvedAbsolute);
  if (resolvedAbsolute && !isAbsolute(resolvedPath)) {
    return `/${resolvedPath}`;
  }
  return resolvedPath.length > 0 ? resolvedPath : ".";
};
function normalizeString(path, allowAboveRoot) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let char = null;
  for (let index = 0; index <= path.length; ++index) {
    if (index < path.length) {
      char = path[index];
    } else if (char === "/") {
      break;
    } else {
      char = "/";
    }
    if (char === "/") {
      if (lastSlash === index - 1 || dots === 1) ; else if (dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res[res.length - 1] !== "." || res[res.length - 2] !== ".") {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf("/");
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
            }
            lastSlash = index;
            dots = 0;
            continue;
          } else if (res.length > 0) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = index;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          res += res.length > 0 ? "/.." : "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0) {
          res += `/${path.slice(lastSlash + 1, index)}`;
        } else {
          res = path.slice(lastSlash + 1, index);
        }
        lastSegmentLength = index - lastSlash - 1;
      }
      lastSlash = index;
      dots = 0;
    } else if (char === "." && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
const isAbsolute = function(p) {
  return _IS_ABSOLUTE_RE.test(p);
};
const _EXTNAME_RE = /.(\.[^./]+)$/;
const extname = function(p) {
  const match = _EXTNAME_RE.exec(normalizeWindowsPath(p));
  return match && match[1] || "";
};

const defaultFindOptions = {
  startingFrom: ".",
  rootPattern: /^node_modules$/,
  reverse: false,
  test: (filePath) => {
    try {
      if (statSync(filePath).isFile()) {
        return true;
      }
    } catch {
    }
  }
};
async function findFile(filename, _options = {}) {
  const options = { ...defaultFindOptions, ..._options };
  const basePath = resolve(options.startingFrom);
  const leadingSlash = basePath[0] === "/";
  const segments = basePath.split("/").filter(Boolean);
  if (leadingSlash) {
    segments[0] = "/" + segments[0];
  }
  let root = segments.findIndex((r) => r.match(options.rootPattern));
  if (root === -1) {
    root = 0;
  }
  if (!options.reverse) {
    for (let index = segments.length; index > root; index--) {
      const filePath = join(...segments.slice(0, index), filename);
      if (await options.test(filePath)) {
        return filePath;
      }
    }
  } else {
    for (let index = root + 1; index <= segments.length; index++) {
      const filePath = join(...segments.slice(0, index), filename);
      if (await options.test(filePath)) {
        return filePath;
      }
    }
  }
  throw new Error(`Cannot find matching ${filename} in ${options.startingFrom} or parent directories`);
}
function findNearestFile(filename, _options = {}) {
  return findFile(filename, _options);
}
const FileCache = /* @__PURE__ */ new Map();
async function readPackageJSON(id, options = {}) {
  const resolvedPath = await resolvePackageJSON(id, options);
  const cache = options.cache && typeof options.cache !== "boolean" ? options.cache : FileCache;
  if (options.cache && cache.has(resolvedPath)) {
    return cache.get(resolvedPath);
  }
  const blob = await promises.readFile(resolvedPath, "utf8");
  const parsed = JSON.parse(blob);
  cache.set(resolvedPath, parsed);
  return parsed;
}
async function resolvePackageJSON(id = process.cwd(), options = {}) {
  const resolvedPath = isAbsolute(id) ? id : await resolvePath(id, options);
  return findNearestFile("package.json", { startingFrom: resolvedPath, ...options });
}

const BUILTIN_MODULES = new Set(builtinModules);
function normalizeSlash(string_) {
  return string_.replace(/\\/g, "/");
}
function pcall(function_, ...arguments_) {
  try {
    return Promise.resolve(function_(...arguments_)).catch((error) => perr(error));
  } catch (error) {
    return perr(error);
  }
}
function perr(_error) {
  const error = new Error(_error);
  error.code = _error.code;
  Error.captureStackTrace(error, pcall);
  return Promise.reject(error);
}

const reader = { read };
const packageJsonReader = reader;
function read(jsonPath) {
  return find(path.dirname(jsonPath));
}
function find(dir) {
  try {
    const string = fs.readFileSync(
      path.toNamespacedPath(path.join(dir, "package.json")),
      "utf8"
    );
    return { string };
  } catch (error) {
    if (error.code === "ENOENT") {
      const parent = path.dirname(dir);
      if (dir !== parent) {
        return find(parent);
      }
      return { string: void 0 };
    }
    throw error;
  }
}

const isWindows$1 = process.platform === "win32";
const own$1 = {}.hasOwnProperty;
const codes = {};
const messages = /* @__PURE__ */ new Map();
const nodeInternalPrefix = "__node_internal_";
let userStackTraceLimit;
codes.ERR_INVALID_MODULE_SPECIFIER = createError(
  "ERR_INVALID_MODULE_SPECIFIER",
  (request, reason, base = void 0) => {
    return `Invalid module "${request}" ${reason}${base ? ` imported from ${base}` : ""}`;
  },
  TypeError
);
codes.ERR_INVALID_PACKAGE_CONFIG = createError(
  "ERR_INVALID_PACKAGE_CONFIG",
  (path, base, message) => {
    return `Invalid package config ${path}${base ? ` while importing ${base}` : ""}${message ? `. ${message}` : ""}`;
  },
  Error
);
codes.ERR_INVALID_PACKAGE_TARGET = createError(
  "ERR_INVALID_PACKAGE_TARGET",
  (pkgPath, key, target, isImport = false, base = void 0) => {
    const relError = typeof target === "string" && !isImport && target.length > 0 && !target.startsWith("./");
    if (key === ".") {
      assert(isImport === false);
      return `Invalid "exports" main target ${JSON.stringify(target)} defined in the package config ${pkgPath}package.json${base ? ` imported from ${base}` : ""}${relError ? '; targets must start with "./"' : ""}`;
    }
    return `Invalid "${isImport ? "imports" : "exports"}" target ${JSON.stringify(
      target
    )} defined for '${key}' in the package config ${pkgPath}package.json${base ? ` imported from ${base}` : ""}${relError ? '; targets must start with "./"' : ""}`;
  },
  Error
);
codes.ERR_MODULE_NOT_FOUND = createError(
  "ERR_MODULE_NOT_FOUND",
  (path, base, type = "package") => {
    return `Cannot find ${type} '${path}' imported from ${base}`;
  },
  Error
);
codes.ERR_PACKAGE_IMPORT_NOT_DEFINED = createError(
  "ERR_PACKAGE_IMPORT_NOT_DEFINED",
  (specifier, packagePath, base) => {
    return `Package import specifier "${specifier}" is not defined${packagePath ? ` in package ${packagePath}package.json` : ""} imported from ${base}`;
  },
  TypeError
);
codes.ERR_PACKAGE_PATH_NOT_EXPORTED = createError(
  "ERR_PACKAGE_PATH_NOT_EXPORTED",
  (pkgPath, subpath, base = void 0) => {
    if (subpath === ".") {
      return `No "exports" main defined in ${pkgPath}package.json${base ? ` imported from ${base}` : ""}`;
    }
    return `Package subpath '${subpath}' is not defined by "exports" in ${pkgPath}package.json${base ? ` imported from ${base}` : ""}`;
  },
  Error
);
codes.ERR_UNSUPPORTED_DIR_IMPORT = createError(
  "ERR_UNSUPPORTED_DIR_IMPORT",
  "Directory import '%s' is not supported resolving ES modules imported from %s",
  Error
);
codes.ERR_UNKNOWN_FILE_EXTENSION = createError(
  "ERR_UNKNOWN_FILE_EXTENSION",
  'Unknown file extension "%s" for %s',
  TypeError
);
codes.ERR_INVALID_ARG_VALUE = createError(
  "ERR_INVALID_ARG_VALUE",
  (name, value, reason = "is invalid") => {
    let inspected = inspect(value);
    if (inspected.length > 128) {
      inspected = `${inspected.slice(0, 128)}...`;
    }
    const type = name.includes(".") ? "property" : "argument";
    return `The ${type} '${name}' ${reason}. Received ${inspected}`;
  },
  TypeError
);
codes.ERR_UNSUPPORTED_ESM_URL_SCHEME = createError(
  "ERR_UNSUPPORTED_ESM_URL_SCHEME",
  (url) => {
    let message = "Only file and data URLs are supported by the default ESM loader";
    if (isWindows$1 && url.protocol.length === 2) {
      message += ". On Windows, absolute paths must be valid file:// URLs";
    }
    message += `. Received protocol '${url.protocol}'`;
    return message;
  },
  Error
);
function createError(sym, value, def) {
  messages.set(sym, value);
  return makeNodeErrorWithCode(def, sym);
}
function makeNodeErrorWithCode(Base, key) {
  return NodeError;
  function NodeError(...args) {
    const limit = Error.stackTraceLimit;
    if (isErrorStackTraceLimitWritable()) {
      Error.stackTraceLimit = 0;
    }
    const error = new Base();
    if (isErrorStackTraceLimitWritable()) {
      Error.stackTraceLimit = limit;
    }
    const message = getMessage(key, args, error);
    Object.defineProperty(error, "message", {
      value: message,
      enumerable: false,
      writable: true,
      configurable: true
    });
    Object.defineProperty(error, "toString", {
      value() {
        return `${this.name} [${key}]: ${this.message}`;
      },
      enumerable: false,
      writable: true,
      configurable: true
    });
    addCodeToName(error, Base.name, key);
    error.code = key;
    return error;
  }
}
const addCodeToName = hideStackFrames(
  function(error, name, code) {
    error = captureLargerStackTrace(error);
    error.name = `${name} [${code}]`;
    error.stack;
    if (name === "SystemError") {
      Object.defineProperty(error, "name", {
        value: name,
        enumerable: false,
        writable: true,
        configurable: true
      });
    } else {
      delete error.name;
    }
  }
);
function isErrorStackTraceLimitWritable() {
  const desc = Object.getOwnPropertyDescriptor(Error, "stackTraceLimit");
  if (desc === void 0) {
    return Object.isExtensible(Error);
  }
  return own$1.call(desc, "writable") ? desc.writable : desc.set !== void 0;
}
function hideStackFrames(fn) {
  const hidden = nodeInternalPrefix + fn.name;
  Object.defineProperty(fn, "name", { value: hidden });
  return fn;
}
const captureLargerStackTrace = hideStackFrames(
  function(error) {
    const stackTraceLimitIsWritable = isErrorStackTraceLimitWritable();
    if (stackTraceLimitIsWritable) {
      userStackTraceLimit = Error.stackTraceLimit;
      Error.stackTraceLimit = Number.POSITIVE_INFINITY;
    }
    Error.captureStackTrace(error);
    if (stackTraceLimitIsWritable) {
      Error.stackTraceLimit = userStackTraceLimit;
    }
    return error;
  }
);
function getMessage(key, args, self) {
  const message = messages.get(key);
  if (typeof message === "function") {
    assert(
      message.length <= args.length,
      `Code: ${key}; The provided arguments length (${args.length}) does not match the required ones (${message.length}).`
    );
    return Reflect.apply(message, self, args);
  }
  const expectedLength = (message.match(/%[dfijoOs]/g) || []).length;
  assert(
    expectedLength === args.length,
    `Code: ${key}; The provided arguments length (${args.length}) does not match the required ones (${expectedLength}).`
  );
  if (args.length === 0) {
    return message;
  }
  args.unshift(message);
  return Reflect.apply(format, null, args);
}

const { ERR_UNKNOWN_FILE_EXTENSION } = codes;
const extensionFormatMap = {
  __proto__: null,
  ".cjs": "commonjs",
  ".js": "module",
  ".mjs": "module"
};
function defaultGetFormat(url) {
  if (url.startsWith("node:")) {
    return { format: "builtin" };
  }
  const parsed = new URL$1(url);
  if (parsed.protocol === "data:") {
    const { 1: mime } = /^([^/]+\/[^;,]+)[^,]*?(;base64)?,/.exec(
      parsed.pathname
    ) || [null, null];
    const format = mime === "text/javascript" ? "module" : null;
    return { format };
  }
  if (parsed.protocol === "file:") {
    const ext = path.extname(parsed.pathname);
    let format;
    if (ext === ".js") {
      format = getPackageType(parsed.href) === "module" ? "module" : "commonjs";
    } else {
      format = extensionFormatMap[ext];
    }
    if (!format) {
      throw new ERR_UNKNOWN_FILE_EXTENSION(ext, fileURLToPath$1(url));
    }
    return { format: format || null };
  }
  return { format: null };
}

const {
  ERR_INVALID_MODULE_SPECIFIER,
  ERR_INVALID_PACKAGE_CONFIG,
  ERR_INVALID_PACKAGE_TARGET,
  ERR_MODULE_NOT_FOUND,
  ERR_PACKAGE_IMPORT_NOT_DEFINED,
  ERR_PACKAGE_PATH_NOT_EXPORTED,
  ERR_UNSUPPORTED_DIR_IMPORT,
  ERR_UNSUPPORTED_ESM_URL_SCHEME,
  ERR_INVALID_ARG_VALUE
} = codes;
const own = {}.hasOwnProperty;
Object.freeze(["node", "import"]);
const invalidSegmentRegEx = /(^|\\|\/)(\.\.?|node_modules)(\\|\/|$)/;
const patternRegEx = /\*/g;
const encodedSepRegEx = /%2f|%2c/i;
const emittedPackageWarnings = /* @__PURE__ */ new Set();
const packageJsonCache = /* @__PURE__ */ new Map();
function emitFolderMapDeprecation(match, pjsonUrl, isExports, base) {
  const pjsonPath = fileURLToPath$1(pjsonUrl);
  if (emittedPackageWarnings.has(pjsonPath + "|" + match)) {
    return;
  }
  emittedPackageWarnings.add(pjsonPath + "|" + match);
  process.emitWarning(
    `Use of deprecated folder mapping "${match}" in the ${isExports ? '"exports"' : '"imports"'} field module resolution of the package at ${pjsonPath}${base ? ` imported from ${fileURLToPath$1(base)}` : ""}.
Update this package.json to use a subpath pattern like "${match}*".`,
    "DeprecationWarning",
    "DEP0148"
  );
}
function emitLegacyIndexDeprecation(url, packageJsonUrl, base, main) {
  const { format } = defaultGetFormat(url.href);
  if (format !== "module") {
    return;
  }
  const path2 = fileURLToPath$1(url.href);
  const pkgPath = fileURLToPath$1(new URL(".", packageJsonUrl));
  const basePath = fileURLToPath$1(base);
  if (main) {
    process.emitWarning(
      `Package ${pkgPath} has a "main" field set to ${JSON.stringify(main)}, excluding the full filename and extension to the resolved file at "${path2.slice(
        pkgPath.length
      )}", imported from ${basePath}.
 Automatic extension resolution of the "main" field isdeprecated for ES modules.`,
      "DeprecationWarning",
      "DEP0151"
    );
  } else {
    process.emitWarning(
      `No "main" or "exports" field defined in the package.json for ${pkgPath} resolving the main entry point "${path2.slice(
        pkgPath.length
      )}", imported from ${basePath}.
Default "index" lookups for the main are deprecated for ES modules.`,
      "DeprecationWarning",
      "DEP0151"
    );
  }
}
function tryStatSync(path2) {
  try {
    return statSync(path2);
  } catch {
    return new Stats();
  }
}
function getPackageConfig(path2, specifier, base) {
  const existing = packageJsonCache.get(path2);
  if (existing !== void 0) {
    return existing;
  }
  const source = packageJsonReader.read(path2).string;
  if (source === void 0) {
    const packageConfig2 = {
      pjsonPath: path2,
      exists: false,
      main: void 0,
      name: void 0,
      type: "none",
      exports: void 0,
      imports: void 0
    };
    packageJsonCache.set(path2, packageConfig2);
    return packageConfig2;
  }
  let packageJson;
  try {
    packageJson = JSON.parse(source);
  } catch (error) {
    throw new ERR_INVALID_PACKAGE_CONFIG(
      path2,
      (base ? `"${specifier}" from ` : "") + fileURLToPath$1(base || specifier),
      error.message
    );
  }
  const { exports, imports, main, name, type } = packageJson;
  const packageConfig = {
    pjsonPath: path2,
    exists: true,
    main: typeof main === "string" ? main : void 0,
    name: typeof name === "string" ? name : void 0,
    type: type === "module" || type === "commonjs" ? type : "none",
    exports,
    imports: imports && typeof imports === "object" ? imports : void 0
  };
  packageJsonCache.set(path2, packageConfig);
  return packageConfig;
}
function getPackageScopeConfig(resolved) {
  let packageJsonUrl = new URL("./package.json", resolved);
  while (true) {
    const packageJsonPath2 = packageJsonUrl.pathname;
    if (packageJsonPath2.endsWith("node_modules/package.json")) {
      break;
    }
    const packageConfig2 = getPackageConfig(
      fileURLToPath$1(packageJsonUrl),
      resolved
    );
    if (packageConfig2.exists) {
      return packageConfig2;
    }
    const lastPackageJsonUrl = packageJsonUrl;
    packageJsonUrl = new URL("../package.json", packageJsonUrl);
    if (packageJsonUrl.pathname === lastPackageJsonUrl.pathname) {
      break;
    }
  }
  const packageJsonPath = fileURLToPath$1(packageJsonUrl);
  const packageConfig = {
    pjsonPath: packageJsonPath,
    exists: false,
    main: void 0,
    name: void 0,
    type: "none",
    exports: void 0,
    imports: void 0
  };
  packageJsonCache.set(packageJsonPath, packageConfig);
  return packageConfig;
}
function fileExists(url) {
  return tryStatSync(fileURLToPath$1(url)).isFile();
}
function legacyMainResolve(packageJsonUrl, packageConfig, base) {
  let guess;
  if (packageConfig.main !== void 0) {
    guess = new URL(`./${packageConfig.main}`, packageJsonUrl);
    if (fileExists(guess)) {
      return guess;
    }
    const tries2 = [
      `./${packageConfig.main}.js`,
      `./${packageConfig.main}.json`,
      `./${packageConfig.main}.node`,
      `./${packageConfig.main}/index.js`,
      `./${packageConfig.main}/index.json`,
      `./${packageConfig.main}/index.node`
    ];
    let i2 = -1;
    while (++i2 < tries2.length) {
      guess = new URL(tries2[i2], packageJsonUrl);
      if (fileExists(guess)) {
        break;
      }
      guess = void 0;
    }
    if (guess) {
      emitLegacyIndexDeprecation(
        guess,
        packageJsonUrl,
        base,
        packageConfig.main
      );
      return guess;
    }
  }
  const tries = ["./index.js", "./index.json", "./index.node"];
  let i = -1;
  while (++i < tries.length) {
    guess = new URL(tries[i], packageJsonUrl);
    if (fileExists(guess)) {
      break;
    }
    guess = void 0;
  }
  if (guess) {
    emitLegacyIndexDeprecation(guess, packageJsonUrl, base, packageConfig.main);
    return guess;
  }
  throw new ERR_MODULE_NOT_FOUND(
    fileURLToPath$1(new URL(".", packageJsonUrl)),
    fileURLToPath$1(base)
  );
}
function finalizeResolution(resolved, base) {
  if (encodedSepRegEx.test(resolved.pathname)) {
    throw new ERR_INVALID_MODULE_SPECIFIER(
      resolved.pathname,
      'must not include encoded "/" or "\\" characters',
      fileURLToPath$1(base)
    );
  }
  const path2 = fileURLToPath$1(resolved);
  const stats = tryStatSync(path2.endsWith("/") ? path2.slice(-1) : path2);
  if (stats.isDirectory()) {
    const error = new ERR_UNSUPPORTED_DIR_IMPORT(path2, fileURLToPath$1(base));
    error.url = String(resolved);
    throw error;
  }
  if (!stats.isFile()) {
    throw new ERR_MODULE_NOT_FOUND(
      path2 || resolved.pathname,
      base && fileURLToPath$1(base),
      "module"
    );
  }
  return resolved;
}
function throwImportNotDefined(specifier, packageJsonUrl, base) {
  throw new ERR_PACKAGE_IMPORT_NOT_DEFINED(
    specifier,
    packageJsonUrl && fileURLToPath$1(new URL(".", packageJsonUrl)),
    fileURLToPath$1(base)
  );
}
function throwExportsNotFound(subpath, packageJsonUrl, base) {
  throw new ERR_PACKAGE_PATH_NOT_EXPORTED(
    fileURLToPath$1(new URL(".", packageJsonUrl)),
    subpath,
    base && fileURLToPath$1(base)
  );
}
function throwInvalidSubpath(subpath, packageJsonUrl, internal, base) {
  const reason = `request is not a valid subpath for the "${internal ? "imports" : "exports"}" resolution of ${fileURLToPath$1(packageJsonUrl)}`;
  throw new ERR_INVALID_MODULE_SPECIFIER(
    subpath,
    reason,
    base && fileURLToPath$1(base)
  );
}
function throwInvalidPackageTarget(subpath, target, packageJsonUrl, internal, base) {
  target = typeof target === "object" && target !== null ? JSON.stringify(target, null, "") : `${target}`;
  throw new ERR_INVALID_PACKAGE_TARGET(
    fileURLToPath$1(new URL(".", packageJsonUrl)),
    subpath,
    target,
    internal,
    base && fileURLToPath$1(base)
  );
}
function resolvePackageTargetString(target, subpath, match, packageJsonUrl, base, pattern, internal, conditions) {
  if (subpath !== "" && !pattern && target[target.length - 1] !== "/") {
    throwInvalidPackageTarget(match, target, packageJsonUrl, internal, base);
  }
  if (!target.startsWith("./")) {
    if (internal && !target.startsWith("../") && !target.startsWith("/")) {
      let isURL = false;
      try {
        new URL(target);
        isURL = true;
      } catch {
      }
      if (!isURL) {
        const exportTarget = pattern ? target.replace(patternRegEx, subpath) : target + subpath;
        return packageResolve(exportTarget, packageJsonUrl, conditions);
      }
    }
    throwInvalidPackageTarget(match, target, packageJsonUrl, internal, base);
  }
  if (invalidSegmentRegEx.test(target.slice(2))) {
    throwInvalidPackageTarget(match, target, packageJsonUrl, internal, base);
  }
  const resolved = new URL(target, packageJsonUrl);
  const resolvedPath = resolved.pathname;
  const packagePath = new URL(".", packageJsonUrl).pathname;
  if (!resolvedPath.startsWith(packagePath)) {
    throwInvalidPackageTarget(match, target, packageJsonUrl, internal, base);
  }
  if (subpath === "") {
    return resolved;
  }
  if (invalidSegmentRegEx.test(subpath)) {
    throwInvalidSubpath(match + subpath, packageJsonUrl, internal, base);
  }
  if (pattern) {
    return new URL(resolved.href.replace(patternRegEx, subpath));
  }
  return new URL(subpath, resolved);
}
function isArrayIndex(key) {
  const keyNumber = Number(key);
  if (`${keyNumber}` !== key) {
    return false;
  }
  return keyNumber >= 0 && keyNumber < 4294967295;
}
function resolvePackageTarget(packageJsonUrl, target, subpath, packageSubpath, base, pattern, internal, conditions) {
  if (typeof target === "string") {
    return resolvePackageTargetString(
      target,
      subpath,
      packageSubpath,
      packageJsonUrl,
      base,
      pattern,
      internal,
      conditions
    );
  }
  if (Array.isArray(target)) {
    const targetList = target;
    if (targetList.length === 0) {
      return null;
    }
    let lastException;
    let i = -1;
    while (++i < targetList.length) {
      const targetItem = targetList[i];
      let resolved;
      try {
        resolved = resolvePackageTarget(
          packageJsonUrl,
          targetItem,
          subpath,
          packageSubpath,
          base,
          pattern,
          internal,
          conditions
        );
      } catch (error) {
        lastException = error;
        if (error.code === "ERR_INVALID_PACKAGE_TARGET") {
          continue;
        }
        throw error;
      }
      if (resolved === void 0) {
        continue;
      }
      if (resolved === null) {
        lastException = null;
        continue;
      }
      return resolved;
    }
    if (lastException === void 0 || lastException === null) {
      return lastException;
    }
    throw lastException;
  }
  if (typeof target === "object" && target !== null) {
    const keys = Object.getOwnPropertyNames(target);
    let i = -1;
    while (++i < keys.length) {
      const key = keys[i];
      if (isArrayIndex(key)) {
        throw new ERR_INVALID_PACKAGE_CONFIG(
          fileURLToPath$1(packageJsonUrl),
          base,
          '"exports" cannot contain numeric property keys.'
        );
      }
    }
    i = -1;
    while (++i < keys.length) {
      const key = keys[i];
      if (key === "default" || conditions && conditions.has(key)) {
        const conditionalTarget = target[key];
        const resolved = resolvePackageTarget(
          packageJsonUrl,
          conditionalTarget,
          subpath,
          packageSubpath,
          base,
          pattern,
          internal,
          conditions
        );
        if (resolved === void 0) {
          continue;
        }
        return resolved;
      }
    }
    return void 0;
  }
  if (target === null) {
    return null;
  }
  throwInvalidPackageTarget(
    packageSubpath,
    target,
    packageJsonUrl,
    internal,
    base
  );
}
function isConditionalExportsMainSugar(exports, packageJsonUrl, base) {
  if (typeof exports === "string" || Array.isArray(exports)) {
    return true;
  }
  if (typeof exports !== "object" || exports === null) {
    return false;
  }
  const keys = Object.getOwnPropertyNames(exports);
  let isConditionalSugar = false;
  let i = 0;
  let j = -1;
  while (++j < keys.length) {
    const key = keys[j];
    const curIsConditionalSugar = key === "" || key[0] !== ".";
    if (i++ === 0) {
      isConditionalSugar = curIsConditionalSugar;
    } else if (isConditionalSugar !== curIsConditionalSugar) {
      throw new ERR_INVALID_PACKAGE_CONFIG(
        fileURLToPath$1(packageJsonUrl),
        base,
        `"exports" cannot contain some keys starting with '.' and some not. The exports object must either be an object of package subpath keys or an object of main entry condition name keys only.`
      );
    }
  }
  return isConditionalSugar;
}
function packageExportsResolve(packageJsonUrl, packageSubpath, packageConfig, base, conditions) {
  let exports = packageConfig.exports;
  if (isConditionalExportsMainSugar(exports, packageJsonUrl, base)) {
    exports = { ".": exports };
  }
  if (own.call(exports, packageSubpath)) {
    const target = exports[packageSubpath];
    const resolved = resolvePackageTarget(
      packageJsonUrl,
      target,
      "",
      packageSubpath,
      base,
      false,
      false,
      conditions
    );
    if (resolved === null || resolved === void 0) {
      throwExportsNotFound(packageSubpath, packageJsonUrl, base);
    }
    return { resolved, exact: true };
  }
  let bestMatch = "";
  const keys = Object.getOwnPropertyNames(exports);
  let i = -1;
  while (++i < keys.length) {
    const key = keys[i];
    if (key[key.length - 1] === "*" && packageSubpath.startsWith(key.slice(0, -1)) && packageSubpath.length >= key.length && key.length > bestMatch.length) {
      bestMatch = key;
    } else if (key[key.length - 1] === "/" && packageSubpath.startsWith(key) && key.length > bestMatch.length) {
      bestMatch = key;
    }
  }
  if (bestMatch) {
    const target = exports[bestMatch];
    const pattern = bestMatch[bestMatch.length - 1] === "*";
    const subpath = packageSubpath.slice(bestMatch.length - (pattern ? 1 : 0));
    const resolved = resolvePackageTarget(
      packageJsonUrl,
      target,
      subpath,
      bestMatch,
      base,
      pattern,
      false,
      conditions
    );
    if (resolved === null || resolved === void 0) {
      throwExportsNotFound(packageSubpath, packageJsonUrl, base);
    }
    if (!pattern) {
      emitFolderMapDeprecation(bestMatch, packageJsonUrl, true, base);
    }
    return { resolved, exact: pattern };
  }
  throwExportsNotFound(packageSubpath, packageJsonUrl, base);
}
function packageImportsResolve(name, base, conditions) {
  if (name === "#" || name.startsWith("#/")) {
    const reason = "is not a valid internal imports specifier name";
    throw new ERR_INVALID_MODULE_SPECIFIER(name, reason, fileURLToPath$1(base));
  }
  let packageJsonUrl;
  const packageConfig = getPackageScopeConfig(base);
  if (packageConfig.exists) {
    packageJsonUrl = pathToFileURL(packageConfig.pjsonPath);
    const imports = packageConfig.imports;
    if (imports) {
      if (own.call(imports, name)) {
        const resolved = resolvePackageTarget(
          packageJsonUrl,
          imports[name],
          "",
          name,
          base,
          false,
          true,
          conditions
        );
        if (resolved !== null) {
          return { resolved, exact: true };
        }
      } else {
        let bestMatch = "";
        const keys = Object.getOwnPropertyNames(imports);
        let i = -1;
        while (++i < keys.length) {
          const key = keys[i];
          if (key[key.length - 1] === "*" && name.startsWith(key.slice(0, -1)) && name.length >= key.length && key.length > bestMatch.length) {
            bestMatch = key;
          } else if (key[key.length - 1] === "/" && name.startsWith(key) && key.length > bestMatch.length) {
            bestMatch = key;
          }
        }
        if (bestMatch) {
          const target = imports[bestMatch];
          const pattern = bestMatch[bestMatch.length - 1] === "*";
          const subpath = name.slice(bestMatch.length - (pattern ? 1 : 0));
          const resolved = resolvePackageTarget(
            packageJsonUrl,
            target,
            subpath,
            bestMatch,
            base,
            pattern,
            true,
            conditions
          );
          if (resolved !== null) {
            if (!pattern) {
              emitFolderMapDeprecation(bestMatch, packageJsonUrl, false, base);
            }
            return { resolved, exact: pattern };
          }
        }
      }
    }
  }
  throwImportNotDefined(name, packageJsonUrl, base);
}
function getPackageType(url) {
  const packageConfig = getPackageScopeConfig(url);
  return packageConfig.type;
}
function parsePackageName(specifier, base) {
  let separatorIndex = specifier.indexOf("/");
  let validPackageName = true;
  let isScoped = false;
  if (specifier[0] === "@") {
    isScoped = true;
    if (separatorIndex === -1 || specifier.length === 0) {
      validPackageName = false;
    } else {
      separatorIndex = specifier.indexOf("/", separatorIndex + 1);
    }
  }
  const packageName = separatorIndex === -1 ? specifier : specifier.slice(0, separatorIndex);
  let i = -1;
  while (++i < packageName.length) {
    if (packageName[i] === "%" || packageName[i] === "\\") {
      validPackageName = false;
      break;
    }
  }
  if (!validPackageName) {
    throw new ERR_INVALID_MODULE_SPECIFIER(
      specifier,
      "is not a valid package name",
      fileURLToPath$1(base)
    );
  }
  const packageSubpath = "." + (separatorIndex === -1 ? "" : specifier.slice(separatorIndex));
  return { packageName, packageSubpath, isScoped };
}
function packageResolve(specifier, base, conditions) {
  const { packageName, packageSubpath, isScoped } = parsePackageName(
    specifier,
    base
  );
  const packageConfig = getPackageScopeConfig(base);
  if (packageConfig.exists) {
    const packageJsonUrl2 = pathToFileURL(packageConfig.pjsonPath);
    if (packageConfig.name === packageName && packageConfig.exports !== void 0 && packageConfig.exports !== null) {
      return packageExportsResolve(
        packageJsonUrl2,
        packageSubpath,
        packageConfig,
        base,
        conditions
      ).resolved;
    }
  }
  let packageJsonUrl = new URL(
    "./node_modules/" + packageName + "/package.json",
    base
  );
  let packageJsonPath = fileURLToPath$1(packageJsonUrl);
  let lastPath;
  do {
    const stat = tryStatSync(packageJsonPath.slice(0, -13));
    if (!stat.isDirectory()) {
      lastPath = packageJsonPath;
      packageJsonUrl = new URL(
        (isScoped ? "../../../../node_modules/" : "../../../node_modules/") + packageName + "/package.json",
        packageJsonUrl
      );
      packageJsonPath = fileURLToPath$1(packageJsonUrl);
      continue;
    }
    const packageConfig2 = getPackageConfig(packageJsonPath, specifier, base);
    if (packageConfig2.exports !== void 0 && packageConfig2.exports !== null) {
      return packageExportsResolve(
        packageJsonUrl,
        packageSubpath,
        packageConfig2,
        base,
        conditions
      ).resolved;
    }
    if (packageSubpath === ".") {
      return legacyMainResolve(packageJsonUrl, packageConfig2, base);
    }
    return new URL(packageSubpath, packageJsonUrl);
  } while (packageJsonPath.length !== lastPath.length);
  throw new ERR_MODULE_NOT_FOUND(packageName, fileURLToPath$1(base));
}
function isRelativeSpecifier(specifier) {
  if (specifier[0] === ".") {
    if (specifier.length === 1 || specifier[1] === "/") {
      return true;
    }
    if (specifier[1] === "." && (specifier.length === 2 || specifier[2] === "/")) {
      return true;
    }
  }
  return false;
}
function shouldBeTreatedAsRelativeOrAbsolutePath(specifier) {
  if (specifier === "") {
    return false;
  }
  if (specifier[0] === "/") {
    return true;
  }
  return isRelativeSpecifier(specifier);
}
function moduleResolve(specifier, base, conditions) {
  let resolved;
  if (shouldBeTreatedAsRelativeOrAbsolutePath(specifier)) {
    resolved = new URL(specifier, base);
  } else if (specifier[0] === "#") {
    ({ resolved } = packageImportsResolve(specifier, base, conditions));
  } else {
    try {
      resolved = new URL(specifier);
    } catch {
      resolved = packageResolve(specifier, base, conditions);
    }
  }
  return finalizeResolution(resolved, base);
}

function fileURLToPath(id) {
  if (typeof id === "string" && !id.startsWith("file://")) {
    return normalizeSlash(id);
  }
  return normalizeSlash(fileURLToPath$1(id));
}
function normalizeid(id) {
  if (typeof id !== "string") {
    id = id.toString();
  }
  if (/(node|data|http|https|file):/.test(id)) {
    return id;
  }
  if (BUILTIN_MODULES.has(id)) {
    return "node:" + id;
  }
  return "file://" + encodeURI(normalizeSlash(id));
}
function isNodeBuiltin(id = "") {
  id = id.replace(/^node:/, "").split("/")[0];
  return BUILTIN_MODULES.has(id);
}
const ProtocolRegex = /^(?<proto>.{2,}?):.+$/;
function getProtocol(id) {
  const proto = id.match(ProtocolRegex);
  return proto ? proto.groups.proto : void 0;
}

const DEFAULT_CONDITIONS_SET = /* @__PURE__ */ new Set(["node", "import"]);
const DEFAULT_URL = pathToFileURL(process.cwd());
const DEFAULT_EXTENSIONS = [".mjs", ".cjs", ".js", ".json"];
const NOT_FOUND_ERRORS = /* @__PURE__ */ new Set(["ERR_MODULE_NOT_FOUND", "ERR_UNSUPPORTED_DIR_IMPORT", "MODULE_NOT_FOUND", "ERR_PACKAGE_PATH_NOT_EXPORTED"]);
function _tryModuleResolve(id, url, conditions) {
  try {
    return moduleResolve(id, url, conditions);
  } catch (error) {
    if (!NOT_FOUND_ERRORS.has(error.code)) {
      throw error;
    }
  }
}
function _resolve(id, options = {}) {
  if (/(node|data|http|https):/.test(id)) {
    return id;
  }
  if (BUILTIN_MODULES.has(id)) {
    return "node:" + id;
  }
  if (isAbsolute(id) && existsSync(id)) {
    const realPath2 = realpathSync(fileURLToPath(id));
    return pathToFileURL(realPath2).toString();
  }
  const conditionsSet = options.conditions ? new Set(options.conditions) : DEFAULT_CONDITIONS_SET;
  const _urls = (Array.isArray(options.url) ? options.url : [options.url]).filter(Boolean).map((u) => new URL(normalizeid(u.toString())));
  if (_urls.length === 0) {
    _urls.push(DEFAULT_URL);
  }
  const urls = [..._urls];
  for (const url of _urls) {
    if (url.protocol === "file:") {
      urls.push(
        new URL("./", url),
        new URL(joinURL(url.pathname, "_index.js"), url),
        new URL("node_modules", url)
      );
    }
  }
  let resolved;
  for (const url of urls) {
    resolved = _tryModuleResolve(id, url, conditionsSet);
    if (resolved) {
      break;
    }
    for (const prefix of ["", "/index"]) {
      for (const extension of options.extensions || DEFAULT_EXTENSIONS) {
        resolved = _tryModuleResolve(id + prefix + extension, url, conditionsSet);
        if (resolved) {
          break;
        }
      }
      if (resolved) {
        break;
      }
    }
  }
  if (!resolved) {
    const error = new Error(`Cannot find module ${id} imported from ${urls.join(", ")}`);
    error.code = "ERR_MODULE_NOT_FOUND";
    throw error;
  }
  const realPath = realpathSync(fileURLToPath(resolved));
  return pathToFileURL(realPath).toString();
}
function resolveSync(id, options) {
  return _resolve(id, options);
}
function resolvePathSync(id, options) {
  return fileURLToPath(resolveSync(id, options));
}
function resolvePath(id, options) {
  return pcall(resolvePathSync, id, options);
}

const ESM_RE = /([\s;]|^)(import[\s\w*,{}]*from|import\s*["'*{]|export\b\s*(?:[*{]|default|class|type|function|const|var|let|async function)|import\.meta\b)/m;
const BUILTIN_EXTENSIONS = /* @__PURE__ */ new Set([".mjs", ".cjs", ".node", ".wasm"]);
function hasESMSyntax(code) {
  return ESM_RE.test(code);
}
const CJS_RE = /([\s;]|^)(module.exports\b|exports\.\w|require\s*\(|global\.\w)/m;
function hasCJSSyntax(code) {
  return CJS_RE.test(code);
}
const validNodeImportDefaults = {
  allowedProtocols: ["node", "file", "data"]
};
async function isValidNodeImport(id, _options = {}) {
  if (isNodeBuiltin(id)) {
    return true;
  }
  const options = { ...validNodeImportDefaults, ..._options };
  const proto = getProtocol(id);
  if (proto && !options.allowedProtocols.includes(proto)) {
    return false;
  }
  if (proto === "data") {
    return true;
  }
  const resolvedPath = await resolvePath(id, options);
  const extension = extname(resolvedPath);
  if (BUILTIN_EXTENSIONS.has(extension)) {
    return true;
  }
  if (extension !== ".js") {
    return false;
  }
  const package_ = await readPackageJSON(resolvedPath).catch(() => {
  });
  if (package_?.type === "module") {
    return true;
  }
  if (/\.(\w+-)?esm?(-\w+)?\.js$|\/(esm?)\//.test(resolvedPath)) {
    return false;
  }
  const code = options.code || await promises.readFile(resolvedPath, "utf8").catch(() => {
  }) || "";
  return hasCJSSyntax(code) || !hasESMSyntax(code);
}

const isWindows = process.platform === "win32";
function slash(str) {
  return str.replace(/\\/g, "/");
}
function normalizeRequestId(id, base) {
  if (base && id.startsWith(base))
    id = `/${id.slice(base.length)}`;
  return id.replace(/^\/@id\/__x00__/, "\0").replace(/^\/@id\//, "").replace(/^__vite-browser-external:/, "").replace(/^(node|file):/, "").replace(/^\/+/, "/").replace(/\?v=\w+/, "?").replace(/&v=\w+/, "").replace(/\?t=\w+/, "?").replace(/&t=\w+/, "").replace(/\?import/, "?").replace(/&import/, "").replace(/\?&/, "?").replace(/\?+$/, "");
}
const queryRE = /\?.*$/s;
const hashRE = /#.*$/s;
const cleanUrl = (url) => url.replace(hashRE, "").replace(queryRE, "");
function normalizeModuleId(id) {
  return id.replace(/\\/g, "/").replace(/^\/@fs\//, "/").replace(/^file:\//, "/").replace(/^\/+/, "/");
}
function isPrimitive(v) {
  return v !== Object(v);
}
function pathFromRoot(root, filename) {
  if (isNodeBuiltin(filename))
    return filename;
  filename = filename.replace(/^\/@fs\//, isWindows ? "" : "/");
  if (!filename.startsWith(root))
    return filename;
  const relativePath = relative(root, filename);
  const segments = relativePath.split("/");
  const startIndex = segments.findIndex((segment) => segment !== ".." && segment !== ".");
  return `/${segments.slice(startIndex).join("/")}`;
}
function toFilePath(id, root) {
  let absolute = (() => {
    if (id.startsWith("/@fs/"))
      return id.slice(4);
    if (!id.startsWith(root) && id.startsWith("/")) {
      const resolved = resolve$1(root, id.slice(1));
      if (existsSync(resolved.replace(/\?.*$/, "")))
        return resolved;
    }
    return id;
  })();
  if (absolute.startsWith("//"))
    absolute = absolute.slice(1);
  return isWindows && absolute.startsWith("/") ? slash(fileURLToPath$1(pathToFileURL(absolute.slice(1)).href)) : absolute;
}
function toArray(array) {
  if (array === null || array === void 0)
    array = [];
  if (Array.isArray(array))
    return array;
  return [array];
}

export { isValidNodeImport as a, toFilePath as b, normalizeRequestId as c, cleanUrl as d, isPrimitive as e, hasCJSSyntax as h, isNodeBuiltin as i, normalizeModuleId as n, pathFromRoot as p, slash as s, toArray as t };
