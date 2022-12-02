import IDispenserRepository from "../../IDispenserRepository"
import DispenserRepository from "../DispenserRepository"
import DispenserSpending from "../../../domain/entities/DispenserSpending"


describe('DispenserRepositoryMemory', () => {
  let dispenserRepository: IDispenserRepository

  beforeAll((): any => {
    dispenserRepository = new DispenserRepository();
  })

  test('create dispenser', () => {
    const input: DispenserSpending = {flow_volume: 0.123, id: null, amount: null, usages: []};
    const id = dispenserRepository.create(input);
    expect(id).not.toBeNull()
  })

  test('get existing', () => {
    const input: DispenserSpending = {flow_volume: 0.123, id: null, amount: null, usages: []};
    const id = dispenserRepository.create(input);
    expect(dispenserRepository.get(id)).not.toBeNull()
  })

  test('get not existing', () => {
    expect(dispenserRepository.get("none-existing-value")).toBeNull()
  })

  test('update dispenser existing', () => {
    const inputCreate: DispenserSpending = {flow_volume: 0.125, id: null, amount: null, usages: []};
    const id = dispenserRepository.create(inputCreate);
    const dispenser = dispenserRepository.get(id)
    expect(dispenser).not.toBeNull();
    dispenser && dispenser.usages.push({
      opened_at: "2022-11-27T20:01:01:00Z",
      closed_at: null,
      flow_volume: 0.125,
      total_spent: null
    })
    dispenser &&
       expect(() => dispenserRepository.update(dispenser)).not.toThrow();
  })

  test('update dispenser not existing', () => {
    const inputCreate: DispenserSpending = {flow_volume: 0.125, id: null, amount: null, usages: []};
    const id = dispenserRepository.create(inputCreate);
    const dispenser = dispenserRepository.get(id)
    dispenser && dispenser.usages.push({
      opened_at: "2022-11-27T20:01:01:00Z",
      closed_at: null,
      flow_volume: 0.125,
      total_spent: null
    })
    dispenser &&
       expect(() => dispenserRepository.update({...dispenser, id: "not_existeng"})).toThrow();
  })
})
