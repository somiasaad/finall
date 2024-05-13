const express = require('express');
const { auth } = require('../middleware/auth.cjs');
const uploadFile = require('../middleware/uploadfile.cjs');
const { login,
    logout,
    changePassword,
    sendToEmailAgain,
    verifyEmail,
    forgetPassword,
    changeResetPassword, resetPassword } = require('../controllers/AuthController.cjs')
const authController = require('../controllers/AuthController.cjs');
const router = express.Router();


router.post("/login", uploadFile("image", "user"), login);
router.put("/logout", auth, logout);
router.patch("/change-password", auth, changePassword);
router.post("/send-email-again", sendToEmailAgain);
router.get("/verify/:token", verifyEmail);
router.post("/forgot-password", forgetPassword);
// Endpoint to render the password reset page
router.get("/reset-password/:token", changeResetPassword);
// Endpoint to handle password reset form submission
router.post("/reset-password/:token", resetPassword);

module.exports = router;
