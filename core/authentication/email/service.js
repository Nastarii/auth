const nodemailer = require('nodemailer');
var fs = require('fs');

function addOptionIntoTemplate(html, options) {
    let emailHTML = html;

    for (const key in options) {
        if (options.hasOwnProperty(key)) {
            const value = options[key];
            const regex = new RegExp(`{{${key}}}`, 'g');
            emailHTML = emailHTML.replace(regex, value);
        }
    }

    return emailHTML;
}

function getEmailTemplate(templateFilename, options) {
    const templatePath  = `${__dirname}\\templates\\${templateFilename}`
    if (fs.existsSync(templatePath)) {
        var data = fs.readFileSync(templatePath, "utf8");
        return addOptionIntoTemplate(data,options);
    } else {
        throw new Error('Failed to Read Template File');
    }
}

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

module.exports = {
    sendEmail,
    getEmailTemplate
};