const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

// CONSTANTS
const PORT = 3000;

// Models
const MemoryCapsule = require('./models/memoryCapsule');

// Connecting to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/memoriliaDB')
    .then(() => console.log('Connected to MongoDB!'))
    .catch(error => console.log(error));
mongoose.connection.on('error', error => console.log(error));

// Middleware
app.use(cors());
app.use(express.json());

// ROUTES
// @desc    Home Page
// @route   GET /
// @access  public
app.get('/', (req, res) => {
    res.send('HOME PAGE');
});

// @desc    Show all memory capsules
// @route   GET /memoryCapsules
// @access  public
app.get('/memoryCapsules', async (req, res) => {
    try {
        console.log('Request received: GET - /memoryCapsules');
        const memoryCapsules = await MemoryCapsule.find({});
        if (!memoryCapsules) {
            console.log('ERROR: No memory capsules found!');
            return res.status(404).json({ message: 'No Memory Capsules found.' });
        }

        // console.log(memoryCapsules);
        res.status(200).json(memoryCapsules);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
});

// @desc    Create new memory capsule
// @route   POST /memoryCapsules
// @access  public
app.post('/memoryCapsules', async (req, res) => {
    try {
        console.log('Request received: POST - /memoryCapsules');
        console.log(req.body);

        const { title, description, scheduledDateOfOpening } = req.body;
        if (!title || !description || !scheduledDateOfOpening) {
            console.log('ERROR: Invalid request body!');
            return res.status(400).json({ message: 'Invalid request body.' });
        }

        // Create new Memory Capsule - Stores Date in UTC
        const memoryCapsule = await MemoryCapsule.create({
            title,
            description,
            dateOfCreation: new Date(),
            scheduledDateOfOpening,
        });

        memoryCapsule.save();
        res.status(200).json(memoryCapsule);
        // res.status(200).json({ message: 'New Memory Capsule created' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
});

// @desc    Get a single memory capsule
// @route   GET /memoryCapsules/:id
// @access  public
app.get('/memoryCapsules/:id', async (req, res) => {
    try {
        console.log('Request received: GET - /memoryCapsules/:id');

        const { id } = req.params;
        // console.log(id);

        const memoryCapsule = await MemoryCapsule.findById(id);
        if (!memoryCapsule) {
            console.log('ERROR: Memory Capsule not found!');
            return res.status(404).json({ message: 'Memory Capsule not found.' });
        }

        console.log(memoryCapsule);
        res.status(200).json(memoryCapsule);
        // res.status(200).json({ message: 'Get single memory capsule' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
});

// 1. get all capsules - done (base logic)
// 2. create capsule - done (base logic)
// 3. get single capsule - done (base logic)
// 4. update capsule
// 5. delete capsule

// Listener
app.listen(PORT, () => console.log(`Listening on port ${PORT}!`));