import React from "react";
import { shallow } from "enzyme";
import Return from "./Return";

describe("Return", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<Return />);
    expect(wrapper).toMatchSnapshot();
  });
});
