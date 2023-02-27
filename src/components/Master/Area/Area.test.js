import React from "react";
import { shallow } from "enzyme";
import Area from "./Area";

describe("Area", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<Area />);
    expect(wrapper).toMatchSnapshot();
  });
});
