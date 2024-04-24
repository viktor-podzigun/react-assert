import React from "react";
import TestRenderer from "react-test-renderer";
import { assertComponents, mockComponent } from "../index.mjs";

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

function SubComponent() {
  return <p className="sub">Sub</p>;
}
SubComponent.displayName = "SubComponent";

// @ts-ignore
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

describe("MyComponent", () => {
  it("should render nested components", () => {
    //given
    const text = "Hello";

    //when
    const result = TestRenderer.create(<MyComponent text={text} />).root;

    //then
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
});
