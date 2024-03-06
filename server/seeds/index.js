const mongoose = require('mongoose');
const MemoryCapsule = require('../models/memoryCapsule');

// Connecting to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/memoriliaDB')
    .then(() => console.log('Connected to MongoDB!'))
    .catch(error => console.log(error));
mongoose.connection.on('error', error => console.log(error));

// Seed Function
const seedDB = async () => {
    // Delete all campgrounds
    await MemoryCapsule.deleteMany({});

    // Function to generate a random date within a specified range
    function getRandomDate(start, end) {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }

    // Seed new campgrounds
    for (let i = 0; i < 5; i++) {
        const capsule = new MemoryCapsule({
            title: `Capsule #${i + 1}`,
            description: `This is a description for Capsule #${i + 1}!`,
            dateOfCreation: getRandomDate(new Date(2022, 0, 1), new Date()),
            scheduledDateOfOpening: getRandomDate(new Date(), new Date(2025, 0, 1)),
        });

        await capsule.save();
    }
}

seedDB()
    .then(() => mongoose.connection.close());