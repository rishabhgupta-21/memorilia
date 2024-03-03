const express = require('express');
const app = express();
const mongoose = require('mongoose');

// CONSTANTS
const PORT = 3000;

// Models
const MemoryCapsule = require('./models/memoryCapsule');

// Connecting to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/memoriliaDB')
    .then(() => console.log('Connected to MongoDB!'))
    .catch(error => console.log(error));
mongoose.connection.on('error', error => console.log(error));


// ROUTES
// @desc    Home Page
// @route   GET/
// @access  public
app.get('/', (req, res) => {
    res.send('HOME PAGE');
});

// Listener
app.listen(PORT, () => console.log(`Listening on port ${PORT}!`));