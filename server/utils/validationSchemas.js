const Joi = require('joi');

module.exports.memoryCapsuleValidationSchema = Joi.object({
    title: Joi.string().required().alphanum().min(1),
    dateOfCreation: Joi.date(),
    dateOfOpening: Joi.date().required(),
    photosArr: Joi.array(),
    videosArr: Joi.array(),
    audioArr: Joi.array(),
    textArr: Joi.array(),
    tags: Joi.array(),
});

module.exports.userRegisterValidationSchema = Joi.object({
    username: Joi.string().required().min(3),
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'in'] } }),
    password: Joi.string().required().min(6).max(14),
    name: Joi.string().required(),
});

module.exports.userLoginValidationSchema = Joi.object({
    username: Joi.string().min(3),
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'in'] } }),
    password: Joi.string().required().min(6).max(14),
});