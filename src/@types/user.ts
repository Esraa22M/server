import { Request } from "express";
export interface CreateUserRequest extends Request {
    body: {
        name: string;
        email: string;
        password: string;
    };
}