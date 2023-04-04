/**
 * @fileoverview Use a consistent orders for the Tailwind CSS classnames, based on property then on variants
 * @author François Massart
 */
'use strict';

const docsUrl = require('../util/docsUrl');
const customConfig = require('../util/customConfig');
const astUtil = require('../util/ast');
const removeDuplicatesFromClassnamesAndWhitespaces = require('../util/removeDuplicatesFromClassnamesAndWhitespaces');
const getOption = require('../util/settings');
const parserUtil = require('../util/parser');
const order = require('../util/prettier/order');
const createContextFallback = require('tailwindcss/lib/lib/setupContextUtils').createContext;

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

// Predefine message for use in context.report conditional.
// messageId will still be usable in tests.
const INVALID_CLASSNAMES_ORDER_MSG = 'Invalid Tailwind CSS classnames order';

const contextFallbackCache = new WeakMap();

module.exports = {
  meta: {
    docs: {
      description: 'Enforce a consistent and logical order of the Tailwind CSS classnames',
      category: 'Stylistic Issues',
      recommended: false,
      url: docsUrl('classnames-order'),
    },
    messages: {
      invalidOrder: INVALID_CLASSNAMES_ORDER_MSG,
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          callees: {
            type: 'array',
            items: { type: 'string', minLength: 0 },
            uniqueItems: true,
          },
          config: {
            default: 'tailwind.config.js',
            type: ['string', 'object'],
          },
          removeDuplicates: {
            default: true,
            type: 'boolean',
          },
          tags: {
            type: 'array',
            items: { type: 'string', minLength: 0 },
            uniqueItems: true,
          },
        },
      },
    ],
  },

  create: function (context) {
    const callees = getOption(context, 'callees');
    const tags = getOption(context, 'tags');
    const twConfig = getOption(context, 'config');
    const removeDuplicates = getOption(context, 'removeDuplicates');

    const mergedConfig = customConfig.resolve(twConfig);
    const contextFallback = // Set the created contextFallback in the cache if it does not exist yet.
      (
        contextFallbackCache.has(mergedConfig)
          ? contextFallbackCache
          : contextFallbackCache.set(mergedConfig, createContextFallback(mergedConfig))
      ).get(mergedConfig);

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------
    /**
     * Recursive function crawling into child nodes
     * @param {ASTNode} node The root node of the current parsing
     * @param {ASTNode} arg The child node of node
     * @returns {void}
     */
    const sortNodeArgumentValue = (node, arg = null) => {
      let originalClassNamesValue = null;
      let start = null;
      let end = null;
      let prefix = '';
      let suffix = '';
      if (arg === null) {
        originalClassNamesValue = astUtil.extractValueFromNode(node);
        const range = astUtil.extractRangeFromNode(node);
        if (node.type === 'TextAttribute') {
          start = range[0];
          end = range[1];
        } else {
          start = range[0] + 1;
          end = range[1] - 1;
        }
      } else {
        switch (arg.type) {
          case 'Identifier':
            return;
          case 'TemplateLiteral':
            arg.expressions.forEach((exp) => {
              sortNodeArgumentValue(node, exp);
            });
            arg.quasis.forEach((quasis) => {
              sortNodeArgumentValue(node, quasis);
            });
            return;
          case 'ConditionalExpression':
            sortNodeArgumentValue(node, arg.consequent);
            sortNodeArgumentValue(node, arg.alternate);
            return;
          case 'LogicalExpression':
            sortNodeArgumentValue(node, arg.right);
            return;
          case 'ArrayExpression':
            arg.elements.forEach((el) => {
              sortNodeArgumentValue(node, el);
            });
            return;
          case 'ObjectExpression':
            arg.properties.forEach((prop) => {
              sortNodeArgumentValue(node, prop.key);
            });
            return;
          case 'Literal':
            originalClassNamesValue = arg.value;
            start = arg.range[0] + 1;
            end = arg.range[1] - 1;
            break;
          case 'TemplateElement':
            originalClassNamesValue = arg.value.raw;
            if (originalClassNamesValue === '') {
              return;
            }
            start = arg.range[0];
            end = arg.range[1];
            // https://github.com/eslint/eslint/issues/13360
            // The problem is that range computation includes the backticks (`test`)
            // but value.raw does not include them, so there is a mismatch.
            // start/end does not include the backticks, therefore it matches value.raw.
            const txt = context.getSourceCode().getText(arg);
            prefix = astUtil.getTemplateElementPrefix(txt, originalClassNamesValue);
            suffix = astUtil.getTemplateElementSuffix(txt, originalClassNamesValue);
            originalClassNamesValue = astUtil.getTemplateElementBody(txt, prefix, suffix);
            break;
        }
      }

      let { classNames, whitespaces, headSpace, tailSpace } =
        astUtil.extractClassnamesFromValue(originalClassNamesValue);

      if (classNames.length <= 1) {
        // Don't run sorting for a single or empty className
        return;
      }

      let orderedClassNames = order(classNames, contextFallback).split(' ');

      if (removeDuplicates) {
        removeDuplicatesFromClassnamesAndWhitespaces(orderedClassNames, whitespaces, headSpace, tailSpace);
      }

      // Generates the validated/sorted attribute value
      let validatedClassNamesValue = '';
      for (let i = 0; i < orderedClassNames.length; i++) {
        const w = whitespaces[i] ?? '';
        const cls = orderedClassNames[i];
        validatedClassNamesValue += headSpace ? `${w}${cls}` : `${cls}${w}`;
        if (headSpace && tailSpace && i === orderedClassNames.length - 1) {
          validatedClassNamesValue += whitespaces[whitespaces.length - 1] ?? '';
        }
      }

      if (originalClassNamesValue !== validatedClassNamesValue) {
        validatedClassNamesValue = prefix + validatedClassNamesValue + suffix;
        context.report({
          node: node,
          messageId: 'invalidOrder',
          fix: function (fixer) {
            return fixer.replaceTextRange([start, end], validatedClassNamesValue);
          },
        });
      }
    };

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    const attributeVisitor = function (node) {
      if (!astUtil.isClassAttribute(node)) {
        return;
      }
      if (astUtil.isLiteralAttributeValue(node)) {
        sortNodeArgumentValue(node);
      } else if (node.value && node.value.type === 'JSXExpressionContainer') {
        sortNodeArgumentValue(node, node.value.expression);
      }
    };

    const scriptVisitor = {
      JSXAttribute: attributeVisitor,
      TextAttribute: attributeVisitor,
      CallExpression: function (node) {
        if (callees.findIndex((name) => node.callee.name === name) === -1) {
          return;
        }

        node.arguments.forEach((arg) => {
          sortNodeArgumentValue(node, arg);
        });
      },
      TaggedTemplateExpression: function (node) {
        if (!tags.includes(node.tag.name)) {
          return;
        }

        sortNodeArgumentValue(node, node.quasi);
      },
    };
    const templateVisitor = {
      VAttribute: function (node) {
        if (!astUtil.isValidVueAttribute(node)) {
          return;
        }
        sortNodeArgumentValue(node);
      },
    };

    return parserUtil.defineTemplateBodyVisitor(context, templateVisitor, scriptVisitor);
  },
};
