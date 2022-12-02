import express, { NextFunction, Request, Response } from "express";
import CreateDispenserDTO from "../../dtos/CreateDispenserDTO";
import UpdateDispenserDTO from "../../dtos/UpdateDispenserDTO";
import IDispenserService from "../../services/IDispenserService";
import DispenserControllerValidation from "./DispenserControllerValidation";

export default class DispenserController {
  private app: express.Application;
  private service: IDispenserService;
  private validations: DispenserControllerValidation;

   constructor(service: IDispenserService) {
    this.service = service;
    this.app = express();
    this.app.use(express.json());
    this.validations = new DispenserControllerValidation(this.handleResponseError);
    this.addRoutes();
  }

  getApp(): express.Application {
    return this.app;
  }

  handleResponseError(res: Response, status: number, message: string): void {
    res.status(status).json({ error: message });
  }

  handleResponseOk(res: Response, status: number, response: Object): void {
    res.status(status).json(response);
  }


  addDispenser(req: Request, res: Response): void {
    const createDTO: CreateDispenserDTO = {
      flow_volume: req.body.flow_volume,
    };
    const response: CreateDispenserDTO = this.service.create(createDTO);
    this.handleResponseOk(res, 200, {
      id: response.id,
      flow_volume: response.flow_volume,
    });
  }

  updateDispenserStatus(req: Request, res: Response): void {
    const updateDTO: UpdateDispenserDTO = {
      id: req.params.id,
      status: req.body.status,
      updated_at: req.body.updated_at,
    };
    try {
      this.service.update(updateDTO);
      this.handleResponseOk(res, 202, {});
    } catch (e: any) {
      if (e.code === "NOT_FOUND") {
        this.handleResponseError(res, 404, "");
        return;
      }
      if (e.code === "OPERATION_NOT_AVAILABLE") {
        this.handleResponseError(
          res,
          409,
          "Dispenser is already opened/closed"
        );
        return;
      }
      this.handleResponseError(res, 500, e.getMessage());
    }
  }

  getSpent(req: Request, res: Response): void {
    const dispenser = this.service.get(req.params.id);
    this.handleResponseOk(res, 200, dispenser);
  }

  addRoutes() {
    this.app.post(
      "/dispenser",
      this.validations.validateAddMiddleware.bind(this.validations),
      this.addDispenser.bind(this)
    );
    this.app.put(
      "/dispenser/:id/status",
      this.validations.validateUpdateMiddleware.bind(this.validations),
      this.updateDispenserStatus.bind(this)
    );
    this.app.get(
      "/dispenser/:id/spending",
      this.validations.validateGetSpentMiddleware.bind(this.validations),
      this.getSpent.bind(this)
    )
  }
}
