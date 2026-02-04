import React, { useLayoutEffect, useState } from "react";
import TestRenderer from "react-test-renderer";
import assert from "node:assert/strict";
import { actAsync, assertComponents, mockComponent } from "../index.mjs";
import { TestComp, TestComp2 } from "./testComponents.mjs";

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
      "Components count doesn't match\n\tactual:   3\n\texpected: 2",
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
        "\n\texpected: TestComp2",
    );
  });

  it("should not fail if components match", () => {
    //given
    const Comp1 = mockComponent(TestComp);
    const Comp2 = mockComponent(TestComp2);
    const Comp = () => {
      return h(Comp1, {}, h("div"), h(Comp2));
    };
    const comp = TestRenderer.create(h(Comp)).root;
    /** @type {Error?} */
    let resError = null;

    //when
    try {
      assertComponents(comp.children, h(Comp1, {}, h("div"), h(Comp2)));
    } catch (error) {
      resError = error;
    }

    //then
    assert.deepEqual(resError, null);
  });

  it("should not fail if components match async", async () => {
    //given
    const Comp1 = mockComponent(TestComp);
    const Comp2 = mockComponent(TestComp2);
    const Comp = () => {
      const [_, setState] = useState(0);
      useLayoutEffect(() => {
        Promise.resolve().then(() => {
          setState(123);
        });
      }, []);

      return h(Comp1, {}, h("div"), h(Comp2));
    };

    //when
    const result = (
      await actAsync(() => {
        return TestRenderer.create(h(Comp));
      })
    ).root;

    //then
    assertComponents(result.children, h(Comp1, {}, h("div"), h(Comp2)));
  });
});
