const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EmotionSchema = new mongoose.Schema({
    userId: Schema.Types.ObjectId,
    status: { type: String, enum: ["happy", "angry", "sad", "neutral", "calm", "fear", "disgust", "surprised"], required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Emotion = mongoose.model("Emotion", EmotionSchema);

module.exports = Emotion;


