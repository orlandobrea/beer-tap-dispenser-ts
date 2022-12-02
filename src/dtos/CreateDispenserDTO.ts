import { ID } from "../domain/valueObjects/EntityID"

export default interface CreateDispenserDTO {
  id ?: ID;
  flow_volume: number;
}
