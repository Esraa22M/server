import { Request } from "express";
import { Types } from 'mongoose';

export interface CreateUserRequest extends Request {
    body: {
        name: string;
        email: string;
        password: string;
    };
}
export interface VerifyEmailRequest extends Request {
    body: {
        token: string;
        userId: string;
    };
}
declare global {
  namespace Express {
    interface Request {
      user: {
        id: Types.ObjectId | string;
        name: string;
        email: string;
        verified: boolean;
        avatar?: string;
        followers: number;
        followings: number;
      };
      token:string;
    }
  }
}