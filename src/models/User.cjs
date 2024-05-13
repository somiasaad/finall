const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const Schema = mongoose.Schema;

const userSchema = mongoose.Schema({
    firstname: {
        type: String,
        trim: true,
        required: true
    },
    lastname: {
        type: String,
        trim: true,
        required: true
    },
    fullname: String,
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true
    },
    birthday: {
        type: Date,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    confrimEmail: {
        type: Boolean,
        default: false
    },
    imgCover: {
        type: String,
        default: null
    },

    logout: Date
}, { timestamps: true })

userSchema.pre('save', function () {
    this.password = bcrypt.hashSync(this.password, 7)
})
userSchema.post('save', function () {
    this.imgCover = dotenv.Url + this.imgCover
})
userSchema.pre('findOneAndUpdate', function () {
    if (this._update.password) this._update.password = bcrypt.hashSync(this._update.password, 8)
})
userSchema.post('init', (ele) => {
    ele.imgCover = dotenv.Url + ele.imgCover
})
const User = mongoose.model('User', userSchema)

module.exports = User;