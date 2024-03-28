const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const AppError = require('./utils/AppError');
const errorHandler = require('./middleware/errorHandler');

// CONSTANTS
const PORT = 3000;

// Models
const MemoryCapsule = require('./models/memoryCapsule');

// Routers
const memoryCapsuleRoutes = require('./routes/memoryCapsuleRoutes');

// Connecting to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/memoriliaDB')
    .then(() => console.log('Connected to MongoDB!'))
    .catch(error => console.log(error));
mongoose.connection.on('error', error => console.log(error));

// Middleware
app.use(cors());
app.use(express.json());

// Routing Middleware
app.use('/memoryCapsules', memoryCapsuleRoutes);

// Routes
// @desc    Home Page
// @route   GET /
// @access  public
app.get('/', (req, res) => {
    res.send('HOME PAGE');
});

// Any other unknown route
app.all('*', (req, res, next) => {
    next(new AppError(404, 'The page you are looking for does not exist.'));
});

// Error Handling Middleware
app.use(errorHandler);

// Listener
app.listen(PORT, () => console.log(`Listening on port ${PORT}!`));