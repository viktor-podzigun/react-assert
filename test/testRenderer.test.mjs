import React from "react";
import TestRenderer from "react-test-renderer";
import { TestComp, TestComp2 } from "./testComponents.mjs";

import { strict as assert } from "node:assert";
const { describe, it } = await (async () => {
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import("node:test");
})();

const h = React.createElement;

describe("testRenderer.test.mjs", () => {
  it("should fail if not found when findByType", () => {
    //given
    const comp = TestRenderer.create(h(TestComp)).root;
    /** @type {Error?} */
    let resError = null;

    //when
    try {
      comp.findByType("button");
    } catch (error) {
      resError = error;
    }

    //then
    assert.deepEqual(
      resError?.message,
      'No instances found with node type: "button"'
    );
  });

  it("should find nested simple component when findByType", () => {
    //given
    const comp = TestRenderer.create(
      h(TestComp, {}, h(TestComp, {}, h("button", { show: true })))
    ).root;

    //when
    const result = comp.findByType("button");

    //then
    assert.deepEqual(result.props.show, true);
  });

  it("should find nested react component when findByType", () => {
    //given
    const comp = TestRenderer.create(
      h(TestComp, {}, h(TestComp2, { show: true }))
    ).root;

    //when
    const result = comp.findByType(TestComp2);

    //then
    assert.deepEqual(result.props.show, true);
  });
});
