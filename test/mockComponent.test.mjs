import React from "react";
import assert from "node:assert/strict";
import { mockComponent } from "../index.mjs";
import { TestComp } from "./testComponents.mjs";

const { describe, it } = await (async () => {
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import("node:test");
})();

const h = React.createElement;

const Comp = () => {
  return h(React.Fragment, null, "test_text", h("div"), h(TestComp));
};

describe("mockComponent.test.mjs", () => {
  it("should return generic Mock string", () => {
    //when & then
    assert.deepEqual(mockComponent(Comp), "Mock");
  });

  it("should return provided name", () => {
    //when & then
    assert.deepEqual(mockComponent(Comp, "MyMock"), "MyMock");
  });

  it("should return component's displayName + Mock", () => {
    //when & then
    assert.deepEqual(mockComponent(TestComp), "TestCompMock");
  });
});
