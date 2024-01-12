const sendEmail = require('./authentication/email/service');

async function initConfig() {
    const doEmailTest = process.env.SMTP_TEST === 'true' || process.env.SMTP_TEST === '1';
    if (doEmailTest) {
        const successMsg = '📨 Your SMTP settings are properly configured!';
        let success = true;
        const sentMail = await sendEmail({
            to:process.env.SMTP_USER,
            subject: 'Settings Verification ✔',
            text: successMsg,
        }).catch(error => {
            console.log(error)
            success = false;
        });
        const mailerMsg = (sentMail.accepted.length > 0 && success) ? successMsg : '📩 Your SMTP failed!';
        console.log(mailerMsg);
    }

}

module.exports=initConfig;