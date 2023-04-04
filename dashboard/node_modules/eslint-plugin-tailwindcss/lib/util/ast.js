/**
 * @fileoverview Utility functions for AST
 */

'use strict';

// context.parserPath
// /.../eslint-plugin-tailwindcss/node_modules/espree/espree.js
// /.../eslint-plugin-tailwindcss/node_modules/@angular-eslint/template-parser/dist/index.js

const removeDuplicatesFromArray = require('./removeDuplicatesFromArray');

/**
 * Find out if node is `class` or `className`
 *
 * @param {ASTNode} node The AST node being checked
 * @returns {Boolean}
 */
function isClassAttribute(node) {
  if (!node.name) {
    return false;
  }
  let name = '';
  switch (node.type) {
    case 'TextAttribute':
      name = node.name;
      break;
    default:
      name = node.name.name;
  }
  return /^class(Name)?$/.test(name);
}

/**
 * Find out if node is `class`
 *
 * @param {ASTNode} node The AST node being checked
 * @returns {Boolean}
 */
function isVueClassAttribute(node) {
  return node.key && /^class$/.test(node.key.name);
}

/**
 * Find out if node's value attribute is just simple text
 *
 * @param {ASTNode} node The AST node being checked
 * @returns {Boolean}
 */
function isVueLiteralAttributeValue(node) {
  if (node.value && node.value.type === 'VLiteral') {
    return true;
  }
  return false;
}

/**
 * Find out if node's value attribute is just simple text
 *
 * @param {ASTNode} node The AST node being checked
 * @returns {Boolean}
 */
function isLiteralAttributeValue(node) {
  if (node.type === 'TextAttribute' && node.name === 'class' && typeof node.value === 'string') {
    return true;
  }
  if (node.value) {
    switch (node.value.type) {
      case 'Literal':
        // No support for dynamic or conditional...
        return !/\{|\?|\}/.test(node.value.value);
      case 'JSXExpressionContainer':
        // className={"..."}
        return node.value.expression.type === 'Literal';
    }
  }
  return false;
}

/**
 * Find out if the node is a valid candidate for our rules
 *
 * @param {ASTNode} node The AST node being checked
 * @returns {Boolean}
 */
function isValidJSXAttribute(node) {
  if (!isClassAttribute(node)) {
    // Only run for class[Name] attributes
    return false;
  }
  if (!isLiteralAttributeValue(node)) {
    // No support for dynamic or conditional classnames
    return false;
  }
  return true;
}

/**
 * Find out if the node is a valid candidate for our rules
 *
 * @param {ASTNode} node The AST node being checked
 * @returns {Boolean}
 */
function isValidVueAttribute(node) {
  if (!isVueClassAttribute(node)) {
    // Only run for class attributes
    return false;
  }
  if (!isVueLiteralAttributeValue(node)) {
    // No support for dynamic or conditional classnames
    return false;
  }
  return true;
}

function extractRangeFromNode(node) {
  if (node.type === 'TextAttribute' && node.name === 'class') {
    return [node.valueSpan.fullStart.offset, node.valueSpan.end.offset];
  }
  switch (node.value.type) {
    case 'JSXExpressionContainer':
      return node.value.expression.range;
    default:
      return node.value.range;
  }
}

function extractValueFromNode(node) {
  if (node.type === 'TextAttribute' && node.name === 'class') {
    return node.value;
  }
  switch (node.value.type) {
    case 'JSXExpressionContainer':
      return node.value.expression.value;
    default:
      return node.value.value;
  }
}

function extractClassnamesFromValue(classStr) {
  if (typeof classStr !== 'string') {
    return { classNames: [], whitespaces: [], headSpace: false, tailSpace: false };
  }
  const separatorRegEx = /(\s+)/;
  let parts = classStr.split(separatorRegEx);
  if (parts[0] === '') {
    parts.shift();
  }
  if (parts[parts.length - 1] === '') {
    parts.pop();
  }
  let headSpace = separatorRegEx.test(parts[0]);
  let tailSpace = separatorRegEx.test(parts[parts.length - 1]);
  const isClass = (_, i) => (headSpace ? i % 2 !== 0 : i % 2 === 0);
  const isNotClass = (_, i) => (headSpace ? i % 2 === 0 : i % 2 !== 0);
  let classNames = parts.filter(isClass);
  let whitespaces = parts.filter(isNotClass);
  return { classNames: classNames, whitespaces: whitespaces, headSpace: headSpace, tailSpace: tailSpace };
}

