import React from "react";
import { shallow } from "enzyme";
import Receive from "./Receive";

describe("Receive", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<Receive />);
    expect(wrapper).toMatchSnapshot();
  });
});
