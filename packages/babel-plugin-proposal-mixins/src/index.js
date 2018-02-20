import { types as t } from "@babel/core";
import MixinSyntaxPlugin from "@babel/plugin-syntax-mixins";
const filesInsertedInto = new Set();

export default function() {
  return {
    inherits: MixinSyntaxPlugin,
    visitor: {
      ClassDeclaration(path) {
        const { node } = path;
        if (node.mixinApplications && node.mixinApplications.length > 0) {
          const newSuper = node.mixinApplications.reduceRight(
            (s, m) => t.callExpression(t.cloneNode(m), [s]),
            t.cloneNode(node.superClass),
          );
          node.superClass = newSuper;
        }
      },

      MixinDeclaration(path, { file }) {
        insertDefineSymbolMixin(file);
        path.replaceWith(makeClassFactory(path.node.id, path.node));
      },

      MixinExpression(path, { file }) {
        const id = path.scope.generateUidIdentifierBasedOnNode(path.node);
        insertDefineSymbolMixin(file);
        path.replaceWith(
          t.callExpression(
            t.arrowFunctionExpression(
              [],
              t.blockStatement([
                makeClassFactory(id, path.node),
                t.returnStatement(t.cloneNode(id)),
              ]),
            ),
            [],
          ),
        );
      },
    },
  };
}

function insertDefineSymbolMixin(file) {
  if (filesInsertedInto.has(file)) {
    return;
  }
  filesInsertedInto.add(file);
  const defineSymbolMixin = t.expressionStatement(
    t.assignmentExpression(
      "=",
      t.memberExpression(t.identifier("Symbol"), t.identifier("mixin")),
      t.logicalExpression(
        "||",
        t.memberExpression(t.identifier("Symbol"), t.identifier("mixin")),
        t.callExpression(t.identifier("Symbol"), [t.stringLiteral("mixin")]),
      ),
    ),
  );
  file.scope.path.unshiftContainer("body", defineSymbolMixin);
}

function makeClassFactory(id, node) {
  const clone = t.cloneNode(node);
  const innerClassId = t.identifier("_" + id.name);
  const baseParam = t.identifier("base");

  return t.variableDeclaration("let", [
    t.variableDeclarator(
      id,
      t.arrowFunctionExpression(
        [baseParam],
        t.blockStatement([
          t.classDeclaration(
            t.cloneNode(innerClassId),
            clone.superClass,
            clone.body,
            clone.decorators,
          ),
          t.expressionStatement(
            t.callExpression(
              t.memberExpression(
                t.identifier("Object"),
                t.identifier("defineProperty"),
              ),
              [
                t.memberExpression(
                  t.cloneNode(innerClassId),
                  t.identifier("prototype"),
                ),
                t.memberExpression(
                  t.identifier("Symbol"),
                  t.identifier("mixin"),
                ),
                t.objectExpression([
                  t.objectProperty(t.identifier("value"), t.cloneNode(id)),
                ]),
              ],
            ),
          ),
          t.returnStatement(t.cloneNode(innerClassId)),
        ]),
      ),
    ),
  ]);
}
