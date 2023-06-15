import React from "react";

/**
 * @template {React.FunctionComponent<any> | React.ComponentClass<any>} T
 * @param {T} comp
 * @param {string} [name]
 * @returns {T}
 */
function mockComponent(comp, name) {
  const mock = name || `${comp.displayName || ""}Mock`;
  // @ts-ignore
  return mock;
}

export default mockComponent;
