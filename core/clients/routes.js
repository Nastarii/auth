const express = require('express');
const router = express.Router();
const Client = require('./model');

// Insert a new client
router.post('/', async (req, res) => {
    const { name, lastname, email } = req.body;
    await Client.create({ name, lastname, email }).then(client => {
        res.status(200).json({status: true});
    }).catch(err => {
        res.status(400).json(err);
    });
});

// Update a client
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, lastname, email } = req.body;
    try {
        const client = await Client.findByIdAndUpdate(id, { name, lastname, email }, { new: true });
        if (client) {
            res.status(200).json({ status: true });
        } else {
            res.status(404).json({ status: false, message: 'Client not found' });
        }
    } catch (err) {
        res.status(400).json(err);
    }
});

// Delete a client
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const client = await Client.findByIdAndDelete(id);
        if (client) {
            res.status(200).json({ status: true });
        } else {
            res.status(404).json({ status: false, message: 'Client not found' });
        }
    } catch (err) {
        res.status(400).json(err);
    }
});

// Get all clients
router.get('/', async (req, res) => {
    try {
        const clients = await Client.findAll();
        res.status(200).json(clients);
    } catch (err) {
        res.status(400).json(err);
    }
});

module.exports = router;
