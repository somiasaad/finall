const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { html } = require('./html.cjs');


const sendToEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: 'outlook',
        auth: {
            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            user: "mohamed666888222@outlook.com",
            pass: "mo7$@4321",
        },
    });
    let token = jwt.sign({ email: options.email }, 'email123456')
    const info = await transporter.sendMail({
        from: '"Mohamed 👻" <mohamed666888222@outlook.com>', // sender address
        to: options.email, // list of receivers
        subject: "Confirm Your Email ✔", // Subject line
        html: html(token), // html body
    });
}
module.exports = { sendToEmail }
