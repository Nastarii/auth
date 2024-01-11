const express = require('express');
const router = express.Router();
const db = require('../../../bootstrap');

const Client = require('../../clients/model');
const Credential = require('../../credential/model');
const Authorization = require('../../authorization/model');

const { handleViolations, handlePasswordPolicy } = require('./controller');

// POST /signin
router.post('/', async (req, res) => {
    const transaction = await db.transaction();

    try {
        const { name, lastname, username, email, password } = req.body;

        const hashPassword = handlePasswordPolicy(password);

        const expiresAt = new Date();
        expiresAt.setFullYear(expiresAt.getFullYear() + 2);

        const client = await Client.create({ 
            name, 
            lastname, 
            email 
        }, { transaction });

        await Authorization.create({ 
            clientId: client.id,
            role: -1,
            expiresAt: expiresAt,
        }, { transaction });

        await Credential.create({
            clientId: client.id,
            username: username ? username: email,
            password: hashPassword,
        }, { transaction });

        await transaction.commit();

        res.status(200).json({ msg: 'client successfully created' });

    } catch (error) {
        await transaction.rollback();

        const [code, field] = handleViolations(error);

        res.status(code).json({ msg: `${field && field} ${error.message}` });
        /* if (error.message === 'Password Policy Violation') {
            res.status(402).json({ msg: error.message });
            return;
        }


        if (UniqueViolationError) {
            res.status(403).json({ msg: `${UniqueViolationError} already exists` });
            return;
        }

        res.status(500).json({ msg: 'internal server error' }); */
    }
});

module.exports = router;
