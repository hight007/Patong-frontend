import React from "react";
import { shallow } from "enzyme";
import Reprint from "./Reprint";

describe("Reprint", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<Reprint />);
    expect(wrapper).toMatchSnapshot();
  });
});
