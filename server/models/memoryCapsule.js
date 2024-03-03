const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const memoryCapsuleSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Memory Capsule must have a title!'],
        unique: true,
    },
    description: {
        type: String,
        required: [true, 'Memory Capsule must have a description!'],
    },
    dateOfCreation: {
        type: Date,
        default: Date.now,
    },
    dateOfOpening: {
        type: Date,
        required: [true, 'Memory Capsule must have a date of opening!'],
    },
    photosArr: [String],
    videosArr: [String],
    audioArr: [String],
    tags: [String],
});

module.exports = mongoose.model('MemoryCapsule', memoryCapsuleSchema);