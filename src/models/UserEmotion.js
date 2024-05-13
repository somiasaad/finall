const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserEmotionSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  emoId: {
    type: Schema.Types.ObjectId,
    ref: "Emotion",
  },
  date: {
    type: Date,
    default: Date.now(),
  }
});

const UserEmotion = mongoose.model("UserEmotion", UserEmotionSchema);

module.exports = UserEmotion;


