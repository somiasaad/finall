const express = require('express');
const { AppError } = require('./src/utils/AppError.cjs');
const { dbconnection } = require('./databases/dbconnection.cjs');
const cors = require('cors');
const AuthRouter = require('./src/routes/AuthRouters.cjs');
const UserRouter = require('./src/routes/UserRouter.cjs');
const EmotionRouter = require('./src/routes/EmotionRouters.cjs');
const dotenv = require('dotenv');
// const compression = require('compression');


const app = express()
dotenv.config()
// app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('uploads/user'))
app.use(cors())


app.use('/users', UserRouter);
app.use("/emotions", EmotionRouter);
app.use("/auth", AuthRouter);



app.all('*', (req, res, next) => {
    next(new AppError("Page Not Found " + req.originalUrl, 404))
})
app.use((err, req, res, next) => {
    let code = err.statusCode || 403
    res.status(code).json({ message: err.message })
})

dbconnection()
app.listen(process.env.PORT || 5001, () => {
    console.log(`Server is Running ... ${process.env.PORT}`);
})