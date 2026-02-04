import React, { Component } from "react";
import TestRenderer from "react-test-renderer";

export function assertComponent(
  result: TestRenderer.ReactTestInstance | string,
  expectedElement: React.ReactElement | string,
): void;

export function assertComponents(
  results: (TestRenderer.ReactTestInstance | string)[],
  ...expectedElements: (React.ReactElement | string)[]
): void;

export function mockComponent<
  T = React.FunctionComponent<any> | React.ComponentClass<any>,
>(comp: T, name?: string): T;

export function actAsync<T>(callback: () => T): Promise<T>;

interface State {
  error?: object;
}

export class TestErrorBoundary extends Component<any, State> {}
