import type { NextFunction, Request, Response } from "express";


type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>;

const asyncHandler = (requestHandler: AsyncRequestHandler) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise
            .resolve(requestHandler(req, res, next))
            .catch((e) => next(e));
    }
}

export default asyncHandler