import IDispenserRepository from "../IDispenserRepository";
import DispenserSpending from "../../domain/entities/DispenserSpending";
import { codifyError } from "../../shared/utils"
import { ID } from "../../domain/valueObjects/EntityID"
import { v4 as uuid } from "uuid"

export default class DispenserRepository implements IDispenserRepository {
  private dispensers: Array<DispenserSpending> = [];

  create(dispenserSpending: DispenserSpending): ID {
    const id = uuid();
    const item: DispenserSpending = {
      id: id,
      flow_volume: dispenserSpending.flow_volume,
      amount: null,
      usages: []
    }
    this.dispensers.push(item)
    return id;
  }

  update(dispenser: DispenserSpending): void {
    const idx = this.dispensers.findIndex((item: DispenserSpending) => item.id === dispenser.id);
    if (idx === -1) {
      throw codifyError(new Error("Not Found"), "NOT_FOUND");
    }
    this.dispensers[idx] = dispenser
  }

  get(id: ID): DispenserSpending | null {
    const item = this.dispensers.find(item => item.id === id)
    return item ? item : null;

  }
}
