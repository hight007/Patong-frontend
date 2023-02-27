import React from "react";
import { shallow } from "enzyme";
import Issues from "./Issues";

describe("Issues", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<Issues />);
    expect(wrapper).toMatchSnapshot();
  });
});
