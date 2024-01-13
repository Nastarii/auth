const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const Client = require('../../clients/model');

router.post('/recover/password', async (req, res) => {});

/*
* Verify account
*/
router.get('/verify', async (req, res) => {

    try {
        const token = req.query.token;
        
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                throw new Error('Invalid token');
            }

            if (decoded.type !== 0) {
                throw new Error('Wrong token type');
            }

            await Client.update({
                active: true,
            },{
                where: {
                    id: decoded.id
                }
            });
        });

        res.status(200).json({ msg: 'client successfully verified' });

    } catch (error) {

        res.status(400).json({ msg: error.message });
    }
});

module.exports = router;