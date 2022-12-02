import ICostStrategy from "./ICostStrategy";
import moment from "moment"

export default class CostStrategy implements ICostStrategy {

  getUsageCost(from: string, to: string|null, costPerLiter: number, litersPerSecond: number): number {
    const fromAsMoment = moment(from)
    const toAsMoment = !!to ? moment(to) : moment()
    const diffInSeconds = toAsMoment.diff(fromAsMoment, 'seconds')
    const total = (diffInSeconds * litersPerSecond) * costPerLiter
    return this.round(total)
  }

  private round(valueToRound: number) {
    return Math.round((valueToRound)*1000)/1000;
  }
}
