import * as mongoose from "mongoose";

export async function dbConnect(uri: string = process.env.MONGO_URL) {
    if (!uri) uri = `mongodb://root:example@localhost/federator`;
    try {
        let odm = await mongoose.connect(uri, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        });
        console.log("Mongodb connection established to: " + uri);
        return odm;
    } catch (err) {
        console.log(err);
        throw new Error("Failed to connect to MongoDB");
    }
}

export default dbConnect;
