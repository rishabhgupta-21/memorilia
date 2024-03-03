const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AppError = require('./utils/AppError');
const catchAsync = require('./utils/catchAsync');

// CONSTANTS
const PORT = 3000;
const JWT_SECRET = 'pTlNvXNvOROXaglSg28sdgcRtEHAgVz8';

// Models
const MemoryCapsule = require('./models/memoryCapsule');
const User = require('./models/user');

// JOI Validation Schemas
const { memoryCapsuleValidationSchema, userRegisterValidationSchema, userLoginValidationSchema } = require('./utils/validationSchemas');

// Connecting to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/memoriliaDB')
    .then(() => console.log('Connected to MongoDB!'))
    .catch(error => console.log(error));
mongoose.connection.on('error', error => console.log(error));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const validateMemoryCapsule = (req, res, next) => {
    // Validate req.body wrt JOI Validation Schema
    const { value, error } = memoryCapsuleValidationSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new AppError(msg, 400);
    }
    console.log(value);
    return next();
}

const validateUserRegister = (req, res, next) => {
    // Validate req.body wrt JOI Validation Schema
    const { value, error } = userRegisterValidationSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new AppError(msg, 400);
    }
    console.log(value);
    return next();
}

const validateUserLogin = (req, res, next) => {
    // Validate req.body wrt JOI Validation Schema
    const { value, error } = userLoginValidationSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new AppError(msg, 400);
    }
    console.log(value);
    return next();
}

const validateToken = catchAsync(async (req, res, next) => {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;
    // Why are there two options here?
    // Because the Authorization header is case-insensitive.
    // So, the user can send the token in either Authorization or authorization header.
    // We need to check both the options.

    if (authHeader && authHeader.startsWith('Bearer')) {
        // Extract the Token
        token = authHeader.split(' ')[1];

        // Verify the Token
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            // Throw error if err exists
            if (err) {
                throw new AppError('User is Not Authorized!', 401); // Unauthorized
            }

            // If Authorization Code is correct, attach the decoded user data to the request object's user property
            req.user = decoded.user;

            // Call the next() function to pass control to the next middleware function
            next();
        })
    }
    else {
        throw new AppError('User is Not Authorized!', 401); // Unauthorized
    }
})


// ROUTES
// USER ROUTES

// @desc    Register a new user
// @route   POST /users/register
// @access  public
app.post('/users/register', validateUserRegister, catchAsync(async (req, res) => {
    // To register, we need username, email, password, name
    const { username, email, password, name } = req.body;

    // Check if the user already exists
    const userAvailable = await User.findOne({ username });
    if (userAvailable) {
        throw new AppError('User already exists!', 400);
    }

    // Auto-Salt and Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Register the User
    const user = new User({
        username,
        email,
        password: hashedPassword,
        name,
    });
    await user.save();

    if (user) {
        res.status(201).json(user);
    }
    else {
        throw new AppError("Invalid User Data!", 400);
    }
}));

// @desc    Login a user
// @route   POST/api/users/login
// @access  public
app.post('/users/login', validateUserLogin, catchAsync(async (req, res) => {
    // To login, we need email & password
    const { email, password } = req.body;

    // Check if User exists
    const user = await User.findOne({ email });
    if (!user) {
        throw new AppError("Invalid Email!", 401);
    }

    // Compare password to hashedPassword that is stored in DB
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        throw new AppError('Invalid Password!', 401);
    }

    // Create Access Token (JWT)
    const accessToken = jwt.sign({      // payload
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
        },
    },
        JWT_SECRET,     // secret
        { expiresIn: '1d' }         // expiry time
    );

    // Send back the Access Token to the Client
    res.status(200).json({ accessToken });
}));


// CONTACT ROUTES
// @desc    Home Page
// @route   GET/
// @access  public
app.get('/', (req, res) => {
    res.send('Home Page');
});

// @desc    Find all Capsules
// @route   GET/capsules
// @access  private
app.get('/capsules', catchAsync(async (req, res) => {
    const capsules = await MemoryCapsule.find({});
    res.status(200).json(capsules);
}));

// @desc    Create a new Capsule
// @route   POST /capsules
// @access  private
app.post('/capsules', validateMemoryCapsule, catchAsync(async (req, res) => {
    const newCapsule = new MemoryCapsule(req.body);
    await newCapsule.save();
    res.status(201).json(newCapsule);
}));

// @desc    Find One Capsule
// @route   GET/capsules/:id
// @access  private
app.get('/capsules/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const capsule = await MemoryCapsule.findById(id);
    if (!capsule) {
        throw new AppError('Capsule does not exist!', 404);
    }
    res.status(200).json(capsule);
}));

// @desc    Update a Capsule
// @route   PUT/capsules/:id
// @access  private
app.put('/capsules/:id', validateMemoryCapsule, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const capsule = await MemoryCapsule.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    if (!capsule) {
        throw new AppError('Capsule does not exist!', 404);
    }
    await capsule.save();
    res.status(200).json(capsule);
}));

// @desc    Delete a Capsule
// @route   DELETE/capsules/:id
// @access  private
app.delete('/capsules/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const capsule = await MemoryCapsule.findById(id);
    if (!capsule) {
        throw new AppError('Capsule does not exist!', 404);
    }
    await MemoryCapsule.findByIdAndDelete(id);
    res.status(200).json({ message: 'Deleted' });
}));


// Error Handling Middleware
app.all('*', (req, res, next) => {
    next(new AppError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    const { message = 'Something went wrong!', statusCode = 500 } = err;

    const titleMap = {
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Forbidden',
        404: 'Not Found',
        500: 'Internal Server Error'
    }

    const title = titleMap[statusCode];
    res.status(statusCode).json({ title, message: message, stackTrace: err.stack });
});

// Listener
app.listen(PORT, () => console.log(`Listening on port ${PORT}!`));