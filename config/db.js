const mongoose = require('mongoose');

// Connection
const connection = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDb connected");

    } catch (error) {
        console.log("Error connecting to database : ", error.message);
    }
}

module.exports = connection;






