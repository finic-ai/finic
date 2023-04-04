import util$1 from 'util';
import { util } from 'chai';
import { a as stringify } from './chunk-utils-timers.793fd179.js';
import { w as deepClone, x as getType } from './chunk-typecheck-constants.ed987901.js';

const IS_RECORD_SYMBOL = "@@__IMMUTABLE_RECORD__@@";
const IS_COLLECTION_SYMBOL = "@@__IMMUTABLE_ITERABLE__@@";
const isImmutable = (v) => v && (v[IS_COLLECTION_SYMBOL] || v[IS_RECORD_SYMBOL]);
const OBJECT_PROTO = Object.getPrototypeOf({});
function getUnserializableMessage(err) {
  if (err instanceof Error)
    return `<unserializable>: ${err.message}`;
  if (typeof err === "string")
    return `<unserializable>: ${err}`;
  return "<unserializable>";
}
function serializeError(val, seen = /* @__PURE__ */ new WeakMap()) {
  if (!val || typeof val === "string")
    return val;
  if (typeof val === "function")
    return `Function<${val.name}>`;
  if (typeof val === "symbol")
    return val.toString();
  if (typeof val !== "object")
    return val;
  if (isImmutable(val))
    return serializeError(val.toJSON(), seen);
  if (val instanceof Promise || val.constructor && val.constructor.prototype === "AsyncFunction")
    return "Promise";
  if (typeof Element !== "undefined" && val instanceof Element)
    return val.tagName;
  if (typeof val.asymmetricMatch === "function")
    return `${val.toString()} ${util$1.format(val.sample)}`;
  if (seen.has(val))
    return seen.get(val);
  if (Array.isArray(val)) {
    const clone = new Array(val.length);
    seen.set(val, clone);
    val.forEach((e, i) => {
      try {
        clone[i] = serializeError(e, seen);
      } catch (err) {
        clone[i] = getUnserializableMessage(err);
      }
    });
    return clone;
  } else {
    const clone = /* @__PURE__ */ Object.create(null);
    seen.set(val, clone);
    let obj = val;
    while (obj && obj !== OBJECT_PROTO) {
      Object.getOwnPropertyNames(obj).forEach((key) => {
        if (key in clone)
          return;
        try {
          clone[key] = serializeError(val[key], seen);
        } catch (err) {
          delete clone[key];
          clone[key] = getUnserializableMessage(err);
        }
      });
      obj = Object.getPrototypeOf(obj);
    }
    return clone;
  }
}
function normalizeErrorMessage(message) {
  return message.replace(/__vite_ssr_import_\d+__\./g, "");
}
function processError(err) {
  if (!err || typeof err !== "object")
    return err;
  if (err.stack)
    err.stackStr = String(err.stack);
  if (err.name)
    err.nameStr = String(err.name);
  const clonedActual = deepClone(err.actual);
  const clonedExpected = deepClone(err.expected);
  const { replacedActual, replacedExpected } = replaceAsymmetricMatcher(clonedActual, clonedExpected);
  err.actual = replacedActual;
  err.expected = replacedExpected;
  if (typeof err.expected !== "string")
    err.expected = stringify(err.expected);
  if (typeof err.actual !== "string")
    err.actual = stringify(err.actual);
  try {
    if (typeof err.message === "string")
      err.message = normalizeErrorMessage(err.message);
    if (typeof err.cause === "object" && typeof err.cause.message === "string")
      err.cause.message = normalizeErrorMessage(err.cause.message);
  } catch {
  }
  try {
    return serializeError(err);
  } catch (e) {
    return serializeError(new Error(`Failed to fully serialize error: ${e == null ? void 0 : e.message}
Inner error message: ${err == null ? void 0 : err.message}`));
  }
}
function isAsymmetricMatcher(data) {
  const type = getType(data);
  return type === "Object" && typeof data.asymmetricMatch === "function";
}
function isReplaceable(obj1, obj2) {
  const obj1Type = getType(obj1);
  const obj2Type = getType(obj2);
  return obj1Type === obj2Type && obj1Type === "Object";
}
function replaceAsymmetricMatcher(actual, expected, actualReplaced = /* @__PURE__ */ new WeakMap(), expectedReplaced = /* @__PURE__ */ new WeakMap()) {
  if (!isReplaceable(actual, expected))
    return { replacedActual: actual, replacedExpected: expected };
  if (actualReplaced.has(actual) || expectedReplaced.has(expected))
    return { replacedActual: actual, replacedExpected: expected };
  actualReplaced.set(actual, true);
  expectedReplaced.set(expected, true);
  util.getOwnEnumerableProperties(expected).forEach((key) => {
    const expectedValue = expected[key];
    const actualValue = actual[key];
    if (isAsymmetricMatcher(expectedValue)) {
      if (expectedValue.asymmetricMatch(actualValue))
        actual[key] = expectedValue;
    } else if (isAsymmetricMatcher(actualValue)) {
      if (actualValue.asymmetricMatch(expectedValue))
        expected[key] = actualValue;
    } else if (isReplaceable(actualValue, expectedValue)) {
      const replaced = replaceAsymmetricMatcher(
        actualValue,
        expectedValue,
        actualReplaced,
        expectedReplaced
      );
      actual[key] = replaced.replacedActual;
      expected[key] = replaced.replacedExpected;
    }
  });
  return {
    replacedActual: actual,
    replacedExpected: expected
  };
}

export { processError as p };
