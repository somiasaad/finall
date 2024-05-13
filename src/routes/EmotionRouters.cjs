const express = require('express');
const router = express.Router();
const { createEmotion,
    getDailyEmotionsByUserId,
    getMonthlyEmotionsByUserId,
    getYearlyEmotionsByUserId } = require('../controllers/EmotionController.cjs');
const { auth } = require('../middleware/auth.cjs');

router.post('/create', auth, createEmotion);
router.get('/daily', auth, getDailyEmotionsByUserId);
router.get('/monthly', auth, getMonthlyEmotionsByUserId);
router.get('/yearly', auth, getYearlyEmotionsByUserId);

module.exports = router;
