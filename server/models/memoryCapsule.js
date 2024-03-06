const mongoose = require('mongoose');

const memoryCapsuleSchema = new mongoose.Schema({
    title: String,
    description: String,
    dateOfCreation: Date,
    scheduledDateOfOpening: Date,
});

module.exports = mongoose.model('MemoryCapsule', memoryCapsuleSchema);