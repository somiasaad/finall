const express = require('express');
const router = express.Router();
const uploadFile = require('../middleware/uploadfile.cjs');
const { auth } = require('../middleware/auth.cjs');
const userController = require('../controllers/UserController.cjs');

router.post("/signup", uploadFile("image", "user"), userController.signUp);
router.put("/update-info", auth, uploadFile("image", "user"), userController.updateData);

router.get("/me", auth, userController.getUser);
router.delete("/account", auth, userController.removeAccount);

module.exports = router;