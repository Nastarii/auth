const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');

const Client = require('../../clients/model');

const { sendEmail, getEmailTemplate, generateActivationCode } = require('./service');

router.post('/resend', async (req, res) => {
    const { email } = req.body;
    let errorCode = 500;

    await Client.findAll({
        where: {
            email: email
        }
    }).then(async client => {
        if (client.length === 0) {
            errorCode = 404;
            throw new Error('Email not found');
        }

        if (client[0].active) {
            errorCode = 403;
            throw new Error('Client already verified!');
        }

        const token = jwt.sign(
            { id: client[0].id, type: 0 },
            process.env.JWT_SECRET,
            { expiresIn: '7d' },
        )

        const templateHTML = getEmailTemplate('confirmationEmail.html', { 
            token: token,
            port: process.env.PORT,
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

    await Client.findAll({
        where: {
            email: email
        }
    }).then(async client => {
        if (client.length === 0) {
            errorCode = 404;
            throw new Error('Email not found');
        }

        if (!client[0].active) {
            errorCode = 403;
            throw new Error('Client email not verified');
        }

        const activationCode = generateActivationCode();

        const token = jwt.sign(
            { id: client[0].id, activationCode: activationCode, type: 1 },
            process.env.JWT_SECRET,
            { expiresIn: '5m' },
        )

        const templateHTML = getEmailTemplate('recoverPassEmail.html', { 
            activationCode: activationCode,
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
        
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                throw new Error('Invalid token');
            }

            if (decoded.type !== 1) {
                throw new Error('Wrong token type');
            }
        });

        res.status(200).json({ msg: 'token successfully verified' });

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

            await Client.update({
                active: true,
            },{
                where: {
                    id: decoded.id
                }
            });
        });

        res.status(200).json({ msg: 'client successfully verified' });

    } catch (error) {

        res.status(400).json({ msg: error.message });
    }
});

module.exports = router;