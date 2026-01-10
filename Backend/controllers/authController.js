const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, recoveryEmail, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            recoveryEmail,
            password,
            onboardingComplete: false
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                onboardingComplete: user.onboardingComplete,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile (Onboarding)
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.role = req.body.role || user.role;

        // Admin/Owner Fields
        if (req.body.role === 'Owner' || req.body.role === 'Admin') {
            user.position = req.body.position || user.position;
            user.teamName = req.body.teamName || user.teamName;
            user.teamSize = req.body.teamSize || user.teamSize;
        }

        // Member Fields
        if (req.body.role === 'Member') {
            user.projectName = req.body.projectName || user.projectName;
            user.jobFunction = req.body.jobFunction || user.jobFunction;
        }

        // Mark onboarding as complete
        user.onboardingComplete = true;

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            onboardingComplete: updatedUser.onboardingComplete,
            token: generateToken(updatedUser._id),
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

module.exports = { registerUser, updateUserProfile };
