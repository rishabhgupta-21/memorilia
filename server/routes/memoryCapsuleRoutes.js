const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

// Controllers
const memoryCapsuleController = require('../controllers/memoryCapsuleController');

// Routes
// @desc    Show all memory capsules
// @route   GET /memoryCapsules
// @access  public
router.get('/', catchAsync(memoryCapsuleController.getAllMemoryCapsules));

// @desc    Create new memory capsule
// @route   POST /memoryCapsules
// @access  public
router.post('/', catchAsync(memoryCapsuleController.createMemoryCapsule));

// @desc    Get a single memory capsule
// @route   GET /memoryCapsules/:id
// @access  public
router.get('/:id', catchAsync(memoryCapsuleController.getMemoryCapsule));

// @desc    Update a single memory capsule
// @route   PUT /memoryCapsules/:id
// @access  public
router.put('/:id', catchAsync(memoryCapsuleController.updateMemoryCapsule));

// @desc    Delete a memory capsule
// @route   DELETE /memoryCapsules/:id
// @access  public
router.delete('/:id', catchAsync(memoryCapsuleController.deleteMemoryCapsule));

module.exports = router;