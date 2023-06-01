import React from "react";
import TestRenderer from "react-test-renderer";
import { assertComponents } from "../index.mjs";

const { describe, it } = await (async () => {
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import("node:test");
})();

// @ts-ignore
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
    assertComponents(
      result.children,
      <div>
        <p className="sub">Sub</p>
        <p className="my">{text}</p>
      </div>
    );
  });
});
