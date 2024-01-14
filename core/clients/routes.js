const express = require('express');
const router = express.Router();

const db = require('../../bootstrap');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const Client = require('./model');
const Credential = require('../credential/model');

const { handleAccessTokenPolicy } = require('../authentication/jwt/service');
const { handlePasswordPolicy } = require('../authentication/sign/controller');
const { sendEmail, getEmailTemplate } = require('../authentication/email/service');

// Update a client data
router.put('/update', async (req, res) => {
    const transaction = await db.transaction();

    const { name, lastname, username, email, password } = req.body;
    let newPassword = password;

    try {

        //Route Security
        const tokenData = handleAccessTokenPolicy(req);

        if (!tokenData) {
            throw new Error('Invalid authorization header');
        }

        // Search client data
        const client = await Client.findAll({
            where: {
                id: tokenData.id
            }
        });

        // Search Credenttials
        const credential = await Credential.findAll({
            where: {
                clientId: tokenData.id
            }
        });

        const isSamePassword = bcrypt.compareSync(newPassword, credential[0].password);

        if(isSamePassword) {
            await Credential.update({ username }, {
                where: {
                    clientId: tokenData.id
                }
            }, { transaction });
        } else {
            newPassword = handlePasswordPolicy(newPassword);
            await Credential.update({ username, password: newPassword }, {
                where: {
                    clientId: tokenData.id
                }
            }, { transaction });
        }

        // Check if client try to update email
        if (client[0].email !== email) {
            
            const token = jwt.sign(
                { id: client[0].id, type: 0 },
                process.env.JWT_SECRET,
                { expiresIn: '7d' },
            )
    
            const templateHTML = getEmailTemplate('confirmationEmail.html', { 
                token: token,
                port: process.env.PORT,
                name: process.env.NAME,
                domain: process.env.DOMAIN 
            });
            
            await Client.update({ name, lastname, active: false, email}, {
                where: {
                    id: tokenData.id
                }
            }, { transaction });

            await sendEmail({
                to: email,
                subject: `${process.env.NAME} Updated Email Confirmation`,
                html: templateHTML
            }) 


        } else {
            await Client.update({ name, lastname, active: true}, {
                where: {
                    id: tokenData.id
                }
            }, { transaction });
        }  

        await transaction.commit();
        
        res.status(200).json({ msg: 'client successfully updated' });

    } catch (error) {
        await transaction.rollback();
        res.status(400).json({ msg: error.message });
    }
});

// Get client by id
router.get('/', async (req, res) => {
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
        res.status(200).json(client[0]);
    } catch (error) {
        res.status(404).json({ msg: error.message});
    }
});

module.exports = router;
