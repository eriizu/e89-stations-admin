import * as express from "express";
import { DocumentQuery } from "mongoose";

function joinIfArrayApply(req: express.Request, field: string) {
    if (
        req.query[field] instanceof Array &&
        req.query[field].length &&
        typeof req.query[field][0] == "string"
    ) {
        req.query[field] = (req.query[field] as string[]).join(", ");
    }
}

function joinIfArray(req: express.Request, fields: string[]) {
    for (let field in fields) {
        joinIfArrayApply(req, field);
    }
}

function applyForOneOrArray(req: express.Request, field: string, cb: (arg: any) => void) {
    let val = req.query[field];
    if (val) {
        if (val instanceof Array) {
            for (let entry of val) {
                cb(entry);
            }
        } else if (typeof val == "string" && val.length) {
            cb(val);
        }
    }
}

function applyQueryParam(this: express.Request, dbQuery: DocumentQuery<any, any>) {
    let limit = 20;
    let page = 0;

    try {
        if (typeof this.query["limit"] == "string") {
            limit = parseInt(this.query["limit"]);
        }
    } catch (err) {
        console.warn("Context::applyQueryParam limit error", err);
    }

    try {
        if (typeof this.query["page"] == "string") {
            page = parseInt(this.query["page"]);
        }
    } catch (err) {
        console.warn("Context::applyQueryParam page error", err);
    }

    dbQuery.limit(limit).skip(page * limit);

    // joinIfArray(this, ["select", "populate"]);

    applyForOneOrArray(this, "select", (arg) => {
        dbQuery.select(arg);
    });
    applyForOneOrArray(this, "populate", (arg) => {
        console.log("pop with ", arg);
        dbQuery.populate(arg);
    });
}

/**
 * Global middleware that adds a context to requests.
 */
export const addApplyQueryParams: express.Handler = function (req, _res, next) {
    req.applyQueryParam = applyQueryParam;
    next();
};
