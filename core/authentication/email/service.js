const nodemailer = require('nodemailer');
var fs = require('fs');

function generateActivationCode() {
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let activationCode = '';
    for (let i = 0; i < 6; i++) {
        activationCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return activationCode;
}

function getEmailTemplate(templateFilename, options) {
    let templatePath = null;
    
    if(process.platform === "win32") {
        templatePath  = `${__dirname}\\templates\\${templateFilename}`
    } else {
        templatePath  = `${__dirname}/templates/${templateFilename}`
    }

    if (fs.existsSync(templatePath)) {
        let html = fs.readFileSync(templatePath, "utf8");
        for (const key in options) {
            if (options.hasOwnProperty(key)) {
                const value = options[key];
                const regex = new RegExp(`{{${key}}}`, 'g');
                html = html.replace(regex, value);
            }
        }
    
        return html;

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
    getEmailTemplate,
    generateActivationCode
};