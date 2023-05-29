import React from "react";

const h = React.createElement;

/**
 * @param {any} props
 */
const TestComp = (props) => {
  return h(
    "p",
    {
      className: "test1",
    },
    props.children
  );
};
TestComp.displayName = "TestComp";

/**
 * @param {any} props
 */
const TestComp2 = (props) => {
  return h(
    "div",
    {
      className: "test2",
    },
    props.children
  );
};
TestComp2.displayName = "TestComp2";

export { TestComp, TestComp2 };
