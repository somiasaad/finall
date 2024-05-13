const multer = require("multer");
const { v4: uuidv4 } = require('uuid');
const { AppError } = require("../utils/AppError.cjs");

let options = (folderName) => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `uploads/${folderName}`)
        },
        filename: function (req, file, cb) {

            cb(null, uuidv4() + '-' + file.originalname)
        }
    })
    return multer({ storage })
}
const uploadFile = (fieldName, folderName) => options(folderName).single(fieldName)

module.exports = uploadFile;