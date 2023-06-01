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

```javascript
import React from "react";
import TestRenderer from "react-test-renderer";

// 1. import
import { assertComponents } from "react-assert";

function MyComponent(props) {
  return (
    <div>
      <SubComponent />
      <p className="my">{props.text}</p>
    </div>
  );
}
MyComponent.displayName = "MyComponent";

function SubComponent() {
  return <p className="sub">Sub</p>;
}

describe("MyComponent", () => {
  it("should render component", () => {
    //given
    const text = "Hello";

    //when
    const result = TestRenderer.create(<MyComponent text={text} />).root;

    //then
    // 2. call it with result.children and expected components tree
    assertComponents(
      result.children,
      <div>
        <p className="sub">Sub</p>
        <p className="my">{text}</p>
      </div>
    );
  });
});
```
