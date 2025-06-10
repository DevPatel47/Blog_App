const mongoose = require('mongoose');
const DB_NAME = require('../constants.js').DB_NAME;

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log('MongoDB connected successfully, DB Host: ', connectionInstance.connection.host);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}

module.exports = connectDB;