import mongoose from "mongoose";

/**
 * Connect to MongoDB
 * Establishes a connection to the MongoDB database using the URI from environment variables.
 */
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`.bgBlue.white);
    } catch (error) {
        console.error(`Database Connection Error: ${error.message}`.red);
        process.exit(1); // Exit the process with failure
    }
};

export default connectDB;
