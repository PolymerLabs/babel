# @babel/plugin-proposal-mixins

> Compile mixins to class factories

## Proposal

Mixins are a State 1 proposal with ECMA TC39. Stage 1 only indicates that the
committee is interested in a problem space, not that a proposal is likely to
advance. Stage 1 proposals may not have all semantics defined, thus this plugin
is extremely speculative.

The current proposal is located here: https://github.com/justinfagnani/proposal-mixins

## Examples

**In**

```javascript
mixin Greeter {
  constructor(name) {
    this.name = name;
  }

  greet() {
    console.log("Hello", this.name);
  }
}

class C extends Greeter(Object) {}
```

**Out**

```javascript
Symbol.mixin = Symbol.mixin || Symbol("mixin");

let Greeter = base => {
  class _Greeter {
    constructor(name) {
      this.name = name;
    }

    greet() {
      console.log("Hello", this.name);
    }

  }

  Object.defineProperty(_Greeter.prototype, Symbol.mixin, {
    value: Greeter
  });
  return _Greeter;
};

class C extends Greeter(Object) {}
```

## Installation

```sh
npm install --save-dev @babel/plugin-proposal-mixins
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```js
{
  "plugins": ["@babel/plugin-proposal-mixins"]
}
```

### Via CLI

```sh
babel --plugins @babel/plugin-proposal-mixins script.js
```

### Via Node API

```javascript
require("@babel/core").transform("code", {
  plugins: ["@babel/plugin-proposal-mixins"]
});
```
