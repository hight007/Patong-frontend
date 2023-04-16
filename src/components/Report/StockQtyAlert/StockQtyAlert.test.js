import React from "react";
import { shallow } from "enzyme";
import StockQtyAlert from "./StockQtyAlert";

describe("StockQtyAlert", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<StockQtyAlert />);
    expect(wrapper).toMatchSnapshot();
  });
});
