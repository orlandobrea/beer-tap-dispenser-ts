import DispenserSpendingLine from "./DispenserSpendingLine"
import { ID } from "../valueObjects/EntityID"

export default interface DispenserSpending {
  id: ID | null;
  flow_volume: number;
  amount: number | null;
  usages: Array<DispenserSpendingLine>
}
