import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoUrlLocal = process.env.mongoURL ?? "";

const dbLocal = mongoose.createConnection(mongoUrlLocal, {
    dbName: "retrieve-account-balance"
});

const userSchema = new mongoose.Schema({
    user: {
        type: String,
        require: true
    },

    balance: {
        type: String,
        require: true
    }

});

export const UserCrawl = dbLocal.model('UserCrawl', userSchema);
