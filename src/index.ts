import Webapp from "./webapp";
import dbConnect from "./dbConnect";
import * as mongoose from "mongoose";
import * as assert from "assert";

(async () => {
    let app: Webapp;
    try {
        app = new Webapp(9000);
    } catch (err) {
        console.error("failed to start server");
        console.error(err);
        process.exit(1);
    }

    let odm: typeof mongoose;
    try {
        if (process.env.TEST == "1") {
            let dbMemory = await import("./dbConnectMemory");
            odm = await dbMemory.default();
        } else {
            odm = await dbConnect();
        }
        assert(odm.connection.readyState === 1);
    } catch (err) {
        console.error("failed to start Object-Data Mapper and database connection.");
        console.error(err);
        app.server.close();
        process.exit(1);
    }
})();
