import * as express from "express";

export const router = express.Router();

// This function is meant for use at the top level
// and loads the routes of this component onto the main
// app.
export function useRouter(app: express.Application, scope = "") {
    if (!scope || !scope.length) {
        console.log("using router with no scope");
        app.use(router);
    } else {
        console.log("using router with scope: " + scope);
        app.use(scope, router);
    }
}
