
const mongoose = require('mongoose');

const dbconnection = () => {
    mongoose.connect("mongodb://127.0.0.1:27017/node_mongodb")
        .then(() => {
            console.log("database connected .");
        }).catch((err) => {
            console.log("error in connect", err);
        })
}

module.exports = { dbconnection }
// mongodb://127.0.0.1:27017/node_mongodb

//mongodb+srv://somiasaad012:AT6qx36UmejSCFmc@cluster0.wdsvst1.mongodb.net/EmotionDB