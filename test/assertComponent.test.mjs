import React from "react";
import TestRenderer from "react-test-renderer";
import { assertComponent } from "../index.mjs";
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
    assert.match(
      resError?.message ?? "",
      new RegExp(
        "Attribute value doesn't match for p\\.testArr\\.0" +
          "\n\tactual:   test1" +
          "\n\texpected: test2"
      )
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
    assert.match(
      resError?.message ?? "",
      new RegExp(
        "Attribute value doesn't match for p\\.testObj\\.test" +
          "\n\tactual:   1" +
          "\n\texpected: 2"
      )
    );
  });

  it("should fail if function attribute doesn't match", () => {
    //given
    const Comp = () => {
      return h("p", {
        testObj: {
          test: () => 1,
        },
      });
    };
    const comp = TestRenderer.create(h(Comp)).root.children[0];
    /** @type {Error?} */
    let resError = null;

    //when
    try {
      assertComponent(comp, h("p", { testObj: { test: undefined } }));
    } catch (error) {
      resError = error;
    }

    //then
    assert.match(
      resError?.message ?? "",
      new RegExp(
        "Attribute value doesn't match for p\\.testObj\\.test" +
          "\n\tactual:   \\(\\) => 1" +
          "\n\texpected: undefined"
      )
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
    assert.match(
      resError?.message ?? "",
      new RegExp(
        "Attribute value doesn't match for p\\.disabled" +
          "\n\tactual:   true" +
          "\n\texpected: false"
      )
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
      "Element doesn't match for p > comp2" +
        "\n\tactual:   comp" +
        "\n\texpected: comp2"
    );
  });

  it("should fail if root element doesn't match", () => {
    //given
    const Comp = () => {
      return h("comp");
    };
    const comp = TestRenderer.create(h(Comp)).root.children[0];
    /** @type {Error?} */
    let resError = null;

    //when
    try {
      assertComponent(comp, h("comp2"));
    } catch (error) {
      resError = error;
    }

    //then
    assert.deepEqual(
      resError?.message,
      "Component type doesn't match for comp2" +
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
      "Component type doesn't match for p > TestComp2" +
        "\n\tactual:   TestComp" +
        "\n\texpected: TestComp2"
    );
  });

  it("should fail if non-empty", () => {
    //given
    const Comp = () => {
      return h("p", {}, "test_text", h("div"), h(TestComp));
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
      "Expected no children for p, but got: test_text,div,TestComp"
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
          arr: [1, 2],
          test: undefined,
          onPress: () => 1,
        },
        h("div", {
          emptyArr: [],
          simpleArr: ["test1", "test2"],
          objectArr: [{ a: "test", f: () => {} }],
          testObj: {
            test: 1,
            nested: {
              test2: 2,
              arr2: [1, 2],
              onPress2: () => 1,
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
          arr: [1, 2],
          test: undefined,
          onPress: () => 2, // functions could differ !!!
        },
        h("div", {
          emptyArr: [],
          simpleArr: ["test1", "test2"],
          objectArr: [{ a: "test", f: () => {} }],
          testObj: {
            test: 1,
            nested: {
              test2: 2,
              arr2: [1, 2],
              onPress2: () => 2, // functions could differ !!!
            },
          },
        }),
        h("div", {}, "child1"),
        h("div", {}, "child2")
      )
    );
  });
});
