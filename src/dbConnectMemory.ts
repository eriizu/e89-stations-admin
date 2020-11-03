import { MongoMemoryServer } from "mongodb-memory-server";
import * as mongoose from "mongoose";

export const server = new MongoMemoryServer();

export async function memoryDbConnect() {
    let mongoUri = await server.getUri();
    const mongooseOpts = {
        // options for mongoose 4.11.3 and above
        // autoReconnect: true,
        // reconnectTries: Number.MAX_VALUE,
        // reconnectInterval: 1000,
        serverSelectionTimeoutMS: 1000,
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        // useMongoClient: true, // remove this line if you use mongoose 5 and above
    };

    let odm = await mongoose.connect(mongoUri, mongooseOpts);
    console.log(`(await) MongoDB successfully connected to ${mongoUri}`);

    mongoose.connection.on("error", (e) => {
        if (e.message.code === "ETIMEDOUT") {
            console.log(e);
            mongoose.connect(mongoUri, mongooseOpts);
        }
        console.log(e);
    });

    mongoose.connection.once("open", () => {
        console.log(`(once open) MongoDB successfully connected to ${mongoUri}`);
    });
    return odm;
}

export default memoryDbConnect;
