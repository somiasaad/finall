
const UserEmotion = require('../models/UserEmotion.js');
const Emotion = require('../models/Emotion.cjs');
const catchAsyncError = require('../middleware/catchAsyncError.js');


exports.createEmotion = catchAsyncError(async (req, res) => {

    const userId = req.body.user_id;

    const emotion = req.body.emotion

    const record = new Emotion({ userId, emotion });
    await record.save();

    res.status(200).send('!تم تسجيل المشاعر بنجااح');
})


// daily
exports.getDailyEmotionsByUserId = catchAsyncError(async (req, res) => {
    const { userId } = req.params;

    // Calculate start and end of the current day
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const emotions = await UserEmotion.aggregate([
        {
            $match: {
                userId: mongoose.Types.ObjectId(userId),
                timestamp: { $gte: startOfDay, $lte: endOfDay }
            }
        },
        {
            $group: {
                _id: '$emotion',
                count: { $sum: 1 }
            }
        }
    ]);

    // Create an object to store emotion counts
    const emotionCounts = {};
    emotions.forEach(emotion => {
        emotionCounts[emotion._id] = emotion.count;
    });

    res.status(200).json(emotionCounts);
});
// exports.getDailyEmotionsByUserId = catchAsyncError(async (req, res) => {

//     const { userId } = req.params;

//     // حساب بداية اليوم الحالي
//     const startOfDay = new Date();
//     startOfDay.setHours(0, 0, 0, 0);

//     const emotions = await Emotion.aggregate([
//         {
//             $match: {
//                 userId,
//                 date: { $gte: startOfDay },
//             },
//         },
//         {
//             $group: {
//                 _id: '$emotion',
//                 count: { $sum: 1 },
//             },
//         },
//     ]);

//     const dailyData = { happy: 0, angry: 0, surprised: 0, angry: 0, neutral: 0, calm: 0, fear: 0, disgust: 0 };
//     emotions.forEach((emotion) => {
//         dailyData[emotion._id] = emotion.count;
//     });

//     res.status(200).json({ Day: dailyData });

// })

// Monthly and weekly
exports.getMonthlyEmotionsByUserId = catchAsyncError(async (req, res) => {
    const { userId } = req.params;

    // Calculate the start and end of the current month
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    // Calculate the number of weeks in the current month
    const numWeeks = Math.ceil((endOfMonth.getDate() - startOfMonth.getDate() + 1) / 7);

    // Divide the month into three groups
    const groupSize = Math.ceil(numWeeks / 3);

    // Create an array to store the boundaries of each group
    const groupBoundaries = Array.from({ length: 3 }, (_, i) => ({
        startWeek: i * groupSize + 1,
        endWeek: Math.min((i + 1) * groupSize, numWeeks)
    }));

    // Perform aggregation for each group
    const monthlyEmotions = await Promise.all(groupBoundaries.map(async ({ startWeek, endWeek }) => {
        // Calculate the start and end dates for the current group of weeks
        const startOfWeek = new Date(startOfMonth);
        const endOfWeek = new Date(startOfMonth);
        startOfWeek.setDate(startOfWeek.getDate() + (startWeek - 1) * 7);
        endOfWeek.setDate(endOfWeek.getDate() + endWeek * 7);

        // Aggregate emotions for the current group of weeks
        return UserEmotion.aggregate([
            {
                $match: {
                    userId: mongoose.Types.ObjectId(userId),
                    timestamp: { $gte: startOfWeek, $lte: endOfWeek }
                }
            },
            {
                $group: {
                    _id: '$emotion',
                    count: { $sum: 1 }
                }
            }
        ]);
    }));

    // Combine the results from each group into a single object
    const monthlyEmotionCounts = monthlyEmotions.reduce((result, emotions, index) => {
        result[`Group ${index + 1}`] = emotions.reduce((counts, emotion) => {
            counts[emotion._id] = emotion.count;
            return counts;
        }, {});
        return result;
    }, {});

    res.status(200).json(monthlyEmotionCounts);
});


//Yearly
exports.getYearlyEmotionsByUserId = catchAsyncError(async (req, res) => {
    const { userId } = req.params;

    // Calculate the start and end of the current year
    const currentDate = new Date();
    const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
    const endOfYear = new Date(currentDate.getFullYear(), 11, 31);

    // Calculate the number of months in the current year
    const numMonths = 12;

    // Divide the year into three groups where each group contains four months
    const groupSize = Math.ceil(numMonths / 3);

    // Create an array to store the boundaries of each group
    const groupBoundaries = Array.from({ length: 3 }, (_, i) => ({
        startMonth: i * groupSize + 1,
        endMonth: Math.min((i + 1) * groupSize, numMonths)
    }));

    // Perform aggregation for each group
    const yearlyEmotions = await Promise.all(groupBoundaries.map(async ({ startMonth, endMonth }) => {
        // Calculate the start and end dates for the current group of months
        const startOfMonth = new Date(startOfYear);
        const endOfMonth = new Date(startOfYear);
        startOfMonth.setMonth(startMonth - 1);
        endOfMonth.setMonth(endMonth);

        // Aggregate emotions for the current group of months
        return UserEmotion.aggregate([
            {
                $match: {
                    userId: mongoose.Types.ObjectId(userId),
                    timestamp: { $gte: startOfMonth, $lte: endOfMonth }
                }
            },
            {
                $group: {
                    _id: '$emotion',
                    count: { $sum: 1 }
                }
            }
        ]);
    }));

    // Combine the results from each group into a single object
    const yearlyEmotionCounts = yearlyEmotions.reduce((result, emotions, index) => {
        result[`Group ${index + 1}`] = emotions.reduce((counts, emotion) => {
            counts[emotion._id] = emotion.count;
            return counts;
        }, {});
        return result;
    }, {});

    res.status(200).json(yearlyEmotionCounts);
});

