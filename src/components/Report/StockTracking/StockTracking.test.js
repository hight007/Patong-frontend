import React from "react";
import { shallow } from "enzyme";
import StockTracking from "./StockTracking";

describe("StockTracking", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<StockTracking />);
    expect(wrapper).toMatchSnapshot();
  });
});
