import React from "react";
import { shallow } from "enzyme";
import StockDetail from "./stockDetail";

describe("StockDetail", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<StockDetail />);
    expect(wrapper).toMatchSnapshot();
  });
});
