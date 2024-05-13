
const catchAsyncError = require('../middleware/catchAsyncError');
const User = require('../models/User.cjs');
const { AppError } = require('../utils/AppError.cjs');




const login = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
        return next(new AppError("Account not found", 401));
    }
    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        return next(new AppError("Incorrect password", 403));
    }
    // Check if email is confirmed
    if (!user.confirmEmail) {
        return next(new AppError("Please verify your email and login again"));
    }
    // Generate JWT token
    const tokenPayload = {
        email: user.email,
        userId: user._id,
        firstname: user.firstname,
        lastname: user.lastname,

    };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET);

    res.json({ message: "Success", user, token });
});

// verify Email Address
const verifyEmail = catchAsyncError(async (req, res, next) => {
    const { token } = req.params;
    if (!token) {
        return next(new AppError("Token not provided", 400));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded.email) {
            return next(new AppError("Invalid token", 400));
        }

        await User.findOneAndUpdate(
            { email: decoded.email },
            { confirmEmail: true }
        );

        res.status(200).send(template4());
    } catch (err) {
        return next(new AppError("Failed to verify token", 500));
    }
});
// send confirmation message to the user and redirect back 
const sendToEmailAgain = catchAsyncError(async (req, res, next) => {
    const { email } = req.body;
    if (!email) {
        return next(new AppError("Email is required", 400));
    }

    const user = await User.findOne({ email });
    if (user && !user.confirmEmail) {
        await sendToEmail({ email });
        return res.status(200).json({ message: "Email sent successfully. Please check your inbox." });
    } else {
        return next(new AppError("Email not found or already confirmed.", 403));
    }
});
const changePassword = catchAsyncError(async (req, res, next) => {
    const { newPassword, oldPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return next(new AppError("User not found", 404));
    if (!oldPassword) return next(new AppError("Please enter old password", 400));
    if (!(await bcrypt.compare(oldPassword, user.password))) {
        return next(new AppError("Incorrect old password", 400));
    }
    const newUpdate = await User.findByIdAndUpdate(
        req.user._id,
        { password: newPassword },
        { new: true }
    );
    res.json({ message: "Password changed successfully", newUpdate });
});

const logout = catchAsyncError(async (req, res, next) => {
    req.body.logout = Date.now();
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
        new: true,
    });
    res.json({ message: "Logged out successfully", user });
});


const forgetPassword = catchAsyncError(async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = jwt.sign({ email }, process.env.RESET_PASSWORD_SECRET, { expiresIn: '1h' });
    const resetLink = `${req.protocol}://${req.get('host')}/reset-password/${token}`;

    const info = await sendResetPasswordEmail(email, resetLink);
    if (!info) return res.status(500).json({ message: "Error sending reset password email" });

    res.status(200).json({ message: "Password reset email sent" });
});

const changeResetPassword = catchAsyncError(async (req, res, next) => {
    const { token } = req.params;
    res.send(template3(token));
});

const resetPassword = catchAsyncError(async (req, res, next) => {
    const { token } = req.params;
    const { password } = req.body;
    jwt.verify(token, process.env.RESET_PASSWORD_SECRET, async (err, decoded) => {
        if (err) return res.status(400).json({ message: "Invalid or expired token" });

        const user = await User.findOne({ email: decoded.email });
        if (!user) return res.status(404).json({ message: "User not found" });

        user.password = password;
        await user.save();

        res.status(200).send(template4());
    });
});


module.exports = {
    login,
    verifyEmail,
    sendToEmailAgain,
    changePassword,
    logout,
    forgetPassword,
    changeResetPassword,
    resetPassword,

}