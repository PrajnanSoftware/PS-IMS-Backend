const User = require('../models/User');

const userRegisterSchema = {
    email: {
        notEmpty: { errorMessage: 'Email is required' },
        isEmail: { errorMessage: 'Email should be in a valid format' },
        custom: {
            options: async (value) => {
                const user = await User.findOne({ email: value });
                if (!user) {
                    return true;
                } else {
                    throw new Error('Email already exists');
                }
            }
        },
        trim: true,
        normalizeEmail: true
    },
    password: {
        notEmpty: { errorMessage: 'Password is required' },
        isLength: {
            options: { min: 8, max: 128 },
            errorMessage: 'Password must be between 8-128 characters long'
        },
        trim: true
    },
    
};

const userLoginSchema = {
    email: {
        notEmpty: { errorMessage: 'Email is required' },
        isEmail: { errorMessage: 'Email should be in a valid format' },
        trim: true,
        normalizeEmail: true
    },
    password: {
        notEmpty: { errorMessage: 'Password is required' },
        isLength: {
            options: { min: 8, max: 128 },
            errorMessage: 'Password must be between 8-128 characters long'
        },
        trim: true
    }
};

module.exports = {
    userRegisterSchema,
    userLoginSchema
};
