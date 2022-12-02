import IDispenserRepository from "../../../repositories/IDispenserRepository";
import CreateDispenserCommand from "../../../dtos/CreateDispenserDTO";
import DispenserService from "../DispenserService";
import { v4 as uuid } from "uuid";
import DispenserSpending from "../../../domain/entities/DispenserSpending";
import UpdateDispenserCommand from "../../../dtos/UpdateDispenserDTO";

const COST_PER_SECOND = 0.578;

describe("DispenserService", () => {
  const strategy = {
    getUsageCost: jest.fn().mockReturnValue(1.28),
  };

  test("create dispenser", () => {
    const mockId = uuid();
    const FLOW_VOLUME = 0.256;
    const repository: IDispenserRepository = {
      create: jest.fn().mockImplementation((_: DispenserSpending) => mockId),
      update: jest.fn(),
      get: jest.fn(),
    };
    const service = new DispenserService(repository, COST_PER_SECOND, strategy);
    const command: CreateDispenserCommand = { flow_volume: FLOW_VOLUME };
    const response = service.create(command);
    expect(repository.create).toHaveBeenCalled();
    expect(response).not.toBeFalsy();
    expect(response.id).toEqual(mockId);
    expect(response.flow_volume).toEqual(FLOW_VOLUME);
  });

  test("update dispenser -- new -> open", () => {
    const mockId = uuid();
    const FLOW_VOLUME = 0.256;
    const repository: IDispenserRepository = {
      create: jest.fn().mockReturnValue(mockId),
      update: jest.fn(),
      get: jest
        .fn()
        .mockReturnValue({ id: mockId, flow_volume: FLOW_VOLUME, usages: [] }),
    };
    const service = new DispenserService(repository, COST_PER_SECOND, strategy);
    const createCommand: CreateDispenserCommand = { flow_volume: FLOW_VOLUME };
    const createResponse = service.create(createCommand);
    const updateCommand: UpdateDispenserCommand = {
      id: createResponse.id || "0",
      status: "open",
      updated_at: "2022-11-28T14:00:00Z",
    };
    const updateResponse: UpdateDispenserCommand =
      service.update(updateCommand);
    expect(updateResponse.id).not.toBeFalsy();
  });

  test("update dispenser -- new -> closed = error", () => {
    const mockId = uuid();
    const FLOW_VOLUME = 0.256;
    const repository: IDispenserRepository = {
      create: jest.fn().mockReturnValue(mockId),
      update: jest.fn(),
      get: jest
        .fn()
        .mockReturnValue({ id: mockId, flow_volume: FLOW_VOLUME, usages: [] }),
    };
    const service = new DispenserService(repository, COST_PER_SECOND, strategy);
    const createCommand: CreateDispenserCommand = { flow_volume: FLOW_VOLUME };
    const createResponse = service.create(createCommand);
    const updateCommand: UpdateDispenserCommand = {
      id: createResponse.id || "0",
      status: "closed",
      updated_at: "2022-11-28T14:00:00Z",
    };
    expect(() => service.update(updateCommand)).toThrow();
  });

  test("update dispenser -- wrong id", () => {
    const mockId = uuid();
    const FLOW_VOLUME = 0.256;
    const repository: IDispenserRepository = {
      create: jest.fn().mockReturnValue(mockId),
      update: jest.fn(),
      get: jest
        .fn()
        .mockReturnValue({ id: mockId, flow_volume: FLOW_VOLUME, usages: [] }),
    };
    const service = new DispenserService(repository, COST_PER_SECOND, strategy);
    const createCommand: CreateDispenserCommand = { flow_volume: FLOW_VOLUME };
    expect(() => service.create(createCommand)).not.toThrow();
    const updateCommand: UpdateDispenserCommand = {
      id: "wrong-id",
      status: "closed",
      updated_at: "2022-11-28T14:00:00Z",
    };
    expect(() => service.update(updateCommand)).toThrow();
  });

  test("update dispenser -- open -> closed", () => {
    const mockId = uuid();
    const FLOW_VOLUME = 0.256;
    const repository: IDispenserRepository = {
      create: jest.fn().mockReturnValue(mockId),
      update: jest.fn(),
      get: jest
        .fn()
        .mockReturnValue({ id: mockId, flow_volume: FLOW_VOLUME, usages: [] }),
    };
    const service = new DispenserService(repository, COST_PER_SECOND, strategy);
    const createCommand: CreateDispenserCommand = { flow_volume: FLOW_VOLUME };
    const createResponse = service.create(createCommand);
    const updateCommand: UpdateDispenserCommand = {
      id: createResponse.id || "0",
      status: "open",
      updated_at: "2022-11-28T14:00:00Z",
    };
    service.update(updateCommand);
    const updateCloseCommand: UpdateDispenserCommand = {
      id: createResponse.id || "0",
      status: "closed",
      updated_at: "2022-11-28T14:15:00Z",
    };
    expect(() => service.update(updateCloseCommand)).not.toThrow();
  });

  test("update dispenser -- closed -> closed = error", () => {
    const mockId = uuid();
    const FLOW_VOLUME = 0.256;
    const repository: IDispenserRepository = {
      create: jest.fn().mockReturnValue(mockId),
      update: jest.fn(),
      get: jest
        .fn()
        .mockReturnValue({ id: mockId, flow_volume: FLOW_VOLUME, usages: [] }),
    };
    const service = new DispenserService(repository, COST_PER_SECOND, strategy);
    const createCommand: CreateDispenserCommand = { flow_volume: FLOW_VOLUME };
    const createResponse = service.create(createCommand);
    const updateCommand: UpdateDispenserCommand = {
      id: createResponse.id || "0",
      status: "open",
      updated_at: "2022-11-28T14:00:00Z",
    };
    service.update(updateCommand);
    const updateCloseCommand: UpdateDispenserCommand = {
      id: createResponse.id || "0",
      status: "closed",
      updated_at: "2022-11-28T14:15:00Z",
    };
    service.update(updateCloseCommand);
    const updateClose2Command: UpdateDispenserCommand = {
      id: createResponse.id || "0",
      status: "closed",
      updated_at: "2022-11-28T14:18:00Z",
    };
    expect(() => service.update(updateClose2Command)).toThrow();
  });
});
