import mongoose from "mongoose";

// تعريف نموذج Record
const RecordSchema = new mongoose.Schema({
    userId: String,
    emotion: String,
    date: {
        type: Date,
        default: Date.now()
    },
});




const Record = mongoose.model("Record", RecordSchema);

export default Record;
