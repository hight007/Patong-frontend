import React from "react";
import { shallow } from "enzyme";
import PrintProduct from "./PrintProduct";

describe("PrintProduct", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<PrintProduct />);
    expect(wrapper).toMatchSnapshot();
  });
});
