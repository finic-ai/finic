/**
 * @fileoverview Rules enforcing best practices while using Tailwind CSS
 * @author François Massart
 */
'use strict';

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

// import all rules in lib/rules
var base = __dirname + '/rules/';
module.exports = {
  rules: {
    'classnames-order': require(base + 'classnames-order'),
    'enforces-negative-arbitrary-values': require(base + 'enforces-negative-arbitrary-values'),
    'enforces-shorthand': require(base + 'enforces-shorthand'),
    'migration-from-tailwind-2': require(base + 'migration-from-tailwind-2'),
    'no-arbitrary-value': require(base + 'no-arbitrary-value'),
    'no-contradicting-classname': require(base + 'no-contradicting-classname'),
    'no-custom-classname': require(base + 'no-custom-classname'),
  },
  configs: {
    recommended: {
      plugins: ['tailwindcss'],
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      rules: {
        'tailwindcss/classnames-order': 'warn',
        'tailwindcss/enforces-negative-arbitrary-values': 'warn',
        'tailwindcss/enforces-shorthand': 'warn',
        'tailwindcss/migration-from-tailwind-2': 'warn',
        'tailwindcss/no-arbitrary-value': 'off',
        'tailwindcss/no-custom-classname': 'warn',
        'tailwindcss/no-contradicting-classname': 'error',
      },
    },
  },
};
