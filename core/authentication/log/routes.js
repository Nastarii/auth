const express = require('express');
const router = express.Router();

var jwt = require('jsonwebtoken');

const Client = require('../../clients/model');
const Credential = require('../../credential/model');

const { handlePasswordPolicy, handleViolations, handleLogs } = require('./controller');

// Log in a client
router.post('/in', async (req, res) => {
    let clientId = null;
    let attemptIp = null;

    try {
        const { username, email, password, ip } = req.body;
        attemptIp = ip;

        const client = await Client.findAll({
            where: {
                email: email
            }
        });

        if (client.length === 0) {
            throw new Error('Email not found');
        }

        if (!client[0].active) {
            throw new Error('Client email not verified');
        }

        clientId = client[0].id;
        const credential = await Credential.findAll({
            where: {
                clientId
            }
        });
        
        const hashedPassword = credential[0].password;
        handlePasswordPolicy(password, hashedPassword);

        await handleLogs(clientId, attemptIp, true, true);

        const token = jwt.sign(
            { id:  clientId, type: 2 },
            process.env.JWT_SECRET,
            { expiresIn: '7d' },
        )

        res.status(200).json({ msg: 'client successfully logged', token: token });

    } catch (error) {

        await handleLogs(clientId, attemptIp, true, false);
        const code = handleViolations(error);

        res.status(code).json({ msg: error.message });
    }
});

// Log out a client
router.put('/out/:id', async (req, res) => {
    // TODO: Logic to disable a client JWT
});

module.exports = router;
