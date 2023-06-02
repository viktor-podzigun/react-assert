import React from "react";
import TestRenderer from "react-test-renderer";

export function assertComponent(
  result: TestRenderer.ReactTestInstance | string,
  expectedElement: React.ReactElement | string
): void;

export function assertComponents(
  results: (TestRenderer.ReactTestInstance | string)[],
  ...expectedElements: (React.ReactElement | string)[]
): void;
