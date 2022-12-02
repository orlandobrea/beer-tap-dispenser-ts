import DispenserRepository from "../../../repositories/impl-memory/DispenserRepository";
import CostStrategy from "../../../services/impl/costStrategy/CostStrategy";
import DispenserService from "../../../services/impl/DispenserService";
import DispenserController from "../DispenserController";
import supertest from "supertest";

const COST_PER_LITRE = 1;
const dispenserService = new DispenserService(
  new DispenserRepository(),
  COST_PER_LITRE,
  new CostStrategy()
);
const controller = new DispenserController(dispenserService);
const app = controller.getApp();
const request = supertest(app);

describe("DispenserController", () => {
    it("create", async() => {
        const INPUT_FLOW_VOLUME = 1.22;
        const response: any = await request.post("/dispenser").send({flow_volume: INPUT_FLOW_VOLUME});
        expect(response.statusCode).toBe(200);
        expect(response.body.id).toBeTruthy();
        expect(response.body.flow_volume).toBe(INPUT_FLOW_VOLUME)
    })

    it("create validations - not sending flow_volume", async() => {
        const response: any = await request.post("/dispenser").send({});
        expect(response.statusCode).toBe(400);
    })

    it("create validations - flow_volume is not a number", async() => {
        const INPUT_FLOW_VOLUME = "abc";
        const response: any = await request.post("/dispenser").send({flow_volume: INPUT_FLOW_VOLUME});
        expect(response.statusCode).toBe(400);
    })

    it("create validations - flow_volume is negative", async() => {
        const INPUT_FLOW_VOLUME = -0.001;
        const response: any = await request.post("/dispenser").send({flow_volume: INPUT_FLOW_VOLUME});
        expect(response.statusCode).toBe(400);
    })

    it("update", async() => {
        const INPUT_FLOW_VOLUME = 1.22;
        const response: any = await request.post("/dispenser").send({flow_volume: INPUT_FLOW_VOLUME});
        const id = response.body.id;
        const response2: any = await request.put(`/dispenser/${id}/status`).send({status: "open", updated_at: "2022-11-30T01:00:00Z"});
        expect(response2.statusCode).toBe(202)
    })

    it("get simple", async() => {
        const INPUT_FLOW_VOLUME = 1.22;
        const EXPECTED_AMOUNT = COST_PER_LITRE * 60 * INPUT_FLOW_VOLUME;
        const response: any = await request.post("/dispenser").send({flow_volume: INPUT_FLOW_VOLUME});
        const id = response.body.id;
        await request.put(`/dispenser/${id}/status`).send({status: "open", updated_at: "2022-11-30T01:00:00Z"});
        await request.put(`/dispenser/${id}/status`).send({status: "closed", updated_at: "2022-11-30T01:01:00Z"});
        const response3: any = await request.get(`/dispenser/${id}/spending`);
        expect(response3.statusCode).toBe(200);
        expect(response3.body.amount).toBe(EXPECTED_AMOUNT);
        expect(response3.body.usages.length).toBe(1)
    })

    it("get simple - not closed", async() => {
        const INPUT_FLOW_VOLUME = 1.22;
        const response: any = await request.post("/dispenser").send({flow_volume: INPUT_FLOW_VOLUME});
        const id = response.body.id;
        await request.put(`/dispenser/${id}/status`).send({status: "open", updated_at: "2022-11-01T01:00:00Z"});
        const response3: any = await request.get(`/dispenser/${id}/spending`);
        expect(response3.statusCode).toBe(200);
        expect(response3.body.amount).toBeGreaterThan(INPUT_FLOW_VOLUME)
        expect(response3.body.usages.length).toBe(1)
    })

    it("get error open open", async() => {
        const INPUT_FLOW_VOLUME = 1.22;
        const response: any = await request.post("/dispenser").send({flow_volume: INPUT_FLOW_VOLUME});
        const id = response.body.id;
        await request.put(`/dispenser/${id}/status`).send({status: "open", updated_at: "2022-11-01T01:00:00Z"});
        const response3 = await request.put(`/dispenser/${id}/status`).send({status: "open", updated_at: "2022-11-01T01:00:00Z"});
        expect(response3.statusCode).toBe(409);
    })


    it("get error close close", async() => {
        const INPUT_FLOW_VOLUME = 1.22;
        const response: any = await request.post("/dispenser").send({flow_volume: INPUT_FLOW_VOLUME});
        const id = response.body.id;
        await request.put(`/dispenser/${id}/status`).send({status: "open", updated_at: "2022-11-01T01:00:00Z"});
        await request.put(`/dispenser/${id}/status`).send({status: "close", updated_at: "2022-11-01T01:00:00Z"});
        const response3 = await request.put(`/dispenser/${id}/status`).send({status: "close", updated_at: "2022-11-01T01:00:00Z"});
        expect(response3.statusCode).toBe(409);
    })

    it("get page example", async() => {
        const INPUT_FLOW_VOLUME = 0.064;
        const response: any = await request.post("/dispenser").send({flow_volume: INPUT_FLOW_VOLUME});
        const id = response.body.id;
        await request.put(`/dispenser/${id}/status`).send({status: "open", updated_at: "2022-01-01T02:00:00Z"});
        await request.put(`/dispenser/${id}/status`).send({status: "close", updated_at: "2022-01-01T02:00:50Z"});

        await request.put(`/dispenser/${id}/status`).send({status: "open", updated_at: "2022-01-01T02:50:58Z"});
        await request.put(`/dispenser/${id}/status`).send({status: "close", updated_at: "2022-01-01T02:51:20Z"});

        await request.put(`/dispenser/${id}/status`).send({status: "open", updated_at: "2022-01-01T13:50:58Z"});
        await request.put(`/dispenser/${id}/status`).send({status: "close", updated_at: "2022-01-01T13:51:20Z"});
        const response3: any = await request.get(`/dispenser/${id}/spending`);

        expect(response3.statusCode).toBe(200);
    })
})
