mixin M {
  foo() {
    return 'bar';
  }
}

class C extends Object with M {}
const c = new C();

assert.equal(c.foo(), 'bar');
assert.isDefined(Symbol.mixin);
assert.isTrue(Object.getPrototypeOf(C).prototype.hasOwnProperty(Symbol.mixin));
assert.equal(Object.getPrototypeOf(C).prototype[Symbol.mixin], M);

