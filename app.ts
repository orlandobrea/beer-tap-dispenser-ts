import DispenserRepository from "./src/repositories/impl-memory/DispenserRepository";
import DispenserService from "./src/services/impl/DispenserService";
import DispenserController from "./src/controllers/dispenser/DispenserController";
import CostStrategy from "./src/services/impl/costStrategy/CostStrategy";

const COST_PER_LITRE = 1;

const dispenserService = new DispenserService(
  new DispenserRepository(),
  COST_PER_LITRE,
  new CostStrategy()
);
const controller = new DispenserController(dispenserService);

controller.getApp().listen(3000, () => {
  console.log("running");
});
