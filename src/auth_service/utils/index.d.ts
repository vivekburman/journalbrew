import { Request } from "express";

export interface RequestWithPayload extends Request {
    payload: object | undefined
};