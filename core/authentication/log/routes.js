const express = require('express');
const router = express.Router();

var jwt = require('jsonwebtoken');

const Client = require('../../clients/model');
const Credential = require('../../credential/model');

const { handlePasswordPolicy, handleViolations, handleLogs } = require('./controller');
const { handleAccessTokenPolicy } = require('../jwt/service');

// Log in a client
router.post('/in', async (req, res) => {
    let client = null;
    let attemptIp = null;
    let credential = null;

    try {
        const { userdata, password, ip } = req.body;
        attemptIp = ip;

        client = await Client.findAll({
            where: {
                email: userdata
            }
        });

        if (client.length === 0) {
            credential = await Credential.findAll({
                where: {
                    username: userdata
                }
            });
            if (credential.length === 0) {
                throw new Error('Email and Username not found');
            }
            client = await Client.findAll({
                where: {
                    id: credential[0].clientId
                }
            });
        }

        if (!client[0].active) {
            throw new Error('Client email not verified');
        }

        if (!credential) {
            
            credential = await Credential.findAll({
                where: {
                    clientId: client[0].id
                }
            });
        }
        
        const hashedPassword = credential[0].password;
        handlePasswordPolicy(password, hashedPassword);

        await handleLogs(client[0].id, attemptIp, true, true);

        const token = jwt.sign(
            { id:  client[0].id, type: 2 },
            process.env.JWT_SECRET,
            { expiresIn: '7d' },
        );

        res.status(200).json({ msg: 'client successfully logged', token: token });

    } catch (error) {

        const clientId = (client.length !== 0) ? client[0].id: null;

        await handleLogs(clientId, attemptIp, true, false);
        const code = handleViolations(error);

        res.status(code).json({ msg: error.message });
    }
});

// Log out a client
router.get('/out', async (req, res) => {
    try {
        const tokenData = handleAccessTokenPolicy(req);

        if (!tokenData) {
            throw new Error('Invalid authorization header');
        }

        const client = await Client.findAll({
            where: {
                id: tokenData.id
            }
        });

        if (client.length === 0) {
            throw new Error('Client not found');
        }
        if (!client[0].active) {
            throw new Error('Client email not verified');
        }
        res.status(200).json({ msg: 'client successfully logged out' });
    } catch(error) {
        res.status(400).json({ msg: error.message });
    }
});

module.exports = router;