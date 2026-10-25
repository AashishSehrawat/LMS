import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI as string;
        const dbName = process.env.DB_NAME || "LMS";
        const conn = await mongoose.connect(uri, {
            dbName,
        });
        console.log(`Connected to MongoDB: ${conn.connection.host}, Database: ${conn.connection.name}`);
    } catch (error) {
        console.log("Error connecting to MongoDB", error);
        process.exit(1);
    }
}

export default connectDB;