const jwt = require('jsonwebtoken');

async function handleAccessTokenPolicy(req) {

    const header = req.headers.authorization;
    let tokenData = null;
    if(!header || !header.startsWith('Bearer ')) {
        throw new Error('Invalid authorization header');
    }

    const token = header.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            throw new Error('Invalid token');
        }

        if (decoded.type !== 2) {
            throw new Error('Wrong token type');
        }

        tokenData = decoded;
    });
    return tokenData;
}

module.exports = {
    handleAccessTokenPolicy
};