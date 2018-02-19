# @babel/plugin-syntax-mixins

> Allow parsing of mixins.

## Installation

```sh
npm install --save-dev @babel/plugin-syntax-mixins
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
  "plugins": ["@babel/plugin-syntax-mixins"]
}
```

### Via CLI

```sh
babel --plugins @babel/plugin-syntax-mixins script.js
```

### Via Node API

```javascript
require("@babel/core").transform("code", {
  plugins: ["@babel/plugin-syntax-mixins"]
});
```
