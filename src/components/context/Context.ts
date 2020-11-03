import * as express from "express";
import { DocumentQuery } from "mongoose";

export class Context {}

declare global {
    namespace Express {
        interface Request {
            context: Context;
            applyQueryParam: (dbQuery: DocumentQuery<any, any>) => void;
        }
    }
}
