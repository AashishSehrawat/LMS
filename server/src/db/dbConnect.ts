import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}` as string);
        console.log("Connected to MongoDB ", conn.connection.host);
    } catch (error) {
        console.log("Error connecting to MongoDB", error);
        process.exit(1);
    }
}

export default connectDB;