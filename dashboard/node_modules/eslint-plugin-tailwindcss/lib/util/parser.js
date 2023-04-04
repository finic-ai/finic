/**
 * @see parserServices https://eslint.org/docs/developer-guide/working-with-rules#the-context-object
 * @param {Object} context
 * @param {Function} templateBodyVisitor
 * @param {Function} scriptVisitor
 * @returns
 */
function defineTemplateBodyVisitor(context, templateBodyVisitor, scriptVisitor) {
  if (context.parserServices == null || context.parserServices.defineTemplateBodyVisitor == null) {
    // Default parser
    return scriptVisitor;
  }

  // Using "vue-eslint-parser" requires this setup
  // @see https://eslint.org/docs/developer-guide/working-with-rules#the-context-object
  return context.parserServices.defineTemplateBodyVisitor(templateBodyVisitor, scriptVisitor);
}

module.exports = {
  defineTemplateBodyVisitor,
};
