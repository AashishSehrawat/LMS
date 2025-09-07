import { IUserDocument } from "./models/user.model";

declare global {
  namespace Express {
    export interface Request {
      user?: IUserDocument; // or user?: any if you don’t have a TS type for User
    }
  }
}
