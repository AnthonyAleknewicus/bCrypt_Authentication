const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please enter a valid username.'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please enter a valid password.']
    }
});

module.exports = mongoose.model('User', userSchema);