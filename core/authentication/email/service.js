const nodemailer = require('nodemailer');

async function sendEmail(mailCustomOptions) {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_KEY,
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const mailDefaultOptions = {
        from: process.env.SMTP_USER,
    };

    return await transporter.sendMail({ ...mailDefaultOptions, ...mailCustomOptions});
}

module.exports = sendEmail;