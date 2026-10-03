import mongoose  from "mongoose";
import {config} from "./config.js";


const connectToDb = async () => {
    console.log("inside db function")
    await mongoose.connect(config.MONGO_URI);

    console.log("Mongo Db connected")
}

export default connectToDb;