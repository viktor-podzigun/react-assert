[![CI](https://github.com/viktor-podzigun/react-assert/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/viktor-podzigun/react-assert/actions/workflows/ci.yml?query=workflow%3Aci+branch%3Amain)
[![Coverage Status](https://coveralls.io/repos/github/viktor-podzigun/react-assert/badge.svg?branch=main)](https://coveralls.io/github/viktor-podzigun/react-assert?branch=main)
[![npm version](https://img.shields.io/npm/v/react-assert)](https://www.npmjs.com/package/react-assert)

## react-assert

Test utility that helps making your React.js rendering predictable.

It provides assertion utils to validate
[react-test-renderer](https://legacy.reactjs.org/docs/test-renderer.html)
output. Similar to snapshot testing but with expectations written using
familiar react rendering syntax.

### Install

```bash
npm i --save-dev react-assert
```

### Usage

Imports:

```javascript
import TestRenderer from "react-test-renderer";
import { assertComponent } from "react-assert";
```
