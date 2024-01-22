const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');

var jwt = require('jsonwebtoken');

const Credential = require('../../credential/model');

const { handlePasswordPolicy, handleViolations, handleLogs } = require('./controller');
const { handleAccessTokenPolicy } = require('../jwt/service');

// Sign in a client
router.post('/in', async (req, res) => {
    let attemptIp = null;
    let credential = null;

    try {
        const { usercredential, password, ip } = req.body;
        attemptIp = ip;

        credential = await Credential.findAll({
            where: {
                [Op.or]: [
                    { email: usercredential },
                    { username: usercredential }
                ]
            }
        });

        if (credential.length === 0) {
            throw new Error('Email and Username not found');
        }

        if (!credential[0].active) {
            throw new Error('Client email not verified');
        }

        const hashedPassword = credential[0].password;
        handlePasswordPolicy(password, hashedPassword);

        await handleLogs(credential[0].clientId, attemptIp, true, true);

        const token = jwt.sign(
            { id:  credential[0].clientId, type: 2 },
            process.env.JWT_SECRET,
            { expiresIn: '7d' },
        );

        res.status(200).json({ msg: 'client successfully logged', token: token });

    } catch (error) {

        const clientId = (credential.length !== 0) ? credential[0].clientId: null;

        await handleLogs(clientId, attemptIp, true, false);
        const code = handleViolations(error);

        res.status(code).json({ msg: error.message });
    }
});

module.exports = router;