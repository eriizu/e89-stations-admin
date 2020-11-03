import * as express from "express";
import { Context } from "..";

/**
 * Global middleware that adds a context to requests.
 */
export const addContext: express.Handler = function (req, _res, next) {
    req.context = new Context();
    next();
};
