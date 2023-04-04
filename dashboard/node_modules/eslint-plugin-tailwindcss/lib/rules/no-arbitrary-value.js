/**
 * @fileoverview Forbid using arbitrary values in classnames
 * @author François Massart
 */
'use strict';

const docsUrl = require('../util/docsUrl');
const customConfig = require('../util/customConfig');
const astUtil = require('../util/ast');
const groupUtil = require('../util/groupMethods');
const getOption = require('../util/settings');
const parserUtil = require('../util/parser');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

// Predefine message for use in context.report conditional.
// messageId will still be usable in tests.
const ARBITRARY_VALUE_DETECTED_MSG = `Arbitrary value detected in '{{classname}}'`;

module.exports = {
  meta: {
    docs: {
      description: 'Forbid using arbitrary values in classnames',
      category: 'Best Practices',
      recommended: false,
      url: docsUrl('no-arbitrary-value'),
    },
    messages: {
      arbitraryValueDetected: ARBITRARY_VALUE_DETECTED_MSG,
    },
    fixable: null,
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

    const mergedConfig = customConfig.resolve(twConfig);

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    /**
     * Recursive function crawling into child nodes
     * @param {ASTNode} node The root node of the current parsing
     * @param {ASTNode} arg The child node of node
     * @returns {void}
     */
    const parseForArbitraryValues = (node, arg = null) => {
      let originalClassNamesValue = null;
      if (arg === null) {
        originalClassNamesValue = astUtil.extractValueFromNode(node);
      } else {
        switch (arg.type) {
          case 'Identifier':
            return;
          case 'TemplateLiteral':
            arg.expressions.forEach((exp) => {
              parseForArbitraryValues(node, exp);
            });
            arg.quasis.forEach((quasis) => {
              parseForArbitraryValues(node, quasis);
            });
            return;
          case 'ConditionalExpression':
            parseForArbitraryValues(node, arg.consequent);
            parseForArbitraryValues(node, arg.alternate);
            return;
          case 'LogicalExpression':
            parseForArbitraryValues(node, arg.right);
            return;
          case 'ArrayExpression':
            arg.elements.forEach((el) => {
              parseForArbitraryValues(node, el);
            });
            return;
          case 'ObjectExpression':
            arg.properties.forEach((prop) => {
              parseForArbitraryValues(node, prop.key);
            });
            return;
          case 'Literal':
            originalClassNamesValue = arg.value;
            break;
          case 'TemplateElement':
            originalClassNamesValue = arg.value.raw;
            if (originalClassNamesValue === '') {
              return;
            }
            break;
        }
      }

      let { classNames } = astUtil.extractClassnamesFromValue(originalClassNamesValue);
      const forbidden = [];
      classNames.forEach((cls, idx) => {
        const parsed = groupUtil.parseClassname(cls, [], mergedConfig, idx);
        if (/\[.*\]/i.test(parsed.name)) {
          forbidden.push(parsed.name);
        }
      });

      forbidden.forEach((forbiddenClass) => {
        context.report({
          node,
          messageId: 'arbitraryValueDetected',
          data: {
            classname: forbiddenClass,
          },
        });
      });
    };

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    const attributeVisitor = function (node) {
      if (!astUtil.isClassAttribute(node)) {
        return;
      }
      if (astUtil.isLiteralAttributeValue(node)) {
        parseForArbitraryValues(node);
      } else if (node.value && node.value.type === 'JSXExpressionContainer') {
        parseForArbitraryValues(node, node.value.expression);
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
          parseForArbitraryValues(node, arg);
        });
      },
      TaggedTemplateExpression: function (node) {
        if (!tags.includes(node.tag.name)) {
          return;
        }
        parseForArbitraryValues(node, node.quasi);
      },
    };

    const templateVisitor = {
      VAttribute: function (node) {
        if (!astUtil.isValidVueAttribute(node)) {
          return;
        }
        parseForArbitraryValues(node);
      },
    };

    return parserUtil.defineTemplateBodyVisitor(context, templateVisitor, scriptVisitor);
  },
};
