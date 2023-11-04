import mongoose from "mongoose";
import { config } from 'dotenv';
config();

mongoose.set('strictQuery', false);

const connectionToDB = async () => {
    try{
        const { connection } = await mongoose.connect(
            `mongodb://127.0.0.1:27017/MyDB`
    );

    if(connection) {
        console.log(`Connected to MongoDB: ${connection.host}`);
    }
    }catch(e) {
        console.log(e);
        process.exit(1);
    }
};

//  || `mongodb://127.0.0.1:27017/MyDB`

export default connectionToDB;