const express = require('express');
const router = express.Router();
const Client = require('./model');
const { handleAccessTokenPolicy } = require('../authentication/jwt/service');

// Update a client data
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, lastname, email } = req.body;
    try {
        const tokenData = handleAccessTokenPolicy(req);

        if (!tokenData) {
            throw new Error('Invalid authorization header');
        }

        const client = await Client.update({ name, lastname, email },{
            where: {
                id:id
            }
        });
        if (client) {
            res.status(200).json({ status: true });
        } else {
            res.status(404).json({ status: false, message: 'Client not found' });
        }
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

// Get client by id
router.get('/:id', async (req, res) => {
    try {
        const tokenData = handleAccessTokenPolicy(req);

        if (!tokenData) {
            throw new Error('Invalid authorization header');
        }

        const client = await Client.findAll({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json(client);
    } catch (error) {
        res.status(404).json({ msg: error.message});
    }
});

// Get all clients
router.get('/', async (req, res) => {

    try {
        const tokenData = handleAccessTokenPolicy(req);

        if (!tokenData) {
            throw new Error('Invalid authorization header');
        }
        
        const clients = await Client.findAll();
        res.status(200).json(clients);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

module.exports = router;
