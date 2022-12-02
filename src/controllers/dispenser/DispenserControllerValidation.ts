 import { NextFunction, Request, Response } from "express";

export default class DispenserControllerValidation {

    private handleResponseErrorFn: any;
    constructor(handleResponseErrorFn: any) {
        this.handleResponseErrorFn = handleResponseErrorFn;
    }
    
    validateAddMiddleware(req: Request, res: Response, next: NextFunction) {
        if (req.body.hasOwnProperty("flow_volume")) {
          return this.handleResponseErrorFn(res, 400, "flow_volume is required");
        }
        if (typeof req.body.flow_volume !== "number") {
          return this.handleResponseErrorFn(res, 400, "flow_volume must be numeric");
        }
        if (req.body.flow_volume <= 0) {
          return this.handleResponseErrorFn(res, 400, "flow_volume must be a positive number")
        }
        next();
      }
    
    validateUpdateMiddleware(req: Request, res: Response, next: NextFunction) {
        if (!req.body.status || !req.body.updated_at) {
          return this.handleResponseErrorFn(
            res,
            400,
            "status and updated_at are required"
          );
        }
        next();
      }
    
     validateGetSpentMiddleware(req: Request, res: Response, next: NextFunction) {
        next()
      }
}


