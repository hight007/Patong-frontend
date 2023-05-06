import React from "react";
import { shallow } from "enzyme";
import SummaryStockTracking from "./SummaryStockTracking";

describe("SummaryStockTracking", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<SummaryStockTracking />);
    expect(wrapper).toMatchSnapshot();
  });
});
