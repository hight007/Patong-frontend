import React from "react";
import { shallow } from "enzyme";
import PrintArea from "./PrintArea";

describe("PrintArea", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<PrintArea />);
    expect(wrapper).toMatchSnapshot();
  });
});
