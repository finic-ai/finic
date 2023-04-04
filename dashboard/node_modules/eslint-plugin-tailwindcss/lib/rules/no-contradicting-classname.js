/**
 * @fileoverview Avoid contradicting Tailwind CSS classnames (e.g. "w-3 w-5")
 * @author François Massart
 */
'use strict';

const docsUrl = require('../util/docsUrl');
const defaultGroups = require('../config/groups').groups;
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
const CONFLICTING_CLASSNAMES_DETECTED_MSG = `Classnames {{classnames}} are conflicting!`;

module.exports = {
  meta: {
    docs: {
      description: 'Avoid contradicting Tailwind CSS classnames (e.g. "w-3 w-5")',
      category: 'Possible Errors',
      recommended: false,
      url: docsUrl('no-contradicting-classname'),
    },
    messages: {
      conflictingClassnames: CONFLICTING_CLASSNAMES_DETECTED_MSG,
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

    // Init assets before sorting
    const groups = groupUtil.getGroups(defaultGroups, mergedConfig);

    /**
     * Parse the classnames and report found conflicts
     * @param {Array} classNames
     * @param {ASTNode} node
     */
    const parseForContradictingClassNames = (classNames, node) => {
      // Init assets before sorting
      const sorted = groupUtil.initGroupSlots(groups);

      // Move each classname inside its dedicated group
      classNames.forEach((className) => {
        const idx = groupUtil.getGroupIndex(className, groups, mergedConfig.separator);
        if (idx > -1) {
          sorted[idx].push(className);
        }
      });

      // Only multiple classNames
      const sortedGroups = sorted.filter((slot) => slot.length > 1);
      const arbitraryPropsGroupIndex = sortedGroups.findIndex((slot) => {
        const suffix = groupUtil.getSuffix(slot[0], mergedConfig.separator);
        return groupUtil.getArbitraryProperty(suffix, mergedConfig.separator) !== '';
      });

      // Sorts each groups' classnames
      const ambiguousArbitraryValuesOrClasses = String.raw`(\[(.*${mergedConfig.separator}))|(^((?!:).)*$)`;

      sortedGroups.forEach((group, groupIndex) => {
        const variants = [];
        group.forEach((cls) => {
          const prefix = groupUtil.getPrefix(cls, mergedConfig.separator);
          const name = cls.substr(prefix.length);
          if (groupIndex === arbitraryPropsGroupIndex) {
            // Arbitrary Props
            const arbitraryProp = groupUtil.getArbitraryProperty(name, mergedConfig.separator);
            const identifier = prefix + arbitraryProp;
            const idx = variants.findIndex((v) => identifier === v.prefix);
            if (idx === -1) {
              variants.push({
                prefix: identifier,
                name: [name],
              });
            } else {
              variants[idx].name.push(name);
            }
          } else {
            // "Regular classNames"
            const rePrefix = prefix === '' ? ambiguousArbitraryValuesOrClasses : '^' + prefix;
            const idx = variants.findIndex((v) => v.prefix === rePrefix);
            if (idx === -1) {
              variants.push({
                prefix: rePrefix,
                name: [name],
              });
            } else {
              variants[idx].name.push(name);
            }
          }
        });

        // Several classNames with the same prefix
        const potentialTroubles = variants.filter((v) => v.name.length > 1);
        if (potentialTroubles.length) {
          potentialTroubles.forEach((variantGroup) => {
            const re = new RegExp(variantGroup.prefix);
            const conflicting = group.filter((c) => re.test(c));
            context.report({
              node: node,
              messageId: 'conflictingClassnames',
              data: {
                classnames: conflicting.join(', '),
              },
            });
          });
        }
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
        astUtil.parseNodeRecursive(node, null, parseForContradictingClassNames, true);
      } else if (node.value && node.value.type === 'JSXExpressionContainer') {
        astUtil.parseNodeRecursive(node, node.value.expression, parseForContradictingClassNames, true);
      }
    };

    const scriptVisitor = {
      JSXAttribute: attributeVisitor,
      TextAttribute: attributeVisitor,
      CallExpression: function (node) {
        if (callees.findIndex((name) => node.callee.name === name) === -1) {
          return;
        }
        const allClassnamesForNode = [];
        const pushClasses = (classNames, targetNode) => {
          if (targetNode === null) {
            // Classnames should be parsed in isolation (e.g. conditional expressions)
            parseForContradictingClassNames(classNames, node);
          } else {
            // Gather the classes prior to validation
            allClassnamesForNode.push(...classNames);
          }
        };
        node.arguments.forEach((arg) => {
          astUtil.parseNodeRecursive(node, arg, pushClasses, true);
        });
        parseForContradictingClassNames(allClassnamesForNode, node);
      },
      TaggedTemplateExpression: function (node) {
        if (!tags.includes(node.tag.name)) {
          return;
        }

        const allClassnamesForNode = [];
        const pushClasses = (classNames, targetNode) => {
          if (targetNode === null) {
            // Classnames should be parsed in isolation (e.g. conditional expressions)
            parseForContradictingClassNames(classNames, node);
          } else {
            // Gather the classes prior to validation
            allClassnamesForNode.push(...classNames);
          }
        };
        astUtil.parseNodeRecursive(node, node.quasi, pushClasses, true);
        parseForContradictingClassNames(allClassnamesForNode, node);
      },
    };

    const templateVisitor = {
      VAttribute: function (node) {
        if (!astUtil.isValidVueAttribute(node)) {
          return;
        }
        astUtil.parseNodeRecursive(node, null, parseForContradictingClassNames, true);
      },
    };

    return parserUtil.defineTemplateBodyVisitor(context, templateVisitor, scriptVisitor);
  },
};
