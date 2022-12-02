import ICostStrategy from "../ICostStrategy";
import CostStrategy from "../CostStrategy";
import moment from "moment";

describe("CostStrategy", () => {
  it("expect 39.2", () => {
    const strategy: ICostStrategy = new CostStrategy();
    const response = strategy.getUsageCost(
      "2022-11-28T11:00:00Z",
      "2022-11-28T11:00:50Z",
      12.25,
      0.064
    );
    expect(response).toEqual(39.2);
  });

  it("expect 39.2", () => {
    const strategy: ICostStrategy = new CostStrategy();
    const response = strategy.getUsageCost(
      "2022-11-28T11:00:50Z",
      "2022-11-28T11:01:40Z",
      12.25,
      0.064
    );
    expect(response).toEqual(39.2);
  });

  it("expect 2.16", () => {
    const strategy: ICostStrategy = new CostStrategy();
    const response = strategy.getUsageCost(
      moment().subtract("90", "seconds").toJSON(),
      null,
      0.8,
      0.03
    );
    expect(response).toEqual(2.16);
  });
});
