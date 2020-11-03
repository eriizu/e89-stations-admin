import * as express from "express";
import * as http from "http";
import * as cors from "cors";
import * as bodyParser from "body-parser";
import * as HttpError from "./errors/HttpError";
import * as dbErrorMatcher from "./errors/dbErrorMatcher";

import components from "./loadList";

export default class webapp {
    public express = express();
    public server: http.Server;

    constructor(port: number = parseInt(process.env.API_PORT)) {
        this.loadMiddleware();
        this.loadRoutes();
        this.loadErrorHandlers();
        this.server = this.express.listen(port, () => {
            console.log(`listening on port ${port}`);
        });
    }

    loadMiddleware() {
        this.express.use(cors());
        this.express.options("*", cors());
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: true }));
        components?.forEach((comp) => {
            if (typeof comp.getMiddlewares === "function")
                comp.getMiddlewares()?.forEach((middleware) => {
                    if (middleware) this.express.use(middleware);
                });
            // this.express.use(comp.);
        });
    }

    loadRoutes() {
        components?.forEach((comp) => {
            if (comp?.useRouter) {
                comp.useRouter(this.express);
            }
        });
    }

    loadErrorHandlers() {
        this.express.use(dbErrorMatcher.handler);
        this.express.use(HttpError.handler);
    }
}
