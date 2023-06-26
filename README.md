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
import React from "react";
import TestRenderer from "react-test-renderer";
import assert from "node:assert/strict";
import mockFunction from "mock-fn";

import {
  assertComponents,
  mockComponent,
  TestErrorBoundary,
} from "react-assert";
```

Components:

```javascript
function SubComponent() {
  return <p className="sub">Sub</p>;
}
SubComponent.displayName = "SubComponent";

function MyComponent(props) {
  const { SubComp } = MyComponent;

  return (
    <div>
      <SubComp />
      <p className="my">{props.text}</p>
    </div>
  );
}
MyComponent.displayName = "MyComponent";
MyComponent.SubComp = SubComponent;
```

Tests:

```javascript
describe("MyComponent", () => {
  it("should render nested components", () => {
    //given
    const text = "Hello";

    //when
    const result = TestRenderer.create(<MyComponent text={text} />).root;

    //then
    // call assertComponents to check expected components tree
    assertComponents(
      result.children,
      <div>
        <p className="sub">Sub</p>
        <p className="my">{text}</p>
      </div>
    );
  });

  it("should render mock components", () => {
    //given
    // use mockComponent to mock nested components
    MyComponent.SubComp = mockComponent(SubComponent);
    const { SubComp } = MyComponent;
    const text = "Hello";

    //when
    const result = TestRenderer.create(<MyComponent text={text} />).root;

    //then
    assertComponents(
      result.children,
      <div>
        <SubComp />
        <p className="my">{text}</p>
      </div>
    );
  });

  it("should render error details if error during render", () => {
    //given
    // suppress intended error
    // see: https://github.com/facebook/react/issues/11098#issuecomment-412682721
    const savedConsoleError = console.error;
    const consoleErrorMock = mockFunction(() => {
      console.error = savedConsoleError;
    });
    console.error = consoleErrorMock;

    const ErrorComp = () => {
      throw Error("test error");
      return <>{"Not rendered"}</>;
    };

    //when
    const result = TestRenderer.create(
      <TestErrorBoundary>
        <ErrorComp />
      <TestErrorBoundary/>
    ).root;

    //then
    assert.deepEqual(consoleErrorMock.times, 1);
    assert.deepEqual(console.error, savedConsoleError);
    assertComponents(result.children, <div>{"Error: test error"}</div>);
  });
});
```
