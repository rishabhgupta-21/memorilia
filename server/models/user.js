const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = Schema({
    username: {
        type: String,
        required: [true, "Mandatory - Please add a Username."],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Mandatory - Please add the user's Email Address."],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Mandatory - Please add a Password."],
    },
    name: {
        type: String,
        required: [true, "Mandatory - Please add the user's Full Name."],
    },
});

module.exports = mongoose.model('User', userSchema);