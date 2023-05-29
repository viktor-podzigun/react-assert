import React from "react";
import TestRenderer from "react-test-renderer";
import { assertComponent } from "../index.mjs";
import { TestComp, TestComp2 } from "./testComponents.mjs";

import { strict as assert } from "node:assert";
const { describe, it } = await (async () => {
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import("node:test");
})();

const h = React.createElement;

describe("assertComponent.test.mjs", () => {
  it("should fail if array attribute doesn't match", () => {
    //given
    const Comp = () => {
      return h("p", { testArr: ["test1", "test2"] });
    };
    const comp = TestRenderer.create(h(Comp)).root.children[0];
    /** @type {Error?} */
    let resError = null;

    //when
    try {
      assertComponent(comp, h("p", { testArr: ["test2", "test1"] }));
    } catch (error) {
      resError = error;
    }

    //then
    assert.deepEqual(
      resError?.message,
      "Attribute value doesn't match for p.testArr" +
        "\n\tactual:   test1,test2" +
        "\n\texpected: test2,test1"
    );
  });

  it("should fail if object attribute doesn't match", () => {
    //given
    const Comp = () => {
      return h("p", {
        testObj: {
          test: 1,
        },
      });
    };
    const comp = TestRenderer.create(h(Comp)).root.children[0];
    /** @type {Error?} */
    let resError = null;

    //when
    try {
      assertComponent(comp, h("p", { testObj: { test: 2 } }));
    } catch (error) {
      resError = error;
    }

    //then
    assert.deepEqual(
      resError?.message,
      "Attribute value doesn't match for p.testObj.test" +
        "\n\tactual:   1" +
        "\n\texpected: 2"
    );
  });

  it("should fail if boolean attribute doesn't match", () => {
    //given
    const Comp = () => {
      return h("p", {
        disabled: true,
      });
    };
    const comp = TestRenderer.create(h(Comp)).root.children[0];
    /** @type {Error?} */
    let resError = null;

    //when
    try {
      assertComponent(comp, h("p", { disabled: false }));
    } catch (error) {
      resError = error;
    }

    //then
    assert.deepEqual(
      resError?.message,
      "Attribute value doesn't match for p.disabled" +
        "\n\tactual:   true" +
        "\n\texpected: false"
    );
  });

  it("should fail if string child doesn't match", () => {
    //given
    const Comp = () => {
      return h("p", {}, "comp");
    };
    const comp = TestRenderer.create(h(Comp)).root.children[0];
    /** @type {Error?} */
    let resError = null;

    //when
    try {
      assertComponent(comp, h("p", {}, "comp2"));
    } catch (error) {
      resError = error;
    }

    //then
    assert.deepEqual(
      resError?.message,
      "Elements doesn't match for p" +
        "\n\tactual:   comp" +
        "\n\texpected: comp2"
    );
  });

  it("should fail if child types doesn't match", () => {
    //given
    const Comp = () => {
      return h("p", {}, h("comp"));
    };
    const comp = TestRenderer.create(h(Comp)).root.children[0];
    /** @type {Error?} */
    let resError = null;

    //when
    try {
      assertComponent(comp, h("p", {}, h("comp2")));
    } catch (error) {
      resError = error;
    }

    //then
    assert.deepEqual(
      resError?.message,
      "Components types doesn't match for p" +
        "\n\tactual:   comp" +
        "\n\texpected: comp2"
    );
  });

  it("should fail if component child doesn't match", () => {
    //given
    const Comp = () => {
      return h("p", {}, h(TestComp));
    };
    const comp = TestRenderer.create(h(Comp)).root.children[0];
    /** @type {Error?} */
    let resError = null;

    //when
    try {
      assertComponent(comp, h("p", {}, h(TestComp2)));
    } catch (error) {
      resError = error;
    }

    //then
    assert.deepEqual(
      resError?.message,
      "Components types doesn't match for p" +
        "\n\tactual:   TestComp" +
        "\n\texpected: TestComp2"
    );
  });

  it("should fail if non-empty", () => {
    //given
    const Comp = () => {
      return h("p", {}, h(TestComp));
    };
    const comp = TestRenderer.create(h(Comp)).root.children[0];
    /** @type {Error?} */
    let resError = null;

    //when
    try {
      assertComponent(comp, h("p"));
    } catch (error) {
      resError = error;
    }

    //then
    assert.deepEqual(
      resError?.message,
      "Expected no children for p, but got: TestComp"
    );
  });

  it("should assert props and children", () => {
    //given
    const id = Date.now.toString();
    const Comp = () => {
      return h(
        "div",
        {
          className: "test1 test2",
          style: { display: "none" },
          id: id,
          hidden: true,
          height: 10,
        },
        h("div", {
          testArr: ["test"],
          testObj: {
            test: 1,
            nested: {
              test2: 2,
            },
          },
        }),
        h("div", {}, "child1"),
        h("div", {}, "child2")
      );
    };
    const comp = TestRenderer.create(h(Comp)).root.children[0];

    //when & then
    assertComponent(
      comp,
      h(
        "div",
        {
          className: "test1 test2",
          style: { display: "none" },
          id: id,
          hidden: true,
          height: 10,
        },
        h("div", {
          testArr: ["test"],
          testObj: {
            test: 1,
            nested: {
              test2: 2,
            },
          },
        }),
        h("div", {}, "child1"),
        h("div", {}, "child2")
      )
    );
  });
});
