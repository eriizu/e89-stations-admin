import * as express from "express";

export default class HttpError extends Error {
    public httpStatus: number;
    public message: string;
    public payload: any;
    public constructor(httpStatus: number, message = "", obj: any = undefined) {
        super(message);
        this.httpStatus = httpStatus;
        this.message = message;
        this.payload = obj;
    }

    public json(obj: any) {
        this.payload = obj;
    }

    public discharge(res: express.Response) {
        if (this.message && this.message.length && this.payload) {
            res.status(this.httpStatus).send({ message: this.message, ...this.payload });
        } else if ((!this.message || !this.message.length) && this.payload) {
            res.status(this.httpStatus).send(this.payload);
        } else if (this.message != "") {
            res.status(this.httpStatus).send({ message: this.message });
        } else {
            res.sendStatus(this.httpStatus);
        }
    }
}

export const handler: express.ErrorRequestHandler = async function (err, req, res, next) {
    if (err instanceof HttpError) {
        let rq_err: HttpError = err;
        rq_err.discharge(res);
        next();
    } else {
        next(err);
    }
};
