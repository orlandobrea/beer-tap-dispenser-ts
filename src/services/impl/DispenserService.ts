import IDispenserService from "../IDispenserService";
import IDispenserRepository from "../../repositories/IDispenserRepository";
import CreateDispenserDTO from "../../dtos/CreateDispenserDTO";
import UpdateDispenserDTO from "../../dtos/UpdateDispenserDTO";
import DispenserSpending from "../../domain/entities/DispenserSpending";
import DispenserSpendingLine from "../../domain/entities/DispenserSpendingLine";
import { ID } from "../../domain/valueObjects/EntityID";
import { codifyError } from "../../shared/utils";
import { status } from "../../domain/valueObjects/DispenserSpendingLineStatus";
import ICostStrategy from "./costStrategy/ICostStrategy";

export default class DispenserService implements IDispenserService {
  private repository: IDispenserRepository;
  private costPerLiter: number;
  private costStrategy: ICostStrategy;

  constructor(
    repository: IDispenserRepository,
    costPerLiter: number,
    costStrategy: ICostStrategy
  ) {
    this.repository = repository;
    this.costPerLiter = costPerLiter;
    this.costStrategy = costStrategy;
  }

  create(dto: CreateDispenserDTO): CreateDispenserDTO {
    const dispenser: DispenserSpending = {
      id: null,
      amount: 0,
      flow_volume: dto.flow_volume,
      usages: [],
    };
    const id = this.repository.create(dispenser);
    return { ...dto, id };
  }

  update(dto: UpdateDispenserDTO): UpdateDispenserDTO {
    const dispenser: DispenserSpending | null = this.repository.get(dto.id);
    if (!dispenser) {
      throw codifyError(new Error("Not found"), "NOT_FOUND");
    }
    const lastPosition = dispenser.usages.length - 1;
    if (
      !this.operationAvailableForUsage(
        dispenser?.usages[lastPosition],
        dto.status
      )
    ) {
      throw codifyError(
        new Error("Operation not permitted"),
        "OPERATION_NOT_AVAILABLE"
      );
    }
    if (dto.status === "open") {
      dispenser?.usages.push({
        opened_at: dto.updated_at,
        closed_at: null,
        flow_volume: dispenser?.flow_volume,
        total_spent: 0,
      });
    } else {
      dispenser.usages[lastPosition].closed_at = dto.updated_at;
      const usageToCalculate = dispenser.usages[lastPosition];
      dispenser.usages[lastPosition].total_spent =
        this.costStrategy.getUsageCost(
          usageToCalculate.opened_at || "",
          usageToCalculate.closed_at,
          this.costPerLiter,
          usageToCalculate.flow_volume
        );
    }
    this.repository.update(dispenser);
    return dto;
  }

  get(id: ID): DispenserSpending {
    const dispenser: DispenserSpending | null = this.repository.get(id);
    if (!dispenser) {
      throw codifyError(new Error("Not found"), "NOT_FOUND");
    }
    const response: DispenserSpending = dispenser.usages.reduce(
      (
        acc: DispenserSpending,
        usage: DispenserSpendingLine
      ): DispenserSpending => {
        const newUsage = { ...usage };

        newUsage.total_spent = this.costStrategy.getUsageCost(
          usage.opened_at || "",
          usage.closed_at,
          this.costPerLiter,
          usage.flow_volume
        );
        acc.amount = (acc.amount || 0) + newUsage.total_spent;
        acc.usages.push(newUsage);
        return acc;
      },
      { id: id, amount: 0, flow_volume: dispenser.flow_volume, usages: [] } as DispenserSpending
    );
    return response;
  }

  private operationAvailableForUsage(
    usage: DispenserSpendingLine,
    operation: status
  ): boolean {
    if (usage === undefined) {
      return operation === "open";
    }
    return operation === "open" ? !!usage.closed_at : !!!usage.closed_at;
  }
}
