import { status } from "../domain/valueObjects/DispenserSpendingLineStatus";

export default interface UpdateDispenserDTO {
  id: string;
  status: status;
  updated_at: string;
}
