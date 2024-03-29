const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');

const Client = require('../../clients/model');
const Credential = require('../../credential/model');

const { sendEmail, getEmailTemplate, generateActivationCode, generateRandomPassword } = require('./service');
const { handleAccessTokenPolicy } = require('../jwt/service');

router.post('/resend', async (req, res) => {
    const { email } = req.body;
    let errorCode = 500;

    await Credential.findAll({
        where: {
            email: email
        }
    }).then(async credential => {
        if (credential.length === 0) {
            errorCode = 404;
            throw new Error('Email not found');
        }

        if (credential[0].active) {
            errorCode = 403;
            throw new Error('Client already verified!');
        }

        const token = jwt.sign(
            { id: credential[0].clientId, type: 0 },
            process.env.JWT_SECRET,
            { expiresIn: '7d' },
        )

        const templateHTML = getEmailTemplate('confirmationEmail.html', { 
            token: token,
            port: process.env.PORT,
            name: process.env.NAME,
            domain: process.env.DOMAIN 
        });
    
        await sendEmail({
            to: email,
            subject: `${process.env.NAME} Resent Confirmation Email`,
            html: templateHTML
        })

        res.status(200).json({ msg: 'email was resent successfully' });
    }).catch(error => {
        res.status(errorCode).json({ msg: error.message});
    });
});

router.post('/recover', async (req, res) => {
    const { email } = req.body;
    let errorCode = 500;

    await Credential.findAll({
        where: {
            email: email
        }
    }).then(async credential => {
        if (credential.length === 0) {
            errorCode = 404;
            throw new Error('Email not found');
        }

        if (!credential[0].active) {
            errorCode = 403;
            throw new Error('Client email not verified');
        }

        const activationCode = generateActivationCode();

        const token = jwt.sign(
            { id: credential[0].clientId, activationCode: activationCode, type: 1 },
            process.env.JWT_SECRET,
            { expiresIn: '5m' },
        )

        const templateHTML = getEmailTemplate('recoverPassEmail.html', { 
            activationCode: activationCode,
            port: process.env.PORT,
            name: process.env.NAME,
            domain: process.env.DOMAIN 
        });
    
        await sendEmail({
            to: email,
            subject: `${process.env.NAME} Recover Password Email`,
            html: templateHTML
        })

        res.status(200).json({ msg: 'recover password email was sent successfully', token: token  });
    }).catch(error => {
        res.status(errorCode).json({ msg: error.message});
    });
});

router.post('/verify/activationCode', async (req, res) => {
    try {
        const { activationCode } = req.body;
        const tokenData = handleAccessTokenPolicy(req, tokenType=1);
        if(!tokenData) {
            throw new Error('Invalid authorization header');
        }
        if (tokenData.activationCode !== activationCode) {
            throw new Error('Wrong activation code provided');
        }

        const {newPassword, newHashedPassword} = generateRandomPassword();
        await Credential.update({ password: newHashedPassword },{
            where: {
                clientId: tokenData.id
            }
        });

        res.status(200).json({ msg: 'activation code successfully verified', newPassword: newPassword });

    } catch (error) {

        res.status(400).json({ msg: error.message });
    }
});

/*
* Verify account
*/
router.get('/verify', async (req, res) => {

    try {
        const token = req.query.token;
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                throw new Error('Invalid token');
            }

            if (decoded.type !== 0) {
                throw new Error('Wrong token type');
            }

            await Credential.update({
                active: true,
            },{
                where: {
                    clientId: decoded.id
                }
            });

            const accessToken = jwt.sign(
                { id:  decoded.id, type: 2 },
                process.env.JWT_SECRET,
                { expiresIn: '7d' },
            );
            res.status(200).json({ msg: 'client successfully verified', token: accessToken });
        });


    } catch (error) {

        res.status(400).json({ msg: error.message });
    }
});

module.exports = router;