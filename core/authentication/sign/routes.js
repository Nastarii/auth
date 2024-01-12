const express = require('express');
const router = express.Router();

var jwt = require('jsonwebtoken');
const db = require('../../../bootstrap');

const Client = require('../../clients/model');
const Credential = require('../../credential/model');
const Authorization = require('../../authorization/model');

const { handleViolations, handlePasswordPolicy, handleEmailPolicy } = require('./controller');

// Sign in a client
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

        const authorization = await Authorization.create({ 
            clientId: client.id,
            role: -1,
            expiresAt: expiresAt,
        }, { transaction });

        await Credential.create({
            clientId: client.id,
            authorizationId: authorization.id,
            username: username ? username: email,
            password: hashPassword,
        }, { transaction });

        await handleEmailPolicy(client.id, email);

        const token = jwt.sign(
            { id:  client.id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' },
        )

        await transaction.commit();

        res.status(200).json({ msg: 'client successfully created', token: token });

    } catch (error) {
        await transaction.rollback();

        const [code, field] = handleViolations(error);

        res.status(code).json({ msg: `${field && field} ${error.message}` });
    }
});

// Sign out a client
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const transaction = await db.transaction();

    try {
        await Credential.destroy({
            where:{
                clientId: id,
            }}, { transaction});
        
        await Authorization.destroy({
            where:{
                clientId: id,
            }}, { transaction});
        
        await Client.destroy({
            where:{
                id: id,
            }}, { transaction});

        await transaction.commit();
        
        res.status(200).json({ msg: 'client successfully deleted' });

    } catch (error) {

        await transaction.rollback();

        res.status(500).json(error);
    }
});

module.exports = router;
