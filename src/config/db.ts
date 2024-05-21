import mongoose from "mongoose";

const connectDB = async () => {

    try {

        await mongoose.connect(process.env.MONGO_URL || '');
        console.log("application connected to mongo_db");

    } catch (error) {
        console.log("Error connecting to the database", error);
        process.exit(1)
    }
};


const startDBConnection = async () => {
    try {
        await connectDB();
    } catch (error) {
        console.error('Error -> Application connecting to DB', error);
    }
};


export default startDBConnection;

 