import * as express from "express";
import * as middlewares from ".";

export const list: express.Handler[] = [middlewares.addContext];

export function getGlobal(): express.Handler[] {
    return [middlewares.addContext, middlewares.addApplyQueryParams];
}
