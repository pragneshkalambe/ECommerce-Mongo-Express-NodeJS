const mongoose = require('mongoose');

//Schema - structure
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
});

// Create Schema model
const User = mongoose.model("User", userSchema);
module.exports = User; 