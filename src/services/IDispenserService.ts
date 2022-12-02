import CreateDispenserCommand from "../dtos/CreateDispenserDTO";
import UpdateDispenserCommand from "../dtos/UpdateDispenserDTO";
import DispenserSpending from "../domain/entities/DispenserSpending";
import { ID } from "../domain/valueObjects/EntityID";

export default interface IDispenserService {
  create(command: CreateDispenserCommand): CreateDispenserCommand;
  update(command: UpdateDispenserCommand): UpdateDispenserCommand;
  get(query: ID): DispenserSpending;
}
