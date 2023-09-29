import React from "react";
import TestRenderer from "react-test-renderer";
import { assertComponents } from "../index.mjs";
import { TestComp, TestComp2 } from "./testComponents.mjs";

import { strict as assert } from "node:assert";
const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

const h = React.createElement;

describe("assertComponents.test.mjs", () => {
  it("should fail if components count doesn't match", () => {
    //given
    const Comp = () => {
      return h(React.Fragment, null, "test_text", h("div"), h(TestComp));
    };
    const comp = TestRenderer.create(h(Comp)).root;
    /** @type {Error?} */
    let resError = null;

    //when
    try {
      assertComponents(comp.children, h("div"), "test_text");
    } catch (error) {
      resError = error;
    }

    //then
    assert.deepEqual(
      resError?.message,
      "Components count doesn't match\n\tactual:   3\n\texpected: 2"
    );
  });

  it("should fail if component child doesn't match", () => {
    //given
    const Comp = () => {
      return h("p", {}, h("comp"), h(TestComp));
    };
    const comp = TestRenderer.create(h(Comp)).root;
    /** @type {Error?} */
    let resError = null;

    //when
    try {
      assertComponents(comp.children, h("p", {}, h("comp"), h(TestComp2)));
    } catch (error) {
      resError = error;
    }

    //then
    assert.deepEqual(
      resError?.message,
      "Component type doesn't match for p > TestComp2" +
        "\n\tactual:   TestComp" +
        "\n\texpected: TestComp2"
    );
  });
});
