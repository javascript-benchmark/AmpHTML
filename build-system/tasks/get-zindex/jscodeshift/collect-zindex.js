const zIndexRegExp = /^z-?index$/i;

/**
 * @param {*} node
 * @return {string|undefined}
 */
function getCallExpressionZIndexValue(node) {
  for (let i = 1; i < node.arguments.length; i++) {
    const argument = node.arguments[i];
    const previous = node.arguments[i - 1];
    if (
      argument.type.endsWith('Literal') &&
      argument.value !== '' &&
      zIndexRegExp.test(previous.value)
    ) {
      return argument.value;
    }
  }
}

/**
 * @param {*} file
 * @param {*} node
 * @return {string}
 */
function source(file, node) {
  const {end, start} = node;
  return file.source.substr(start, end - start);
}

/**
 * @param {*} file
 * @param {*} path
 * @return {string}
 */
function chainId(file, path) {
  let propertyChain = '';
  let at = path;

  while (at && at.value && at.value.type.endsWith('Property')) {
    const part = source(file, at.value.key);
    if (at.value.key.type === 'Identifier') {
      propertyChain = `.${part}` + propertyChain;
    } else {
      propertyChain = `[${part}]` + propertyChain;
    }
    at = at.parent && at.parent.parent;
  }

  while (
    at &&
    at.parent &&
    at.value.type !== 'CallExpression' &&
    at.value.type !== 'VariableDeclarator' &&
    at.value.type !== 'AssignmentExpression' &&
    at.value.type !== 'JSXAttribute' &&
    at.value.type !== 'Program'
  ) {
    at = at.parent;
  }

  if (at.value.type === 'JSXAttribute') {
    const openingElement = source(file, at.parent.value.name);
    return `<${openingElement} />`;
  }

  if (at.value.type === 'CallExpression') {
    return source(file, at.value.callee);
  }

  if (at.value.type === 'AssignmentExpression') {
    return source(file, at.value.left) + propertyChain;
  }

  if (at.value.type === 'VariableDeclarator') {
    return source(file, at.value.id) + propertyChain;
  }

  return '(unknown)';
}

module.exports = function (file, api) {
  const j = api.jscodeshift;

  const report = [];

  j(file.source)
    .find(
      j.ObjectProperty,
      (node) =>
        node.key &&
        node.value.type.endsWith('Literal') &&
        node.value.value !== '' &&
        zIndexRegExp.test(node.key.value || node.key.name)
    )
    .forEach((path) => {
      report.push([chainId(file, path.parent.parent), path.value.value.value]);
    });

  j(file.source)
    .find(
      j.CallExpression,
      (node) => getCallExpressionZIndexValue(node) != null
    )
    .forEach((path) => {
      report.push([
        chainId(file, path),
        getCallExpressionZIndexValue(path.value),
      ]);
    });

  api.report(JSON.stringify(report));

  return file.source;
};
