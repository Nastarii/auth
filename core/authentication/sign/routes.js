const express = require('express');
const router = express.Router();
const Client = require('../../clients/model');
const Authorization = require('../../authorization/model');
const db = require('../../../bootstrap');

// POST /signin
router.post('/', async (req, res) => {
    const transaction = db.transaction();

    try {
        const { name, lastname, email } = req.body;
        const client = await Client.create({ 
            name, 
            lastname, 
            email 
        }, { transaction });

        const authorization = await Authorization.create({ 
            clientId: client.id,
            role: -1,
        }, { transaction });

        await transaction.commit();
        res.status(200).json({ status: true });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ error: 'Failed to create client' });
    }
});

module.exports = router;
