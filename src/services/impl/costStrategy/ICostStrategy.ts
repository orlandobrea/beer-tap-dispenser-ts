export default interface ICostStrategy {
  getUsageCost(
    from: string,
    to: string | null,
    costPerLiter: number,
    litersPerSecond: number
  ): number;
}
