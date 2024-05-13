const jwt = require('jsonwebtoken');
const userModel = require('../models/User.cjs');
const AppError = require('../utils/AppError.cjs');

exports.auth = async (req, res, next) => {
    const { token } = req.headers;
    const { JWT_SECRET } = process.env;

    try {
        if (!token) {
            throw new AppError("Token Must Be Provided", 403);
        }

        const decoded = await jwt.verify(token, JWT_SECRET);
        const user = await userModel.findById(decoded.userId);

        if (!user) {
            throw new AppError("Invalid Token", 403);
        }

        if (user.logout) {
            const userLogout = parseInt(user.logout.getTime() / 1000);
            if (userLogout > decoded.iat) {
                throw new AppError("Login first", 403);
            }
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};
