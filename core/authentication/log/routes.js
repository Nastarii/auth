const express = require('express');
const router = express.Router();
const db = require('../../../bootstrap');

const Client = require('../../clients/model');
const Credential = require('../../credential/model');
const Authorization = require('../../authorization/model');


// Log in a client
router.post('/', async (req, res) => {
    const transaction = await db.transaction();

    try {
        const { username, email, password } = req.body;

        handlePasswordPolicy(password);

        // TODO: Logic to create a client JWT

        await transaction.commit();

        res.status(200).json({ msg: 'client successfully logged' });

    } catch (error) {
        await transaction.rollback();

        const [code, field] = handleViolations(error);

        res.status(code).json({ msg: `${field && field} ${error.message}` });
    }
});

// Log out a client
router.put('/:id', async (req, res) => {
    // TODO: Logic to expire a client JWT
});

module.exports = router;
