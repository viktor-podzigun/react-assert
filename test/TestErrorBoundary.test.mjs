import React from "react";
import TestRenderer from "react-test-renderer";
import assert from "node:assert/strict";
import mockFunction from "mock-fn";
import { assertComponents, TestErrorBoundary } from "../index.mjs";

const h = React.createElement;

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

describe("TestErrorBoundary.test.mjs", () => {
  it("should render children if no errors", () => {
    //when
    const result = TestRenderer.create(
      h(TestErrorBoundary, null, "some child"),
    ).root;

    //then
    assertComponents(result.children, "some child");
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
      return h(React.Fragment);
    };

    //when
    const result = TestRenderer.create(
      h(TestErrorBoundary, null, h(ErrorComp)),
    ).root;

    //then
    assert.deepEqual(consoleErrorMock.times, 1);
    assert.deepEqual(console.error, savedConsoleError);
    assertComponents(result.children, h("div", null, "Error: test error"));
  });
});
