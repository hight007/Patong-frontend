import React from "react";
import { shallow } from "enzyme";
import Icons from "./Icons";

describe("Icons", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<Icons />);
    expect(wrapper).toMatchSnapshot();
  });
});
