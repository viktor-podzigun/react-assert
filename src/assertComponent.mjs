import assert from "node:assert/strict";

/**
 * @param { import('react-test-renderer').ReactTestInstance | string } result
 * @param { import('react').ReactElement | string } expectedElement
 */
function assertComponent(result, expectedElement) {
  assertComponentImpl("", result, expectedElement);
}

/**
 * @param { string } path
 * @param { import('./assertComponent').TestInstance | string } result
 * @param { import('./assertComponent').TestInstance | string } expectedElement
 */
function assertComponentImpl(path, result, expectedElement) {
  const name =
    typeof expectedElement === "string"
      ? expectedElement
      : expectedElement.type.displayName
      ? expectedElement.type.displayName
      : expectedElement.type;

  const pathName = path ? `${path} > ${name}` : Object(name).toString();

  if (typeof result === "string" || typeof expectedElement === "string") {
    assert.deepEqual(
      result,
      expectedElement,
      `Element doesn't match for ${pathName}` +
        `\n\tactual:   ${result}` +
        `\n\texpected: ${expectedElement}`
    );
    return;
  }

  assert.deepEqual(
    result.type,
    expectedElement.type,
    `Component type doesn't match for ${pathName}` +
      `\n\tactual:   ${
        result.type.displayName ? result.type.displayName : result.type
      }` +
      `\n\texpected: ${
        expectedElement.type.displayName
          ? expectedElement.type.displayName
          : expectedElement.type
      }`
  );

  Object.keys(expectedElement.props)
    .filter((p) => {
      return p != "children";
    })
    .forEach((attr) => {
      const resultValue = result.props[attr];
      const expectedValue = expectedElement.props[attr];
      if (typeof expectedValue === "object" && !Array.isArray(expectedValue)) {
        assertObject(`${pathName}.${attr}`, resultValue, expectedValue);
      } else {
        assertAttrValue(`${pathName}.${attr}`, resultValue, expectedValue);
      }
    });

  const children = getComponentChildren(result);
  const expectedChildren = getComponentChildren(expectedElement);
  if (expectedChildren.length === 0) {
    if (children.length > 0) {
      const resultChildren = children.map((child) => {
        if (typeof child === "string") {
          return child;
        }

        return child.type.displayName
          ? child.type.displayName
          : Object(child.type).toString();
      });
      assert.fail(
        `Expected no children for ${pathName}, but got: ${resultChildren}`
      );
    }
  } else {
    assert.deepEqual(
      children.length,
      expectedChildren.length,
      `Children count doesn't match for ${pathName}` +
        `\n\tactual:   ${children.length}` +
        `\n\texpected: ${expectedChildren.length}`
    );

    expectedChildren.forEach((expected, i) => {
      assertComponentImpl(pathName, children[i], expected);
    });
  }
}

/**
 *
 * @param {string} name
 * @param {any} resultValue
 * @param {any} expectedObject
 */
function assertObject(name, resultValue, expectedObject) {
  assertAttrValue(name, typeof resultValue, "object");

  if (resultValue !== expectedObject) {
    const resultObject = resultValue;
    const resultKeys = new Set(Object.keys(resultObject));
    const expectedKeys = new Set(Object.keys(expectedObject));
    assertAttrValue(name, resultKeys, expectedKeys);

    expectedKeys.forEach((key) => {
      const resultValue = resultObject[key];
      const expectedValue = expectedObject[key];
      if (typeof expectedValue === "object") {
        assertObject(`${name}.${key}`, resultValue, expectedValue);
      } else {
        assertAttrValue(`${name}.${key}`, resultValue, expectedValue);
      }
    });
  }
}

/**
 * @param {string} name
 * @param {any} resultValue
 * @param {any} expectedValue
 */
function assertAttrValue(name, resultValue, expectedValue) {
  assert.deepStrictEqual(
    resultValue,
    expectedValue,
    `Attribute value doesn't match for ${name}` +
      `\n\tactual:   ${resultValue}` +
      `\n\texpected: ${expectedValue}`
  );
}

/**
 * @param {import('./assertComponent').TestInstance} result
 * @returns {(import('./assertComponent').TestInstance | string)[]}
 */
function getComponentChildren(result) {
  // in case of ReactElement get children from props
  // in case of TestInstance return children as it is
  //
  const children = result.children;
  if (children && children.length > 0) {
    return children;
  }

  if (result.props && result.props.children) {
    const children = result.props.children;
    if (Array.isArray(children)) {
      return children;
    }

    // wrap singel child into array
    return [children];
  }

  return [];
}

export default assertComponent;
