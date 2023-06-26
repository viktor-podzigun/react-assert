import React, { Component } from "react";

const h = React.createElement;

/**
 * @typedef State
 * @prop {object} [error]
 */

/**
 * @extends Component<any, State>
 */
class TestErrorBoundary extends Component {
  /** @type {State} */
  state = {
    error: undefined,
  };

  /**
   * @param {any} props
   */
  constructor(props) {
    super(props);
  }

  /**
   * @param {object} [error]
   */
  componentDidCatch(error) {
    this.setState({
      error,
    });
  }

  render() {
    const error = this.state.error;
    return error ? h("div", null, `${error}`) : this.props.children;
  }
}
TestErrorBoundary.displayName = "TestErrorBoundary";

export default TestErrorBoundary;
