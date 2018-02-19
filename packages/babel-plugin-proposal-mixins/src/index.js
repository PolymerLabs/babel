import { types as t } from "@babel/core";

export default function() {
  return {
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

      MixinDeclaration(path) {
        const { node } = path;
        const clone = t.cloneNode(node);
        const innerClassId = t.identifier("_" + node.id.name);
        const baseParam = t.identifier("base");

        path.replaceWithMultiple([
          t.expressionStatement(
            t.assignmentExpression(
              "=",
              t.memberExpression(t.identifier("Symbol"), t.identifier("mixin")),
              t.logicalExpression(
                "||",
                t.memberExpression(
                  t.identifier("Symbol"),
                  t.identifier("mixin"),
                ),
                t.callExpression(t.identifier("Symbol"), [
                  t.stringLiteral("mixin"),
                ]),
              ),
            ),
          ),
          t.variableDeclaration("let", [
            t.variableDeclarator(
              node.id,
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
                          t.objectProperty(
                            t.identifier("value"),
                            t.cloneNode(node.id),
                          ),
                        ]),
                      ],
                    ),
                  ),
                  t.returnStatement(t.cloneNode(innerClassId)),
                ]),
              ),
            ),
          ]),
        ]);
      },

      // MixinExpression(path, state) {
      // },
    },
  };
}
