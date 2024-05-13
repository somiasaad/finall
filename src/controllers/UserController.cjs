
const User = require('../models/User.cjs')
const sendToEmail = require('../mails/sendEmail.cjs')
const catchAsyncError = require('../middleware/catchAsyncError');
const AppError = require('../utils/AppError.cjs');


const signUp = catchAsyncError(async (req, res, next) => {
    // Check if email is already registered
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
        return next(new AppError("Account already exists", 403));
    }

    // Set image cover if provided
    if (req.file) {
        req.body.imgCover = req.file.filename;
    }

    // Create fullname from firstname and lastname
    req.body.fullname = `${req.body.firstname} ${req.body.lastname}`;

    try {
        // Create new user
        const user = await User.create(req.body);

        // Send email verification
        await sendToEmail({ email: req.body.email });

        res.status(201).json({ message: "Success", user });
    } catch (error) {
        res.status(400).json({ message: "Error", error });
        // next(error);
        console.log(error);
    }
});

// update the information of user
const updateData = catchAsyncError(async (req, res, next) => {
    if (req.body.firstname || req.body.lastname) {
        if (!req.body.firstname || !req.body.lastname) {
            return next(new AppError("Both first name and last name are required to update full name", 400));
        }
        req.body.fullname = req.body.firstname + " " + req.body.lastname;
    }

    if (req.file) {
        req.body.imgCover = req.file.filename;
    }

    const user = await User.findById(req.user._id);
    if (!user) {
        return next(new AppError("User not found", 404));
    }

    const newUpdate = await User.findByIdAndUpdate(req.user._id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({ message: "User updated successfully", updatedUser: newUpdate });
});


const getUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    if (!user) return next(new AppError("User not found", 404));
    res.json({ message: "Success", user });
});

const removeAccount = catchAsyncError(async (req, res, next) => {
    await User.findByIdAndDelete(req.user._id);
    res.json({ message: "Account deleted successfully" });
});

module.exports = {
    signUp,
    updateData,
    getUser,
    removeAccount
}