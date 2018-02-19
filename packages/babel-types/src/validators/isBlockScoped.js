// @flow
import {
  isClassDeclaration,
  isMixinDeclaration,
  isFunctionDeclaration,
} from "./generated";
import isLet from "./isLet";

/**
 * Check if the input `node` is block scoped.
 */
export default function isBlockScoped(node: Object): boolean {
  return (
    isFunctionDeclaration(node) ||
    isClassDeclaration(node) ||
    isMixinDeclaration(node) ||
    isLet(node)
  );
}
