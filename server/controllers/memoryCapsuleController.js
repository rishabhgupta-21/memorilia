// Models
const MemoryCapsule = require('../models/memoryCapsule');

// Utils
const AppError = require('../utils/AppError');

module.exports.getAllMemoryCapsules = async (req, res) => {
    // console.log('Request received: GET - /memoryCapsules');
    const memoryCapsules = await MemoryCapsule.find({});

    // Server Side error - failure to fetch data
    if (!memoryCapsules) {
        throw new AppError();
    }

    // console.log(memoryCapsules);
    res.status(200).json(memoryCapsules);
};

module.exports.createMemoryCapsule = async (req, res, next) => {
    // console.log('Request received: POST - /memoryCapsules');
    // console.log(req.body);

    const { title, description, scheduledDateOfOpening } = req.body;
    if (!title || !description || !scheduledDateOfOpening) {
        // console.log('ERROR: Invalid request body!');
        throw new AppError(400, 'Invalid request body.');
    }

    // Create new Memory Capsule - Stores Date in UTC
    const memoryCapsule = await MemoryCapsule.create({
        title,
        description,
        dateOfCreation: new Date(),
        scheduledDateOfOpening,
    });

    memoryCapsule.save();
    res.status(201).json(memoryCapsule);
};

module.exports.getMemoryCapsule = async (req, res) => {
    // console.log('Request received: GET - /memoryCapsules/:id');
    const { id } = req.params;

    const memoryCapsule = await MemoryCapsule.findById(id);
    if (!memoryCapsule) {
        // console.log('ERROR: Memory Capsule not found!');
        throw new AppError(404, 'Memory Capsule does not exist.');
    }

    // console.log(memoryCapsule);
    res.status(200).json(memoryCapsule);
};

module.exports.updateMemoryCapsule = async (req, res) => {
    // console.log('Request received: PUT - /memoryCapsules/:id');
    const { id } = req.params;
    // console.log(req.body);

    const { _id, title, description, dateOfCreation, scheduledDateOfOpening } = req.body;

    // Error Handling
    if (_id != id) {
        // console.log('ERROR: Invalid request body!');
        throw new AppError(400, 'Invalid request body.');
    }
    if (!title || !description || !scheduledDateOfOpening) {
        // console.log('ERROR: Invalid request body!');
        throw new AppError(400, 'Invalid request body.');
    }

    const memoryCapsuleExists = await MemoryCapsule.findById(id);
    if (!memoryCapsuleExists) {
        // console.log('ERROR: Memory Capsule not found!');
        throw new AppError(404, 'Memory Capsule does not exist.');
    }

    // Update
    const memoryCapsule = await MemoryCapsule.findByIdAndUpdate(
        id,
        {
            ...req.body,
            dateOfCreation: new Date()      // Update date of creation to the current date
        },
        { runValidators: true, new: true }
    );

    // console.log(memoryCapsule);
    await memoryCapsule.save();
    res.status(200).json(memoryCapsule);
};

module.exports.deleteMemoryCapsule = async (req, res) => {
    // console.log('Request received: DELETE - /memoryCapsules/:id');
    const { id } = req.params;
    const memoryCapsule = await MemoryCapsule.findByIdAndDelete(id);

    res.status(200).json(memoryCapsule);
};