import HttpError from "./HttpError";
import * as express from "express";

export default function dbErrorMatcher(err: any): HttpError | null {
    if (err.name === "MongoError" || err.name === "MongooseError") {
        if (err.code == "11000") {
            return new HttpError(
                409,
                // "Data cannot be inserted or modified, as it would produce a duplicate entry.",
                null,
                err
            );
        }

        console.error("Unexpected database error:", err);
        return new HttpError(
            500,
            "Unexpetected error. The server is not used to this error happening. Error UID for the currenty session: ",
            this.errorUid++
        );
    }

    if (err.name == "ValidationError") {
        return new HttpError(
            400,
            null, // "Data cannot be inserted or modified, as it failed validation checks.",
            err
        );
    }

    if (err.name == "CastError") {
        return new HttpError(
            400,
            null, // "Data cannot be inserted or modified, as it failed validation checks.",
            err
        );
    }
    return null;
}

export const handler: express.ErrorRequestHandler = async function(err, _req, _res, next) {
    let httpError = dbErrorMatcher(err);
    next(httpError || err);
};
