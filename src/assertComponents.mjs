import assert from "node:assert/strict";
import assertComponent from "./assertComponent.mjs";

/**
 * @param { (import('react-test-renderer').ReactTestInstance | string)[] } results
 * @param { (import('react').ReactElement | string)[] } expectedElements
 */
function assertComponents(results, ...expectedElements) {
  assert.deepEqual(
    results.length,
    expectedElements.length,
    `Components count doesn't match` +
      `\n\tactual:   ${results.length}` +
      `\n\texpected: ${expectedElements.length}`
  );

  expectedElements.forEach((expected, i) => {
    assertComponent(results[i], expected);
  });
}

export default assertComponents;
