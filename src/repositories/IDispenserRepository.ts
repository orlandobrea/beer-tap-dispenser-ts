import DispenserSpending from "../domain/entities/DispenserSpending";
import { ID } from "../domain/valueObjects/EntityID"

export default interface IDispenserRepository {
  create(dispenserSpending: DispenserSpending): ID;
  update(dispenserSpending: DispenserSpending): void;
  get(id: ID): DispenserSpending | null;
}