/**
 * Inspect and parse an abstract syntax node and run a callback function
 *
 * @param {ASTNode} arg The AST node child argument being checked
 * @param {ASTNode} node The current root node being parsed by eslint
 * @param {Function} cb The callback function
 * @param {Boolean} skipConditional Optional, indicate distinct parsing for conditional nodes
 * @param {Boolean} isolate Optional, set internally to isolate parsing and validation on conditional children
 * @returns {void}
 */
function parseNodeRecursive(node, arg, cb, skipConditional = false, isolate = false) {
  let originalClassNamesValue;
  let classNames;
  if (arg === null) {
    originalClassNamesValue = extractValueFromNode(node);
    ({ classNames } = extractClassnamesFromValue(originalClassNamesValue));
    classNames = removeDuplicatesFromArray(classNames);
    if (classNames.length === 0) {
      // Don't run for empty className
      return;
    }
    cb(classNames, node);
  } else if (arg === undefined) {
    // Ignore invalid child candidates (probably inside complex TemplateLiteral)
    return;
  } else {
    const forceIsolation = skipConditional ? true : isolate;
    let trim = false;
    switch (arg.type) {
      case 'TemplateLiteral':
        arg.expressions.forEach((exp) => {
          parseNodeRecursive(node, exp, cb, skipConditional, forceIsolation);
        });
        arg.quasis.forEach((quasis) => {
          parseNodeRecursive(node, quasis, cb, skipConditional, isolate);
        });
        return;
      case 'ConditionalExpression':
        parseNodeRecursive(node, arg.consequent, cb, skipConditional, forceIsolation);
        parseNodeRecursive(node, arg.alternate, cb, skipConditional, forceIsolation);
        return;
      case 'LogicalExpression':
        parseNodeRecursive(node, arg.right, cb, skipConditional, forceIsolation);
        return;
      case 'ArrayExpression':
        arg.elements.forEach((el) => {
          parseNodeRecursive(node, el, cb, skipConditional, forceIsolation);
        });
        return;
      case 'ObjectExpression':
        arg.properties.forEach((prop) => {
          parseNodeRecursive(node, prop.key, cb, skipConditional, forceIsolation);
        });
        return;
      case 'Literal':
        trim = true;
        originalClassNamesValue = arg.value;
        break;
      case 'TemplateElement':
        originalClassNamesValue = arg.value.raw;
        break;
    }
    ({ classNames } = extractClassnamesFromValue(originalClassNamesValue));
    classNames = removeDuplicatesFromArray(classNames);
    if (classNames.length === 0) {
      // Don't run for empty className
      return;
    }
    const targetNode = isolate ? null : node;
    cb(classNames, targetNode);
  }
}

function getTemplateElementPrefix(text, raw) {
  const idx = text.indexOf(raw);
  if (idx === 0) {
    return '';
  }
  return text.split(raw).shift();
}

function getTemplateElementSuffix(text, raw) {
  if (text.indexOf(raw) === -1) {
    return '';
  }
  return text.split(raw).pop();
}

function getTemplateElementBody(text, prefix, suffix) {
  let arr = text.split(prefix);
  arr.shift();
  let body = arr.join(prefix);
  arr = body.split(suffix);
  arr.pop();
  return arr.join(suffix);
}

module.exports = {
  extractRangeFromNode,
  extractValueFromNode,
  extractClassnamesFromValue,
  isClassAttribute,
  isLiteralAttributeValue,
  isValidJSXAttribute,
  isValidVueAttribute,
  parseNodeRecursive,
  getTemplateElementPrefix,
  getTemplateElementSuffix,
  getTemplateElementBody,
};
